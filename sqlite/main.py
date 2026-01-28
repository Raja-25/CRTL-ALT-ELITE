from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import sys

# Add current directory to path to import database module
sys.path.insert(0, os.path.dirname(__file__))
from database import Database

app = FastAPI(
    title="APAC SQLite API",
    description="API for querying and managing APAC SQLite database",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
db = Database(os.path.join(os.path.dirname(__file__), "apac_data.db"))

# ============ Pydantic Models ============

class ColumnDefinition(BaseModel):
    name: str
    type: str

class CreateTableRequest(BaseModel):
    table_name: str
    columns: Dict[str, str]
    description: Optional[str] = None

class InsertDataRequest(BaseModel):
    data: Dict[str, Any]

class InsertManyRequest(BaseModel):
    data: List[Dict[str, Any]]

class QueryRequest(BaseModel):
    query: str
    params: Optional[List[Any]] = []

# ============ Health & Info Endpoints ============

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "APAC SQLite API",
        "version": "1.0.0",
        "endpoints": {
            "docs": "/docs",
            "tables": "/tables",
            "health": "/health"
        }
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    try:
        tables = db.get_all_tables()
        return {
            "status": "healthy",
            "database": "apac_data.db",
            "tables_count": len(tables)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============ Table Management Endpoints ============

@app.get("/tables")
async def list_tables():
    """Get list of all tables in database"""
    try:
        tables = db.get_all_tables()
        table_info = []
        for table in tables:
            count = db.get_row_count(table)
            table_info.append({
                "name": table,
                "rows": count
            })
        return {
            "total": len(table_info),
            "tables": table_info
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/tables/{table_name}")
async def get_table_info(table_name: str):
    """Get all table data (SELECT * FROM table_name)"""
    try:
        if not db.table_exists(table_name):
            raise HTTPException(status_code=404, detail=f"Table '{table_name}' not found")
        
        rows = db.execute_query(f"SELECT * FROM {table_name}")
        return rows
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/tables/{table_name}/schema")
async def get_table_schema(table_name: str):
    """Get schema information for a specific table"""
    try:
        if not db.table_exists(table_name):
            raise HTTPException(status_code=404, detail=f"Table '{table_name}' not found")
        
        schema = db.get_table_schema(table_name)
        return {
            "table_name": table_name,
            "columns": schema
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/tables/{table_name}/info")
async def get_table_info_endpoint(table_name: str):
    """Get table info with schema and row count"""
    try:
        if not db.table_exists(table_name):
            raise HTTPException(status_code=404, detail=f"Table '{table_name}' not found")
        
        schema = db.get_table_schema(table_name)
        row_count = db.get_row_count(table_name)
        
        return {
            "table_name": table_name,
            "total_rows": row_count,
            "columns": schema
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tables/create")
async def create_table(request: CreateTableRequest):
    """Create a new table"""
    try:
        if db.table_exists(request.table_name):
            raise HTTPException(status_code=400, detail=f"Table '{request.table_name}' already exists")
        
        success = db.create_table(request.table_name, request.columns)
        if success:
            return {
                "message": f"Table '{request.table_name}' created successfully",
                "table_name": request.table_name,
                "columns": request.columns
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to create table")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/tables/{table_name}")
async def delete_table(table_name: str):
    """Delete a table"""
    try:
        if not db.table_exists(table_name):
            raise HTTPException(status_code=404, detail=f"Table '{table_name}' not found")
        
        success = db.drop_table(table_name)
        if success:
            return {
                "message": f"Table '{table_name}' deleted successfully"
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to delete table")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============ Query Endpoints ============

@app.get("/tables/{table_name}/rows")
async def get_table_rows(
    table_name: str,
    limit: int = Query(100, ge=1, le=10000),
    offset: int = Query(0, ge=0)
):
    """Get rows from a table with pagination"""
    try:
        if not db.table_exists(table_name):
            raise HTTPException(status_code=404, detail=f"Table '{table_name}' not found")
        
        total_rows = db.get_row_count(table_name)
        query = f"SELECT * FROM {table_name} LIMIT ? OFFSET ?"
        rows = db.execute_query(query, (limit, offset))
        
        return {
            "table_name": table_name,
            "total_rows": total_rows,
            "limit": limit,
            "offset": offset,
            "returned_rows": len(rows),
            "data": rows
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query")
async def execute_query(request: QueryRequest):
    """Execute a custom SQL SELECT query"""
    try:
        # Safety check: only allow SELECT queries
        if not request.query.strip().upper().startswith("SELECT"):
            raise HTTPException(status_code=400, detail="Only SELECT queries are allowed")
        
        params = tuple(request.params) if request.params else ()
        results = db.execute_query(request.query, params)
        
        return {
            "rows_returned": len(results),
            "data": results
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search")
async def search(
    table_name: str,
    column: str,
    value: str,
    limit: int = Query(100, ge=1, le=10000)
):
    """Search for rows where a column contains a value"""
    try:
        if not db.table_exists(table_name):
            raise HTTPException(status_code=404, detail=f"Table '{table_name}' not found")
        
        query = f"SELECT * FROM {table_name} WHERE {column} LIKE ? LIMIT ?"
        rows = db.execute_query(query, (f"%{value}%", limit))
        
        return {
            "table_name": table_name,
            "search_column": column,
            "search_value": value,
            "results_count": len(rows),
            "data": rows
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============ Data Insertion Endpoints ============

@app.post("/tables/{table_name}/insert")
async def insert_row(table_name: str, request: InsertDataRequest):
    """Insert a single row into a table"""
    try:
        if not db.table_exists(table_name):
            raise HTTPException(status_code=404, detail=f"Table '{table_name}' not found")
        
        rows_inserted = db.insert_data(table_name, request.data)
        
        return {
            "message": f"Data inserted successfully",
            "table_name": table_name,
            "rows_inserted": rows_inserted
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tables/{table_name}/insert-many")
async def insert_many_rows(table_name: str, request: InsertManyRequest):
    """Insert multiple rows into a table"""
    try:
        if not db.table_exists(table_name):
            raise HTTPException(status_code=404, detail=f"Table '{table_name}' not found")
        
        if not request.data:
            raise HTTPException(status_code=400, detail="No data provided")
        
        rows_inserted = db.insert_many(table_name, request.data)
        
        return {
            "message": f"Data inserted successfully",
            "table_name": table_name,
            "rows_inserted": rows_inserted
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============ Update & Delete Endpoints ============

@app.put("/query")
async def execute_update(request: QueryRequest):
    """Execute UPDATE, INSERT, or DELETE query"""
    try:
        query_upper = request.query.strip().upper()
        
        # Check if it's an UPDATE, INSERT, or DELETE query
        if not any(query_upper.startswith(cmd) for cmd in ["UPDATE", "INSERT", "DELETE"]):
            raise HTTPException(status_code=400, detail="Only UPDATE, INSERT, or DELETE queries are allowed")
        
        params = tuple(request.params) if request.params else ()
        rows_affected = db.execute_update(request.query, params)
        
        return {
            "rows_affected": rows_affected,
            "message": f"Query executed successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/tables/{table_name}/count")
async def count_rows(table_name: str):
    """Get row count for a table"""
    try:
        if not db.table_exists(table_name):
            raise HTTPException(status_code=404, detail=f"Table '{table_name}' not found")
        
        count = db.get_row_count(table_name)
        return {
            "table_name": table_name,
            "row_count": count
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True
    )
