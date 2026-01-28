from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import sys
# from Databricks import DatabricksClient
import pandas as pd
import json
from collections import defaultdict

# Add current directory to path to import database module
sys.path.insert(0, os.path.dirname(__file__))
from database import Database
from llm import LLM

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

class SkillRatingRequest(BaseModel):
    csv_file: str = "sqlite\\test_data.csv"
    sample_size: int = 10

class SkillRatingResponse(BaseModel):
    skill: str
    rating: float

class SkillRatingsResponse(BaseModel):
    top_5_skills: List[SkillRatingResponse]

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

# ============ Skill Ratings Endpoints ============

@app.get("/skill-ratings")
async def get_skill_ratings(
    csv_file: str = Query("sqlite\\test_data.csv"),
    sample_size: int = Query(10, ge=1, le=100)
):
    """
    Calculate skill ratings based on quiz performance data.
    Uses LLM to evaluate proficiency across different skill categories.
    """
    try:
        # cli = DatabricksClient()
        model = LLM("gpt-4.1-mini")
        
        # Load data from CSV
        if not os.path.exists(csv_file):
            raise HTTPException(status_code=404, detail=f"CSV file '{csv_file}' not found")
        
        df = pd.read_csv(csv_file)
        
        if df.empty:
            raise HTTPException(status_code=400, detail="CSV file is empty")
        
        # Group and sample the data
        df = df.groupby('quiz_title').apply(
            lambda x: x.sample(n=min(sample_size, len(x)), random_state=42)
        ).reset_index(drop=True)
        
        # Prepare quiz data
        grouped = df.drop(["quiz_id", "question_id"], axis=1).groupby('quiz_title')
        
        quiz_data = {}
        for quiz_title, group in grouped:
            quiz_data[quiz_title] = group[[
                'question_text', 'is_correct', 'attempt_number',
                'hint_used', 'confidence_level', 'time_taken_seconds'
            ]].to_dict(orient='records')
        
        # Convert to JSON
        json_data = json.dumps(quiz_data, indent=2)
        
        # Define prompts
        system_prompt = """You are an expert skill assessment evaluator.

    INPUT:
    You will receive a JSON object where:
    - Each top-level key represents a skill (quiz title).
    - The value for each key is a list of question attempts related to that skill.
    - Each question attempt contains behavioral data such as correctness, confidence, hint usage, and time taken.

    TASK:
    For each quiz title (skill):
    1. Analyze the associated attempts.
    2. Assign a proficiency rating for that skill on a scale from 0 to 10.

    SCORING SCALE:
    - 0–2  : Very weak
    - 3–4  : Weak
    - 5–6  : Average
    - 7–8  : Strong
    - 9–10 : Excellent

    GROUPING:
    Group skills into **general categories**:
    - AI (e.g., "AI Applications Quiz", "AI Ethics Quiz")
    - Life Skills (e.g., "Career Research Quiz", "Budgeting Quiz", "Goal Setting Quiz")
    - Social Media (e.g., "Creating Posts Quiz", "Social Media Overview Quiz")
    - Technical Skills (e.g., "Web Browsers Quiz", "Spreadsheets Intro Quiz")
    - Security Awareness (e.g., "Password Basics Quiz", "Phishing Awareness Quiz")

    Return **only the top 5 general skill categories** with their corresponding rating.

    OUTPUT FORMAT (STRICT):
    {
    "top_5_skills": [
        {"skill": "<Skill Category>", "rating": <rating out of 10>},
        ...
    ]
    }

    The output should be **strictly** in this format, and you should include only the **top 5 skills** based on their proficiency ratings.

    """

        user_prompt = "Evaluate the following skill data and return the skill ratings as instructed."
        
        # Send request to model
        response = model.chat(system_prompt, user_prompt + str(json_data))
        
        # Parse response
        try:
            scores = json.loads(response)
            return {
                "status": "success",
                "top_5_skills": scores.get("top_5_skills", [])
            }
        except json.JSONDecodeError:
            print("Model response:", response)
            raise HTTPException(
                status_code=500,
                detail="Error parsing the model response. Response was not valid JSON."
            )
    
    except HTTPException:
        raise
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=f"File not found: {str(e)}")
    except Exception as e:
        print("Error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True
    )
