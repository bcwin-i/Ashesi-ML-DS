"""
Test script for the Student Probation Risk Prediction API
"""

import requests
import json

# API base URL
API_URL = "http://localhost:8000"

def test_health_check():
    """Test the health check endpoint"""
    print("=" * 80)
    print("TEST 1: Health Check")
    print("=" * 80)
    
    response = requests.get(f"{API_URL}/")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()


def test_model_info():
    """Test the model info endpoint"""
    print("=" * 80)
    print("TEST 2: Model Information")
    print("=" * 80)
    
    response = requests.get(f"{API_URL}/prosit3/models/info")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()


def test_get_features():
    """Test the features endpoint"""
    print("=" * 80)
    print("TEST 3: Get Required Features")
    print("=" * 80)
    
    response = requests.get(f"{API_URL}/prosit3/features")
    print(f"Status Code: {response.status_code}")
    data = response.json()
    print(f"Feature Count: {data['feature_count']}")
    print(f"Features:")
    for i, feature in enumerate(data['features'], 1):
        print(f"  {i}. {feature}")
    print()


def test_single_prediction(model_name="random_forest"):
    """Test prediction with a single model"""
    print("=" * 80)
    print(f"TEST 4: Single Model Prediction ({model_name})")
    print("=" * 80)
    
    # Example student data (good student - should have low probation risk)
    student_data = {
        "mark": 73.68,
        "subject_credit": 1.0,
        "cgpa_y": 3.04,
        "gpa_y": 3.09,
        "grade_point": 3.0,
        "cgpa_x": 3.04,
        "yeargroup": 2024.0,
        "gpa_x": 3.09,
        "semester_year_y": 6.0,
        "academic_year_y": 9.0,
        "grade": 1.0,
        "course_offering_plan_name": 0.0,
        "admission_year": 1.0,
        "grade_system": 6.0,
        "academic_year_x": 0.0,
        "offer_type": 9.0,
        "offer_course_name": 3.0,
        "extra_question_type_of_exam": 0.0,
        "semester_year_x": 1.0,
        "program": 0.0,
        "kmeans_cluster": 3,
        "hierarchical_cluster": -1,
        "gmm_cluster": -1
    }
    
    response = requests.post(
        f"{API_URL}/prosit3/predict/{model_name}",
        json=student_data
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()
    
    return response.json()


def test_at_risk_student():
    """Test prediction with an at-risk student"""
    print("=" * 80)
    print("TEST 5: At-Risk Student Prediction")
    print("=" * 80)
    
    # Example at-risk student data (low CGPA)
    at_risk_student = {
        "mark": 45.0,
        "subject_credit": 1.0,
        "cgpa_y": 1.8,  # Below 2.0 threshold
        "gpa_y": 1.7,
        "grade_point": 1.0,
        "cgpa_x": 1.8,
        "yeargroup": 2024.0,
        "gpa_x": 1.7,
        "semester_year_y": 6.0,
        "academic_year_y": 9.0,
        "grade": 5.0,  # Lower grade
        "course_offering_plan_name": 0.0,
        "admission_year": 1.0,
        "grade_system": 6.0,
        "academic_year_x": 0.0,
        "offer_type": 9.0,
        "offer_course_name": 3.0,
        "extra_question_type_of_exam": 0.0,
        "semester_year_x": 1.0,
        "program": 0.0,
        "kmeans_cluster": 3,
        "hierarchical_cluster": -1,
        "gmm_cluster": -1
    }
    
    response = requests.post(
        f"{API_URL}/prosit3/predict/random_forest",
        json=at_risk_student
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()


def test_ensemble_prediction():
    """Test ensemble prediction"""
    print("=" * 80)
    print("TEST 6: Ensemble Prediction")
    print("=" * 80)
    
    student_data = {
        "mark": 73.68,
        "subject_credit": 1.0,
        "cgpa_y": 3.04,
        "gpa_y": 3.09,
        "grade_point": 3.0,
        "cgpa_x": 3.04,
        "yeargroup": 2024.0,
        "gpa_x": 3.09,
        "semester_year_y": 6.0,
        "academic_year_y": 9.0,
        "grade": 1.0,
        "course_offering_plan_name": 0.0,
        "admission_year": 1.0,
        "grade_system": 6.0,
        "academic_year_x": 0.0,
        "offer_type": 9.0,
        "offer_course_name": 3.0,
        "extra_question_type_of_exam": 0.0,
        "semester_year_x": 1.0,
        "program": 0.0,
        "kmeans_cluster": 3,
        "hierarchical_cluster": -1,
        "gmm_cluster": -1
    }
    
    response = requests.post(
        f"{API_URL}/prosit3/predict/ensemble",
        json=student_data
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()


def test_all_models():
    """Test predictions with all available models"""
    print("=" * 80)
    print("TEST 7: Compare All Models")
    print("=" * 80)
    
    student_data = {
        "mark": 73.68,
        "subject_credit": 1.0,
        "cgpa_y": 3.04,
        "gpa_y": 3.09,
        "grade_point": 3.0,
        "cgpa_x": 3.04,
        "yeargroup": 2024.0,
        "gpa_x": 3.09,
        "semester_year_y": 6.0,
        "academic_year_y": 9.0,
        "grade": 1.0,
        "course_offering_plan_name": 0.0,
        "admission_year": 1.0,
        "grade_system": 6.0,
        "academic_year_x": 0.0,
        "offer_type": 9.0,
        "offer_course_name": 3.0,
        "extra_question_type_of_exam": 0.0,
        "semester_year_x": 1.0,
        "program": 0.0,
        "kmeans_cluster": 3,
        "hierarchical_cluster": -1,
        "gmm_cluster": -1
    }
    
    models = [
        'baseline_logistic',
        'lasso_logistic',
        'ridge_logistic',
        'elastic_net_logistic',
        'random_forest',
        'gradient_boosting'
    ]
    
    print(f"{'Model':<25} {'Risk':<6} {'Probability':<12} {'Confidence':<10}")
    print("-" * 80)
    
    for model in models:
        response = requests.post(
            f"{API_URL}/prosit3/predict/{model}",
            json=student_data
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"{model:<25} {result['probation_risk']:<6} {result['probability']:<12.4f} {result['confidence']:<10}")
    
    print()


def run_all_tests():
    """Run all tests"""
    try:
        test_health_check()
        test_model_info()
        test_get_features()
        test_single_prediction()
        test_at_risk_student()
        test_ensemble_prediction()
        test_all_models()
        
        print("=" * 80)
        print("✅ ALL TESTS COMPLETED SUCCESSFULLY!")
        print("=" * 80)
        
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Could not connect to API")
        print("Make sure the API is running: uvicorn main:app --reload")
    except Exception as e:
        print(f"❌ ERROR: {e}")


if __name__ == "__main__":
    print("\n")
    print("=" * 80)
    print("STUDENT PROBATION RISK PREDICTION API - TEST SUITE")
    print("=" * 80)
    print()
    
    run_all_tests()
