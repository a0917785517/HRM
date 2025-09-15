from fastapi import FastAPI
from typing import List

app = FastAPI()

@app.get("/api/employees")
def list_employees():
    return [
        {"id": 1, "employee_no": "E001", "name": "Alice", "email": "alice@test.com", "status": "active"},
        {"id": 2, "employee_no": "E002", "name": "Bob", "email": "bob@test.com", "status": "inactive"}
    ]
