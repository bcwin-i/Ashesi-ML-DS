"""
Test suite for Prosit 2 Clustering API endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000"

# Sample student data (32 features for Prosit 2)
SAMPLE_STUDENT = {
    "mark": 85.5,
    "gpa_y": 3.2,
    "cgpa_y": 3.15,
    "grade_point": 3.0,
    "subject_credit": 1.0,
    "cgpa_x": 3.15,
    "yeargroup": 2024.0,
    "gpa_x": 3.2,
    "education_block_1_level": 2.0,
    "latest_education_level": 3.0,
    "offer_course_name": 5.0,
    "offer_type": 1.0,
    "extra_question_level_education_3": 2.0,
    "extra_question_is_alive_3": 1.0,
    "extra_question_level_education_2": 2.0,
    "education_block_2_level": 2.0,
    "extra_question_is_alive_2": 1.0,
    "extra_question_family_admission": 0.0,
    "extra_question_is_alive": 1.0,
    "extra_question_is_alive_1": 1.0,
    "academic_year_x": 0.0,
    "semester_year_x": 1.0,
    "extra_question_type_of_exam": 0.0,
    "gender": 1.0,
    "semester_year_y": 6.0,
    "grade_system": 6.0,
    "grade": 1.0,
    "academic_year_y": 9.0,
    "course_offering_plan_name": 0.0,
    "nationality": 0.0,
    "admission_year": 1.0,
    "program": 0.0
}


def test_cluster_assignment():
    """Test cluster assignment for all algorithms"""
    print("\n" + "="*60)
    print("TESTING PROSIT 2 - CLUSTER ASSIGNMENT")
    print("="*60)
    
    algorithms = ["kmeans", "dbscan", "hierarchical", "gmm"]
    
    for algorithm in algorithms:
        print(f"\n🔍 Testing {algorithm.upper()} clustering...")
        
        response = requests.post(
            f"{BASE_URL}/prosit2/cluster/{algorithm}",
            json=SAMPLE_STUDENT
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ {algorithm.upper()} Success!")
            print(f"   Cluster: {result['cluster']}")
            print(f"   Total Clusters: {result['n_clusters']}")
            print(f"   Is Outlier: {result['is_outlier']}")
        else:
            print(f"❌ {algorithm.upper()} Failed!")
            print(f"   Status: {response.status_code}")
            print(f"   Error: {response.text}")


def test_model_info():
    """Test model information endpoint"""
    print("\n" + "="*60)
    print("TESTING PROSIT 2 - MODEL INFO")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/prosit2/models/info")
    
    if response.status_code == 200:
        info = response.json()
        print("✅ Model Info Retrieved!")
        print(f"   Algorithms: {info['algorithms']}")
        print(f"   Features: {info['n_features']}")
        print(f"   Samples: {info['n_samples']}")
        print(f"   Scaler: {info['scaler_type']}")
        print(f"   PCA Components: {info['pca_components']}")
    else:
        print(f"❌ Failed to get model info")
        print(f"   Status: {response.status_code}")


def test_metrics():
    """Test clustering metrics endpoint"""
    print("\n" + "="*60)
    print("TESTING PROSIT 2 - CLUSTERING METRICS")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/prosit2/results/metrics")
    
    if response.status_code == 200:
        metrics = response.json()
        print("✅ Metrics Retrieved!")
        for metric in metrics:
            print(f"\n   Algorithm: {metric['Algorithm']}")
            print(f"   Clusters: {metric['N_Clusters']}")
            if 'Davies-Bouldin' in metric and metric['Davies-Bouldin']:
                print(f"   Davies-Bouldin: {metric['Davies-Bouldin']:.4f}")
            if 'Calinski-Harabasz' in metric and metric['Calinski-Harabasz']:
                print(f"   Calinski-Harabasz: {metric['Calinski-Harabasz']:.2f}")
    else:
        print(f"❌ Failed to get metrics")
        print(f"   Status: {response.status_code}")


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("PROSIT 2 API TEST SUITE")
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
        
        # Run tests
        test_cluster_assignment()
        test_model_info()
        test_metrics()
        
        print("\n" + "="*60)
        print("ALL PROSIT 2 TESTS COMPLETED!")
        print("="*60 + "\n")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to API")
        print("   Make sure the API is running:")
        print("   uvicorn main:app --reload --host 0.0.0.0 --port 8000")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")


if __name__ == "__main__":
    main()
