from typing import Optional, List
from datetime import datetime
from enum import Enum
from sqlmodel import SQLModel, Field, Relationship

class UserRole(str, Enum):
    ADMIN = "ADMIN"
    ANALYST = "ANALYST"
    CUSTOMER = "CUSTOMER"

class LoanStatus(str, Enum):
    SUBMITTED = "SUBMITTED"
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class User(SQLModel, table=True):
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True, nullable=False)
    password: str = Field(nullable=False)
    role: UserRole = Field(default=UserRole.CUSTOMER)
    active: bool = Field(default=True)

    loans: List["LoanApplication"] = Relationship(back_populates="user")

class LoanApplication(SQLModel, table=True):
    __tablename__ = "loan_applications"
    id: Optional[int] = Field(default=None, primary_key=True)
    amount: float
    interest_rate: Optional[float] = None
    tenure: int
    status: LoanStatus = Field(default=LoanStatus.SUBMITTED)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    full_name: str
    monthly_income: float
    monthly_debt: float
    credit_score: int
    employment_type: str
    purpose: str
    
    dti: Optional[float] = None
    risk_score: Optional[int] = None
    eligibility_decision: Optional[str] = None

    user_id: Optional[int] = Field(default=None, foreign_key="users.id")
    user: Optional[User] = Relationship(back_populates="loans")
