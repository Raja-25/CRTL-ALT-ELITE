# 🎓 APAC SQLite API

FastAPI application for querying and managing the APAC SQLite database with 15,000+ student records and educational data.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the Server
```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8001
```

The server will start and display:
```
INFO:     Uvicorn running on http://127.0.0.1:8001 (Press CTRL+C to quit)
```

### 3. Access the API
- **Interactive Docs**: http://127.0.0.1:8001/docs
- **Alternative Docs**: http://127.0.0.1:8001/redoc
- **Health Check**: http://127.0.0.1:8001/health

---

## 📊 API Endpoints

### 1. List All Tables
```
GET /tables
```
Returns all tables with their row counts.

**Response**:
```json
{
  "total": 26,
  "tables": [
    {"name": "students", "rows": 15000},
    {"name": "teachers", "rows": 500},
    ...
  ]
}
```

### 2. Get All Table Data ⭐ (Main Endpoint)
```
GET /tables/{table_name}
```
Returns **all data** from the table (equivalent to `SELECT * FROM table_name`).

**Examples**:
```bash
# Get all students
GET /tables/students

# Get all teachers  
GET /tables/teachers

# Get all achievements
GET /tables/achievements
```

### 3. Get Table Information
```
GET /tables/{table_name}/info
```
Returns table metadata: name, total rows, and column structure.

**Example**:
```
GET /tables/students/info
```

**Response**:
```json
{
  "table_name": "students",
  "total_rows": 15000,
  "columns": [
    {
      "cid": 0,
      "name": "student_id",
      "type": "INTEGER",
      "notnull": 0,
      "dflt_value": null,
      "pk": 0
    },
    ...
  ]
}
```

### 4. Get Table Schema
```
GET /tables/{table_name}/schema
```
Returns only column definitions.

**Example**:
```
GET /tables/students/schema
```

### 5. Get Row Count
```
GET /tables/{table_name}/count
```

**Example**:
```
GET /tables/students/count
```

**Response**:
```json
{
  "table_name": "students",
  "row_count": 15000
}
```

### 6. Create New Table
```
POST /tables/create
```

**Request**:
```json
{
  "table_name": "my_table",
  "columns": {
    "id": "INTEGER PRIMARY KEY",
    "name": "TEXT NOT NULL",
    "age": "INTEGER",
    "email": "TEXT"
  }
}
```

### 7. Insert Single Row
```
POST /tables/{table_name}/insert
```

**Request**:
```json
{
  "data": {
    "name": "John Doe",
    "age": 25,
    "email": "john@example.com"
  }
}
```

### 8. Insert Multiple Rows
```
POST /tables/{table_name}/insert-many
```

**Request**:
```json
{
  "data": [
    {"name": "John", "age": 25},
    {"name": "Jane", "age": 28},
    {"name": "Bob", "age": 30}
  ]
}
```

### 9. Query with Filters
```
GET /tables/{table_name}/rows?where=age>20&orderby=name&limit=100
```

**Parameters**:
- `where` - WHERE clause (e.g., `age>20`, `name='John'`)
- `orderby` - ORDER BY column
- `limit` - Max rows to return

### 10. Execute Custom SQL
```
POST /query
```

**Request**:
```json
{
  "query": "SELECT COUNT(*) as total FROM students WHERE age > ?",
  "params": [18]
}
```

### 11. Delete Table
```
DELETE /tables/{table_name}
```

### 12. Health Check
```
GET /health
```

**Response**:
```json
{
  "status": "healthy",
  "database": "apac_data.db",
  "tables_count": 26
}
```

---

## 📋 Available Tables

| Table | Description |
|-------|-------------|
| **students** | Student profiles with 15,000+ records |
| **teachers** | Teacher information |
| **schools** | School details |
| **learning_modules** | Course modules |
| **lessons** | Individual lessons |
| **lesson_content** | Lesson materials |
| **skills** | Skill definitions |
| **skill_categories** | Skill categories |
| **student_skills** | Student skill levels |
| **quizzes** | Quiz definitions |
| **quiz_questions** | Quiz questions |
| **quiz_options** | Multiple choice options |
| **quiz_attempts** | Student quiz results |
| **quiz_responses** | Detailed responses |
| **achievements** | Achievement badges |
| **student_achievements** | Earned achievements |
| **career_pathways** | Career paths |
| **career_interests** | Student interests |
| **pathway_skills** | Skills per pathway |
| **daily_challenges** | Daily prompts |
| **user_sessions** | Login sessions |
| **notifications** | User messages |
| **points_ledger** | Reward tracking |
| **safety_scenarios** | Training scenarios |
| **scenario_responses** | Responses to scenarios |
| **student_progress** | Completion tracking |

---

## 💡 Usage Examples

### Get All Students
```bash
curl http://127.0.0.1:8001/tables/students | python -m json.tool
```

### Get Student Table Info
```bash
curl http://127.0.0.1:8001/tables/students/info | python -m json.tool
```

### Get All Teachers
```bash
curl http://127.0.0.1:8001/tables/teachers | python -m json.tool
```

### Create New Table
```bash
curl -X POST http://127.0.0.1:8001/tables/create \
  -H "Content-Type: application/json" \
  -d '{
    "table_name": "users",
    "columns": {
      "id": "INTEGER PRIMARY KEY",
      "username": "TEXT NOT NULL",
      "email": "TEXT"
    }
  }'
```

### Insert Data
```bash
curl -X POST http://127.0.0.1:8001/tables/users/insert \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "username": "john_doe",
      "email": "john@example.com"
    }
  }'
```

### Run Custom Query
```bash
curl -X POST http://127.0.0.1:8001/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT COUNT(*) as total FROM students",
    "params": []
  }'
```

### Check Health
```bash
curl http://127.0.0.1:8001/health | python -m json.tool
```

---

## 🔍 Common Patterns

### Python (using requests)
```python
import requests

BASE_URL = "http://127.0.0.1:8001"

# Get all students
response = requests.get(f"{BASE_URL}/tables/students")
students = response.json()

# Get table info
response = requests.get(f"{BASE_URL}/tables/students/info")
info = response.json()

# Insert data
data = {
    "data": {
        "name": "Alice",
        "email": "alice@example.com"
    }
}
response = requests.post(f"{BASE_URL}/tables/users/insert", json=data)
```

### JavaScript (using fetch)
```javascript
const BASE_URL = "http://127.0.0.1:8001";

// Get all students
const response = await fetch(`${BASE_URL}/tables/students`);
const students = await response.json();

// Get table info
const infoResponse = await fetch(`${BASE_URL}/tables/students/info`);
const info = await infoResponse.json();
```

---

## 📁 Project Structure

```
sqlite/
├── main.py                 # FastAPI application
├── database.py             # Database wrapper class
├── apac_data.db           # SQLite database (15K+ records)
├── requirements.txt        # Python dependencies
├── .env                   # Environment config
└── README.md              # This file
```

---

## 🔧 Configuration

### Change Port
```bash
python -m uvicorn main:app --host 127.0.0.1 --port 9000
```

### Allow Remote Access
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8001
```

### Environment Variables
Edit `.env` file:
```
DATABASE_PATH=apac_data.db
API_HOST=127.0.0.1
API_PORT=8001
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Change port: `--port 9000` |
| Database not found | Ensure `apac_data.db` exists in current directory |
| Module not found | Run: `pip install -r requirements.txt` |
| Permission denied | Use: `python -m uvicorn` instead of `uvicorn` |
| CORS errors | Already enabled for all origins |

---

## ✨ Features

✅ Query any table instantly  
✅ Full CRUD operations  
✅ Custom SQL queries  
✅ Dynamic table creation  
✅ Filter and sort data  
✅ Interactive API documentation  
✅ Full CORS support  
✅ Error handling  
✅ Scalable design  

---

## 📞 API Documentation

Full interactive API documentation available at:
- **Swagger UI**: http://127.0.0.1:8001/docs
- **ReDoc**: http://127.0.0.1:8001/redoc

Try out endpoints directly in the browser!

---

## 📦 Dependencies

- **fastapi** - Web framework
- **uvicorn** - ASGI server
- **pydantic** - Data validation
- **python-dotenv** - Environment config
- **sqlite3** - Built-in database

---

## 🔒 Security Notes

Current setup allows requests from all origins for development. For production:

```python
# In main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["yourdomain.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)
```

---

## 📊 Database Info

- **Type**: SQLite3
- **File**: `apac_data.db`
- **Size**: ~50MB
- **Tables**: 26
- **Records**: 15,000+ students
- **Relations**: Fully normalized schema

---

**Last Updated**: January 28, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
