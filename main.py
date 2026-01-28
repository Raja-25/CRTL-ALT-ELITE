from fastapi import FastAPI
from fastapi.responses import Response, JSONResponse
from fastapi.encoders import jsonable_encoder
from databricks_client import DatabricksClient
import os
from dotenv import load_dotenv
from datetime import datetime, date
import json

load_dotenv()

class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        return super().default(obj)

app = FastAPI(title="Databricks API", version="1.0.0")

# Initialize Databricks client
db_client = DatabricksClient()

@app.on_event("startup")
async def startup_event():
    """Connect to Databricks on startup"""
    try:
        db_client.connect()
    except Exception as e:
        print(f"Warning: Could not connect to Databricks on startup: {str(e)}")

@app.on_event("shutdown")
async def shutdown_event():
    """Close Databricks connection on shutdown"""
    db_client.close()

@app.get("/")
async def root():
    return JSONResponse({"message": "Welcome to Databricks FastAPI!", "version": "1.0.0"})

@app.get("/health")
async def health_check():
    return JSONResponse({"status": "healthy"})

@app.get("/databricks/catalogs")
async def get_catalogs():
    """List all available catalogs"""
    try:
        with DatabricksClient() as client:
            catalogs = client.list_catalogs()
            return JSONResponse({
                "catalogs": catalogs,
                "count": len(catalogs)
            })
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.get("/databricks/schemas")
async def get_schemas(catalog: str = None):
    """List all schemas in a catalog"""
    try:
        with DatabricksClient() as client:
            schemas = client.list_schemas(catalog)
            return JSONResponse({
                "catalog": catalog or client.catalog,
                "schemas": schemas,
                "count": len(schemas)
            })
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.get("/databricks/tables")
async def get_tables(schema: str = None, catalog: str = None):
    """List all tables in a schema"""
    try:
        with DatabricksClient() as client:
            tables = client.list_tables(schema, catalog)
            return JSONResponse({
                "catalog": catalog or client.catalog,
                "schema": schema or client.schema,
                "tables": tables,
                "count": len(tables)
            })
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.get("/databricks/table/{table_name}")
async def get_table_data(table_name: str, limit: int = 100, catalog: str = None, schema: str = None):
    """Fetch data from a specific table"""
    try:
        with DatabricksClient() as client:
            columns, results = client.fetch_table_data(table_name, limit, catalog, schema)
            data = [dict(zip(columns, row)) for row in results]
            response_data = {
                "table": table_name,
                "catalog": catalog or client.catalog,
                "schema": schema or client.schema,
                "columns": columns,
                "row_count": len(data),
                "data": data
            }
            return Response(
                content=json.dumps(response_data, cls=DateTimeEncoder),
                media_type="application/json",
                status_code=200
            )
    except Exception as e:
        return Response(
            content=json.dumps({"error": str(e)}),
            media_type="application/json",
            status_code=500
        )

@app.get("/databricks/schema/{table_name}")
async def get_table_schema(table_name: str, catalog: str = None, schema: str = None):
    """Get schema/columns of a table"""
    try:
        with DatabricksClient() as client:
            schema_info = client.get_table_schema(table_name, catalog, schema)
            schema_data = [{"column": row[0], "type": row[1], "comment": row[2] if len(row) > 2 else ""} for row in schema_info]
            return JSONResponse({
                "table": table_name,
                "catalog": catalog or client.catalog,
                "schema": schema or client.schema,
                "columns": schema_data
            })
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.post("/databricks/query")
async def execute_query(query: str):
    """Execute a custom SQL query"""
    try:
        with DatabricksClient() as client:
            columns, results = client.execute_query(query)
            data = [dict(zip(columns, row)) for row in results]
            response_data = {
                "query": query,
                "columns": columns,
                "row_count": len(data),
                "data": data
            }
            return Response(
                content=json.dumps(response_data, cls=DateTimeEncoder),
                media_type="application/json",
                status_code=200
            )
    except Exception as e:
        return Response(
            content=json.dumps({"error": str(e)}),
            media_type="application/json",
            status_code=500
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

