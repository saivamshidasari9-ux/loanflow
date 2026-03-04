from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from models import UserRole, LoanStatus

class UserBase(BaseModel):
    username: str
    role: UserRole
    active: bool

class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    role: UserRole
    active: bool

    class Config:
        from_attributes = True

class UserRoleUpdate(BaseModel):
    role: UserRole

class UserActiveUpdate(BaseModel):
    active: bool

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    token: str
    username: str
    role: UserRole

class LoanRequest(BaseModel):
    amount: float
    tenure: int
    full_name: str
    monthly_income: float
    monthly_debt: float
    credit_score: int
    employment_type: str
    purpose: str

class LoanResponse(BaseModel):
    id: int
    amount: float
    interest_rate: Optional[float]
    tenure: int
    status: LoanStatus
    created_at: datetime
    full_name: str
    eligibility_decision: Optional[str]
    risk_score: Optional[int]

    class Config:
        from_attributes = True

class LoanPageResponse(BaseModel):
    content: List[LoanResponse]
    totalElements: int
    totalPages: int
    size: int
    number: int

class AdminMetricsResponse(BaseModel):
    customers: int
    analysts: int
    admins: int
    loans: int
