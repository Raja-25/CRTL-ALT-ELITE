"""
Dropout Risk Analysis API Routes
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any
from app.dropout import DropoutAnalysis

router = APIRouter(prefix="/api/dropout", tags=["dropout"])
dropout_analyzer = DropoutAnalysis()


@router.get("/risk-scores", response_model=List[Dict[str, Any]])
def get_all_dropout_risk_scores():
    """
    Get dropout risk scores for all students.
    
    Returns a list of all students with their calculated dropout risk scores,
    ordered from highest to lowest risk.
    """
    return dropout_analyzer.get_dropout_risk_students()


@router.get("/high-risk", response_model=List[Dict[str, Any]])
def get_high_risk_students(threshold: int = Query(50, ge=0, le=100)):
    """
    Get students with high dropout risk above specified threshold.
    
    Args:
        threshold: Dropout risk score threshold (0-100, default 50)
    
    Returns a list of students at risk, sorted by risk score descending.
    """
    return dropout_analyzer.get_high_risk_students(threshold)


@router.get("/student/{student_id}", response_model=Dict[str, Any])
def get_student_dropout_profile(student_id: int):
    """
    Get detailed dropout risk profile for a specific student.
    
    Args:
        student_id: The ID of the student
    
    Returns detailed metrics including:
    - Student demographics (age, grade)
    - Session activity metrics
    - Learning engagement indicators
    - Dropout risk score
    """
    return dropout_analyzer.get_student_dropout_profile(student_id)


@router.get("/summary", response_model=Dict[str, Any])
def get_dropout_analysis_summary():
    """
    Get summary statistics about dropout risk across all students.
    
    Returns statistics including:
    - Total students analyzed
    - Average risk score
    - Number of high-risk students
    - Risk distribution
    """
    try:
        all_students = dropout_analyzer.get_dropout_risk_students()
        
        if not all_students:
            return {
                "total_students": 0,
                "average_risk_score": 0,
                "high_risk_count": 0,
                "risk_distribution": {}
            }
        
        risk_scores = [s['dropout_risk_score'] for s in all_students if s['dropout_risk_score'] is not None]
        
        # Calculate risk distribution
        distribution = {
            "critical_75_100": len([s for s in risk_scores if s >= 75]),
            "high_50_74": len([s for s in risk_scores if 50 <= s < 75]),
            "medium_25_49": len([s for s in risk_scores if 25 <= s < 50]),
            "low_0_24": len([s for s in risk_scores if s < 25])
        }
        
        return {
            "total_students": len(all_students),
            "average_risk_score": round(sum(risk_scores) / len(risk_scores), 2) if risk_scores else 0,
            "high_risk_count": len([s for s in risk_scores if s >= 50]),
            "risk_distribution": distribution
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating summary: {str(e)}")
