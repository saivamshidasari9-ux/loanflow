from contextlib import asynccontextmanager
from typing import Optional, List
import logging
import traceback
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select, func

import database
import models
import schemas
import auth
from services import LoanService

# Setup Logging - stdout only (safe for cloud/container environments)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    database.create_db_and_tables()
    
    # Seed default users
    with database.Session(database.engine) as session:
        # Check if users already exist
        admin_exists = session.exec(select(models.User).where(models.User.username == "admin")).first()
        if not admin_exists:
            logger.info("Seeding default users...")
            admin = models.User(
                username="admin", 
                password=auth.get_password_hash("admin123"), 
                role=models.UserRole.ADMIN
            )
            analyst = models.User(
                username="analyst", 
                password=auth.get_password_hash("analyst123"), 
                role=models.UserRole.ANALYST
            )
            customer = models.User(
                username="customer", 
                password=auth.get_password_hash("customer123"), 
                role=models.UserRole.CUSTOMER
            )
            session.add_all([admin, analyst, customer])
            session.commit()
            logger.info("Default users seeded successfully.")
    yield

app = FastAPI(title="LoanFlow API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for cloud deployments (Vercel, etc.)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global Error: {exc}")
    logger.error(traceback.format_exc())
    
    # Manually adding CORS headers to error response since middleware might be skipped on some crashes
    response = JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error. Please check backend logs."}
    )
    # Note: In a real prod environment, you'd match the origin, but for debugging we'll be explicit
    response.headers["Access-Control-Allow-Origin"] = request.headers.get("origin", "*")
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.warning(f"HTTP Error {exc.status_code}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers={"Access-Control-Allow-Origin": request.headers.get("origin", "*"), "Access-Control-Allow-Credentials": "true"}
    )

# ----------------- AUTH ROUTES -----------------

@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
def register(request: schemas.UserCreate, session: Session = Depends(database.get_session)):
    existing_user = session.exec(select(models.User).where(models.User.username == request.username)).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="Username already exists")
    
    user = models.User(
        username=request.username,
        password=auth.get_password_hash(request.password),
        role=models.UserRole.CUSTOMER
    )
    session.add(user)
    session.commit()
    return {"message": "User registered successfully"}

@app.post("/api/auth/login", response_model=schemas.LoginResponse)
def login(request: schemas.LoginRequest, session: Session = Depends(database.get_session)):
    user = session.exec(select(models.User).where(models.User.username == request.username)).first()
    if not user or not auth.verify_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    token = auth.create_access_token(data={"sub": user.username, "role": user.role.value})
    return {
        "token": token,
        "username": user.username,
        "role": user.role
    }

# ----------------- LOAN ROUTES -----------------

@app.post("/api/loans/apply", response_model=schemas.LoanResponse)
def apply_loan(
    request: schemas.LoanRequest, 
    session: Session = Depends(database.get_session),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    return LoanService.apply_loan(session, request, user_id=current_user.id)

@app.get("/api/loans", response_model=schemas.LoanPageResponse)
def list_loans(
    status: Optional[models.LoanStatus] = None,
    page: int = 0,
    size: int = 20,
    sortBy: str = "created_at",
    direction: str = "desc",
    db: Session = Depends(database.get_session),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    query = select(models.LoanApplication)
    if current_user.role == models.UserRole.CUSTOMER:
        query = query.where(models.LoanApplication.user_id == current_user.id)
    if status:
        query = query.where(models.LoanApplication.status == status)
    
    # Count total
    total_query = select(func.count()).select_from(query.subquery())
    total = db.exec(total_query).one()
    
    # Sort and Paginate
    sort_attr = getattr(models.LoanApplication, sortBy, None)
    if sort_attr is None:
        sort_attr = models.LoanApplication.created_at
    
    if direction.lower() == "desc":
        query = query.order_by(sort_attr.desc())
    else:
        query = query.order_by(sort_attr.asc())
    
    query = query.offset(page * size).limit(size)
    results = db.exec(query).all()
    
    return {
        "content": results,
        "totalElements": total,
        "totalPages": (total + size - 1) // size if size > 0 else 0,
        "size": size,
        "number": page
    }

@app.patch("/api/loans/{id}/approve", response_model=schemas.LoanResponse)
def approve_loan(id: int, session: Session = Depends(database.get_session)):
    loan = session.get(models.LoanApplication, id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    loan.status = models.LoanStatus.APPROVED
    session.add(loan)
    session.commit()
    session.refresh(loan)
    return loan

@app.patch("/api/loans/{id}/reject", response_model=schemas.LoanResponse)
def reject_loan(id: int, session: Session = Depends(database.get_session)):
    loan = session.get(models.LoanApplication, id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    loan.status = models.LoanStatus.REJECTED
    session.add(loan)
    session.commit()
    session.refresh(loan)
    return loan

# ----------------- ADMIN ROUTES -----------------

@app.get("/api/admin/metrics", response_model=schemas.AdminMetricsResponse)
def get_metrics(session: Session = Depends(database.get_session)):
    customers = session.exec(select(func.count(models.User.id)).where(models.User.role == models.UserRole.CUSTOMER)).one()
    analysts = session.exec(select(func.count(models.User.id)).where(models.User.role == models.UserRole.ANALYST)).one()
    admins = session.exec(select(func.count(models.User.id)).where(models.User.role == models.UserRole.ADMIN)).one()
    loans = session.exec(select(func.count(models.LoanApplication.id))).one()
    
    return {
        "customers": customers,
        "analysts": analysts,
        "admins": admins,
        "loans": loans
    }

def get_current_admin(user: models.User = Depends(auth.get_current_active_user)):
    if user.role != models.UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

@app.get("/api/admin/users", response_model=List[schemas.UserResponse])
def list_users(role: Optional[models.UserRole] = None, session: Session = Depends(database.get_session), admin: models.User = Depends(get_current_admin)):
    query = select(models.User)
    if role:
        query = query.where(models.User.role == role)
    return session.exec(query).all()

@app.put("/api/admin/users/{id}/role", response_model=schemas.UserResponse)
def update_user_role(id: int, request: schemas.UserRoleUpdate, session: Session = Depends(database.get_session), admin: models.User = Depends(get_current_admin)):
    user = session.get(models.User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = request.role
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@app.put("/api/admin/users/{id}/active", response_model=schemas.UserResponse)
def update_user_active(id: int, request: schemas.UserActiveUpdate, session: Session = Depends(database.get_session), admin: models.User = Depends(get_current_admin)):
    user = session.get(models.User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.active = request.active
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
