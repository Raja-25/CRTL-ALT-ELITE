import os
from databricks import sql
from dotenv import load_dotenv
import pandas as pd
load_dotenv()

class DatabricksClient:
    def __init__(self):
        self.host = os.getenv("DATABRICKS_HOST")
        self.http_path = os.getenv("DATABRICKS_HTTP_PATH")
        self.token = os.getenv("DATABRICKS_TOKEN")
        self.catalog = os.getenv("DATABRICKS_CATALOG", "postgres_apac")
        self.schema = os.getenv("DATABRICKS_SCHEMA", "base_data")
        self.connection = None

    def connect(self):
        """Establish connection to Databricks"""
        try:
            self.connection = sql.connect(
                server_hostname=self.host,
                http_path=self.http_path,
                auth_type="pat",
                access_token=self.token
            )
            print("✓ Connected to Databricks successfully")
            return self.connection
        except Exception as e:
            print(f"✗ Failed to connect to Databricks: {str(e)}")
            raise

    def execute_query(self, query: str):
        """Execute a query and return results as a pandas DataFrame"""
        if not self.connection:
            self.connect()
        
        try:
            cursor = self.connection.cursor()
            cursor.execute(query)
            # Fetch all results
            results = cursor.fetchall()
            # Get the column names
            columns = [desc[0] for desc in cursor.description]
            cursor.close()
            
            # Create a pandas DataFrame from the results
            df = pd.DataFrame(results, columns=columns)
            return df
        except Exception as e:
            print(f"✗ Query execution failed: {str(e)}")
            raise

    def fetch_table_data(self, table_name: str, limit: int = 100, catalog: str = None, schema: str = None):
        """Fetch data from a specific table"""
        if catalog is None:
            catalog = self.catalog
        if schema is None:
            schema = self.schema
        # Handle full table name or just table name
        if "." not in table_name:
            table_name = f"{catalog}.{schema}.{table_name}"
        query = f"SELECT * FROM {table_name} LIMIT {limit}"
        return self.execute_query(query)

    def list_tables(self, schema: str = None, catalog: str = None):
        """List all tables in a schema"""
        if catalog is None:
            catalog = self.catalog
        if schema is None:
            schema = self.schema
        query = f"SHOW TABLES IN {catalog}.{schema}"
        _, results = self.execute_query(query)
        tables = [row[0] if len(row) == 1 else row[1] for row in results]
        return tables

    def list_catalogs(self):
        """List all available catalogs"""
        query = "SHOW CATALOGS"
        _, results = self.execute_query(query)
        catalogs = [row[0] for row in results]
        return catalogs

    def list_schemas(self, catalog: str = None):
        """List all schemas in a catalog"""
        if catalog is None:
            catalog = self.catalog
        query = f"SHOW SCHEMAS IN {catalog}"
        _, results = self.execute_query(query)
        schemas = [row[0] if len(row) == 1 else row[1] for row in results]
        return schemas

    def get_table_schema(self, table_name: str, catalog: str = None, schema: str = None):
        """Get schema/columns of a table"""
        if catalog is None:
            catalog = self.catalog
        if schema is None:
            schema = self.schema
        # Handle full table name or just table name
        if "." not in table_name:
            table_name = f"{catalog}.{schema}.{table_name}"
        query = f"DESCRIBE TABLE {table_name}"
        columns, results = self.execute_query(query)
        return results

    def close(self):
        """Close the connection"""
        if self.connection:
            self.connection.close()
            print("✓ Connection closed")

    def __enter__(self):
        self.connect()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()