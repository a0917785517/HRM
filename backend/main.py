from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import pandas as pd

DATABASE_URL = "sqlite:///./employees.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# SQLAlchemy Model
class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    employee_no = Column(String, unique=True, index=True)
    name = Column(String)
    title = Column(String, nullable=True)
    email = Column(String, unique=True, index=True)
    department = Column(String, nullable=True)
    hired_at = Column(String, nullable=True)
    status = Column(String, default="active")

Base.metadata.create_all(bind=engine)

# Pydantic Schema
class EmployeeIn(BaseModel):
    employee_no: str
    name: str
    email: EmailStr
    title: Optional[str] = None
    department: Optional[str] = None
    hired_at: Optional[str] = None
    status: str = "active"

class EmployeeOut(EmployeeIn):
    id: int
    class Config:
        orm_mode = True

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CRUD APIs
@app.get("/api/employees", response_model=List[EmployeeOut])
def list_employees():
    db = SessionLocal()
    return db.query(Employee).all()

@app.post("/api/employees", response_model=EmployeeOut)
def create_employee(emp: EmployeeIn):
    db = SessionLocal()
    db_emp = Employee(**emp.dict())
    db.add(db_emp)
    try:
        db.commit()
        db.refresh(db_emp)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_emp

@app.put("/api/employees/{emp_id}", response_model=EmployeeOut)
def update_employee(emp_id: int, emp: EmployeeIn):
    db = SessionLocal()
    db_emp = db.query(Employee).filter(Employee.id == emp_id).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    for k, v in emp.dict().items():
        setattr(db_emp, k, v)
    db.commit()
    db.refresh(db_emp)
    return db_emp

@app.delete("/api/employees/{emp_id}")
def delete_employee(emp_id: int):
    db = SessionLocal()
    db_emp = db.query(Employee).filter(Employee.id == emp_id).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(db_emp)
    db.commit()
    return {"ok": True}

# 批次匯入 Excel
@app.post("/api/employees/upload-excel")
def upload_excel(file: UploadFile = File(...)):
    df = pd.read_excel(file.file)
    db = SessionLocal()
    inserted = 0
    for _, row in df.iterrows():
        emp = Employee(
            employee_no=row.get("employee_no"),
            name=row.get("name"),
            email=row.get("email"),
            title=row.get("title"),
            department=row.get("department"),
            hired_at=row.get("hired_at"),
            status=row.get("status", "active"),
        )
        db.add(emp)
        try:
            db.commit()
            inserted += 1
        except Exception:
            db.rollback()
    return {"inserted": inserted}
