from typing import Optional
from datetime import datetime, timezone
from sqlmodel import Session, select
from models import User, LoanApplication, LoanStatus
from schemas import LoanRequest

class EligibilityService:
    @staticmethod
    def evaluate(req: LoanRequest):
        income = req.monthly_income or 0
        debt = req.monthly_debt or 0
        credit = req.credit_score or 0

        dti = 1.0 if income <= 0 else (debt / income)
        risk = 0

        # Credit score contribution
        if credit >= 760: risk += 10
        elif credit >= 700: risk += 25
        elif credit >= 650: risk += 45
        else: risk += 70

        # DTI contribution
        if dti <= 0.25: risk += 5
        elif dti <= 0.35: risk += 15
        elif dti <= 0.50: risk += 35
        else: risk += 55

        # Employment contribution
        emp = (req.employment_type or "").strip().upper()
        if emp == "SALARIED": risk += 5
        elif emp == "SELF_EMPLOYED": risk += 15
        elif emp == "STUDENT": risk += 25
        else: risk += 35

        risk = min(100, max(0, risk))

        # Decision rules
        if credit < 600 or dti > 0.60:
            decision = "REJECT"
        elif credit < 680 or dti > 0.45:
            decision = "REVIEW"
        else:
            decision = "ELIGIBLE"

        # Interest rate
        base = 8.5
        rate = round(float(base + (risk * 0.05)), 1)

        return {
            "dti": dti,
            "risk_score": risk,
            "decision": decision,
            "recommended_rate": rate
        }

class LoanService:
    @staticmethod
    def apply_loan(session: Session, req: LoanRequest, user_id: Optional[int] = None):
        eval_res = EligibilityService.evaluate(req)

        loan = LoanApplication(
            amount=req.amount,
            tenure=req.tenure,
            full_name=req.full_name,
            monthly_income=req.monthly_income,
            monthly_debt=req.monthly_debt,
            credit_score=req.credit_score,
            employment_type=req.employment_type,
            purpose=req.purpose,
            dti=eval_res["dti"],
            risk_score=eval_res["risk_score"],
            eligibility_decision=eval_res["decision"],
            interest_rate=eval_res["recommended_rate"],
            status=LoanStatus.SUBMITTED,
            created_at=datetime.now(timezone.utc),
            user_id=user_id
        )

        session.add(loan)
        session.commit()
        session.refresh(loan)
        return loan
