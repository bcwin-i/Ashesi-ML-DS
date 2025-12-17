"""
Test suite for Prosit 5 Predictive Models API endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000"

# Sample data for different models
SAMPLE_Q1_DATA = {
    "math_score": 75.0,
    "english_score": 80.0,
    "composite_score": 77.5
}

SAMPLE_Q2_DATA = {
    "math_score": 65.0,
    "english_score": 70.0,
    "composite_score": 67.5
}

SAMPLE_Q3_DATA = {
    "math_score": 85.0,
    "english_score": 88.0,
    "first_year_gpa": 3.2
}

SAMPLE_Q9_DATA = {
    "math_score": 70.0,
    "english_score": 75.0,
    "first_year_gpa": 2.8,
    "failed_courses": 1
}


def test_first_year_struggle():
    """Test Q1: First Year Struggle Prediction"""
    print("\n" + "="*60)
    print("TESTING Q1 - FIRST YEAR STRUGGLE PREDICTION")
    print("="*60)
    
    response = requests.post(
        f"{BASE_URL}/prosit5/predict/first-year-struggle",
        json=SAMPLE_Q1_DATA
    )
    
    if response.status_code == 200:
        result = response.json()
        print("✅ Prediction Successful!")
        print(f"   Prediction: {result['prediction']}")
        print(f"   Probability: {result['probability']:.4f}")
        print(f"   Confidence: {result['confidence']}")
        print(f"   Interpretation: {result['interpretation']}")
    else:
        print(f"❌ Prediction Failed!")
        print(f"   Status: {response.status_code}")
        print(f"   Error: {response.text}")


def test_ajc_prediction():
    """Test Q2: AJC Prediction"""
    print("\n" + "="*60)
    print("TESTING Q2 - AJC PREDICTION")
    print("="*60)
    
    response = requests.post(
        f"{BASE_URL}/prosit5/predict/ajc",
        json=SAMPLE_Q2_DATA
    )
    
    if response.status_code == 200:
        result = response.json()
        print("✅ Prediction Successful!")
        print(f"   Prediction: {result['prediction']}")
        print(f"   Probability: {result['probability']:.4f}")
        print(f"   Confidence: {result['confidence']}")
        print(f"   Interpretation: {result['interpretation']}")
    else:
        print(f"❌ Prediction Failed!")
        print(f"   Status: {response.status_code}")
        print(f"   Error: {response.text}")


def test_major_success():
    """Test Q3: Major Success Prediction"""
    print("\n" + "="*60)
    print("TESTING Q3 - MAJOR SUCCESS PREDICTION")
    print("="*60)
    
    response = requests.post(
        f"{BASE_URL}/prosit5/predict/major-success",
        json=SAMPLE_Q3_DATA
    )
    
    if response.status_code == 200:
        result = response.json()
        print("✅ Prediction Successful!")
        print(f"   Prediction: {result['prediction']}")
        print(f"   Probability: {result['probability']:.4f}")
        print(f"   Confidence: {result['confidence']}")
        print(f"   Interpretation: {result['interpretation']}")
    else:
        print(f"❌ Prediction Failed!")
        print(f"   Status: {response.status_code}")
        print(f"   Error: {response.text}")


def test_delayed_graduation():
    """Test Q9: Delayed Graduation Prediction"""
    print("\n" + "="*60)
    print("TESTING Q9 - DELAYED GRADUATION PREDICTION")
    print("="*60)
    
    response = requests.post(
        f"{BASE_URL}/prosit5/predict/delayed-graduation",
        json=SAMPLE_Q9_DATA
    )
    
    if response.status_code == 200:
        result = response.json()
        print("✅ Prediction Successful!")
        print(f"   Prediction: {result['prediction']}")
        print(f"   Probability: {result['probability']:.4f}")
        print(f"   Confidence: {result['confidence']}")
        print(f"   Interpretation: {result['interpretation']}")
    else:
        print(f"❌ Prediction Failed!")
        print(f"   Status: {response.status_code}")
        print(f"   Error: {response.text}")


def test_model_info():
    """Test model information endpoint"""
    print("\n" + "="*60)
    print("TESTING PROSIT 5 - MODEL INFO")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/prosit5/models/info")
    
    if response.status_code == 200:
        info = response.json()
        print("✅ Model Info Retrieved!")
        for model_key, model_data in info.items():
            print(f"\n   Model: {model_key}")
            print(f"   Features: {model_data['features']}")
            print(f"   Feature Count: {model_data['n_features']}")
    else:
        print(f"❌ Failed to get model info")
        print(f"   Status: {response.status_code}")


def test_metrics():
    """Test performance metrics endpoint"""
    print("\n" + "="*60)
    print("TESTING PROSIT 5 - PERFORMANCE METRICS")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/prosit5/results/metrics")
    
    if response.status_code == 200:
        metrics = response.json()
        print("✅ Metrics Retrieved!")
        print(f"\n   Dataset Info:")
        print(f"   Total Students: {metrics['dataset_info']['total_students']}")
        print(f"   Yeargroups: {metrics['dataset_info']['yeargroups']}")
        
        # Show Q1 metrics
        if 'q1_first_year_struggle' in metrics:
            q1 = metrics['q1_first_year_struggle']
            print(f"\n   Q1 - First Year Struggle:")
            print(f"   Model: {q1['model_type']}")
            print(f"   Struggling %: {q1['struggling_percentage']:.2f}%")
        
        # Show Q3 metrics
        if 'q3_major_success' in metrics:
            q3 = metrics['q3_major_success']
            print(f"\n   Q3 - Major Success:")
            print(f"   Model: {q3['model_type']}")
            print(f"   Success %: {q3['success_percentage']:.2f}%")
    else:
        print(f"❌ Failed to get metrics")
        print(f"   Status: {response.status_code}")


def test_findings():
    """Test research findings endpoint"""
    print("\n" + "="*60)
    print("TESTING PROSIT 5 - RESEARCH FINDINGS")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/prosit5/results/findings")
    
    if response.status_code == 200:
        findings = response.json()
        print("✅ Findings Retrieved!")
        print(f"\n{findings['findings']}")
    else:
        print(f"❌ Failed to get findings")
        print(f"   Status: {response.status_code}")


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("PROSIT 5 API TEST SUITE")
    print("="*60)
    print(f"Testing API at: {BASE_URL}")
    
    try:
        # Test root endpoint
        response = requests.get(BASE_URL)
        if response.status_code == 200:
            print("✅ API is running!")
        else:
            print("❌ API is not responding correctly")
            return
        
        # Run prediction tests
        test_first_year_struggle()
        test_ajc_prediction()
        test_major_success()
        test_delayed_graduation()
        
        # Run info tests
        test_model_info()
        test_metrics()
        test_findings()
        
        print("\n" + "="*60)
        print("ALL PROSIT 5 TESTS COMPLETED!")
        print("="*60 + "\n")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to API")
        print("   Make sure the API is running:")
        print("   uvicorn main:app --reload --host 0.0.0.0 --port 8000")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")


if __name__ == "__main__":
    main()
