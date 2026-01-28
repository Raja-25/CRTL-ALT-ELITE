import sqlite3
import os
from typing import List, Dict, Any, Optional
from contextlib import contextmanager

class Database:
    def __init__(self, db_path: str = "apac_data.db"):
        self.db_path = db_path
        if not os.path.exists(self.db_path):
            raise FileNotFoundError(f"Database not found at {self.db_path}")
    
    @contextmanager
    def get_connection(self):
        """Get a database connection context manager"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
        finally:
            conn.close()
    
    def execute_query(self, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
        """Execute a SELECT query and return results as list of dicts"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            columns = [description[0] for description in cursor.description]
            rows = cursor.fetchall()
            return [dict(zip(columns, row)) for row in rows]
    
    def execute_update(self, query: str, params: tuple = ()) -> int:
        """Execute INSERT, UPDATE, or DELETE query"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            conn.commit()
            return cursor.rowcount
    
    def get_table_schema(self, table_name: str) -> List[Dict[str, str]]:
        """Get column information for a table"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = cursor.fetchall()
            return [
                {
                    "cid": col[0],
                    "name": col[1],
                    "type": col[2],
                    "notnull": col[3],
                    "dflt_value": col[4],
                    "pk": col[5]
                }
                for col in columns
            ]
    
    def get_all_tables(self) -> List[str]:
        """Get list of all tables in database"""
        query = "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
        result = self.execute_query(query)
        return [row['name'] for row in result]
    
    def create_table(self, table_name: str, columns: Dict[str, str]) -> bool:
        """
        Create a new table
        columns: dict like {"id": "INTEGER PRIMARY KEY", "name": "TEXT NOT NULL"}
        """
        try:
            col_definitions = ", ".join([f"{name} {dtype}" for name, dtype in columns.items()])
            query = f"CREATE TABLE IF NOT EXISTS {table_name} ({col_definitions})"
            with self.get_connection() as conn:
                conn.execute(query)
                conn.commit()
            return True
        except Exception as e:
            print(f"Error creating table: {e}")
            return False
    
    def insert_data(self, table_name: str, data: Dict[str, Any]) -> int:
        """Insert a single row of data"""
        columns = ", ".join(data.keys())
        placeholders = ", ".join(["?" for _ in data])
        query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
        return self.execute_update(query, tuple(data.values()))
    
    def insert_many(self, table_name: str, data_list: List[Dict[str, Any]]) -> int:
        """Insert multiple rows of data"""
        if not data_list:
            return 0
        
        with self.get_connection() as conn:
            cursor = conn.cursor()
            columns = data_list[0].keys()
            placeholders = ", ".join(["?" for _ in columns])
            query = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({placeholders})"
            
            for data in data_list:
                cursor.execute(query, tuple(data.values()))
            
            conn.commit()
            return cursor.rowcount
    
    def drop_table(self, table_name: str) -> bool:
        """Drop a table"""
        try:
            query = f"DROP TABLE IF EXISTS {table_name}"
            self.execute_update(query)
            return True
        except Exception as e:
            print(f"Error dropping table: {e}")
            return False
    
    def table_exists(self, table_name: str) -> bool:
        """Check if table exists"""
        query = f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}'"
        result = self.execute_query(query)
        return len(result) > 0
    
    def get_row_count(self, table_name: str) -> int:
        """Get number of rows in a table"""
        query = f"SELECT COUNT(*) as count FROM {table_name}"
        result = self.execute_query(query)
        return result[0]['count'] if result else 0
