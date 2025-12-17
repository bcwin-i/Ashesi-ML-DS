# Student Analytics API - Prosit 2, 3, 5

Comprehensive FastAPI application for student analytics using machine learning models from Prosit 2 (Clustering), Prosit 3 (Probation Risk), and Prosit 5 (Predictive Models).

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd api
pip install -r requirements.txt
```

### 2. Run the API

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### 3. Test the API

```bash
# Test Prosit 2 (Clustering)
python test_prosit2_api.py

# Test Prosit 3 (Probation Risk)
python test_api.py

# Test Prosit 5 (Predictive Models)
python test_prosit5_api.py
```

Or visit the interactive documentation at `http://localhost:8000/docs`

## 📚 API Overview

### Prosit 2 - Clustering Models

Assign students to clusters based on academic and demographic features.

**Endpoints:**
- `POST /prosit2/cluster/{algorithm}` - Assign cluster (kmeans, dbscan, hierarchical, gmm)
- `GET /prosit2/models/info` - Get clustering model information
- `GET /prosit2/results/metrics` - Get clustering performance metrics

**Input:** 32 features (academic performance, demographics, family education)  
**Output:** Cluster assignment, algorithm used, outlier status

### Prosit 3 - Probation Risk Prediction

Predict student probation risk using supervised learning models.

**Endpoints:**
- `POST /prosit3/predict/{model_name}` - Predict with specific model
- `POST /prosit3/predict/ensemble` - Ensemble prediction (all models)
- `GET /prosit3/models/info` - Get model information
- `GET /prosit3/features` - Get required features

**Available Models:**
- `baseline_logistic` - Baseline Logistic Regression
- `lasso_logistic` - Lasso (L1) Regularized
- `ridge_logistic` - Ridge (L2) Regularized
- `elastic_net_logistic` - Elastic Net
- `random_forest` - Random Forest ⭐ (Recommended)
- `gradient_boosting` - Gradient Boosting ⭐ (Recommended)

**Input:** 23 features (academic performance + cluster assignments from Prosit 2)  
**Output:** Probation risk (0/1), probability, confidence level

### Prosit 5 - Student Success Prediction

Predict various student success outcomes based on entrance exam scores and performance.

**Endpoints:**
- `POST /prosit5/predict/first-year-struggle` - Predict first year struggle (GPA < 2.5)
- `POST /prosit5/predict/ajc` - Predict Academic Judicial Committee risk
- `POST /prosit5/predict/major-success` - Predict major success (GPA ≥ 3.0)
- `POST /prosit5/predict/delayed-graduation` - Predict delayed graduation
- `GET /prosit5/models/info` - Get all model information
- `GET /prosit5/results/metrics` - Get performance metrics
- `GET /prosit5/results/findings` - Get research findings

**Models:**
- **Q1 - First Year Struggle**: RandomForestClassifier (3 features: math, english, composite scores)
- **Q2 - AJC Prediction**: LogisticRegression (3 features: math, english, composite scores)
- **Q3 - Major Success**: RandomForestClassifier (3 features: math, english, first year GPA)
- **Q9 - Delayed Graduation**: RandomForestClassifier (4 features: math, english, first year GPA, failed courses)

## 📊 Example Usage

### Prosit 2 - Cluster Assignment

```python
import requests

student_data = {
    "mark": 85.5,
    "gpa_y": 3.2,
    "cgpa_y": 3.15,
    # ... (32 features total)
}

response = requests.post(
    "http://localhost:8000/prosit2/cluster/kmeans",
    json=student_data
)

result = response.json()
print(f"Cluster: {result['cluster']}")
print(f"Is Outlier: {result['is_outlier']}")
```

### Prosit 3 - Probation Risk

```python
import requests

student_data = {
    "mark": 73.68,
    "cgpa_y": 3.04,
    "gpa_y": 3.09,
    # ... (23 features total)
}

response = requests.post(
    "http://localhost:8000/prosit3/predict/random_forest",
    json=student_data
)

result = response.json()
print(f"Risk: {result['probation_risk']}")
print(f"Probability: {result['probability']:.2%}")
print(f"Confidence: {result['confidence']}")
```

### Prosit 5 - First Year Struggle

```python
import requests

admission_data = {
    "math_score": 75.0,
    "english_score": 80.0,
    "composite_score": 77.5
}

response = requests.post(
    "http://localhost:8000/prosit5/predict/first-year-struggle",
    json=admission_data
)

result = response.json()
print(f"Prediction: {result['prediction']}")
print(f"Interpretation: {result['interpretation']}")
print(f"Probability: {result['probability']:.2%}")
```

## 📁 Project Structure

```
api/
├── main.py                  # FastAPI application (all Prosits)
├── requirements.txt         # Python dependencies
├── test_api.py             # Prosit 3 test suite
├── test_prosit2_api.py     # Prosit 2 test suite
├── test_prosit5_api.py     # Prosit 5 test suite
└── README.md               # This file
```

## 🔍 Interactive Documentation

Visit `http://localhost:8000/docs` for:
- Complete API documentation
- Interactive endpoint testing
- Request/response schemas
- Example payloads

## ⚠️ Important Notes

1. **Feature Scaling**: All APIs automatically apply StandardScaler - send raw values
2. **Categorical Features**: Must be encoded as numbers before sending
3. **Cluster Features** (Prosit 3): Use -1 if Prosit 2 clustering hasn't been run
4. **Model Paths**: Ensure `models/prosit 2/`, `models/prosit 3/`, and `models/prosit 5/` directories exist with all model files
5. **Results Files**: Ensure `results/prosit 2/` and `results/prosit 5/` directories contain metrics and findings files

## 📊 Model Performance

### Prosit 2 - Clustering Metrics
- **K-Means**: 5 clusters, Davies-Bouldin: 1.32, Calinski-Harabasz: 124,281
- **Hierarchical**: 5 clusters, Davies-Bouldin: 2.83
- **DBSCAN**: 1 cluster (most points as outliers)
- **GMM**: 5 clusters, Davies-Bouldin: 3.32

### Prosit 5 - Key Findings
- **First Year Struggle**: 7.7% of students struggle (GPA < 2.5)
- **AJC Cases**: 2.8% of students face AJC
- **Major Success**: 55% achieve major GPA ≥ 3.0
- **Delayed Graduation**: 98.9% experience delays

## 🔒 Security Considerations

For production deployment:

1. Add authentication (JWT, API keys)
2. Implement rate limiting
3. Add input validation
4. Enable HTTPS
5. Set up monitoring and logging
6. Restrict CORS origins

## 🧪 Testing

Run all test suites:

```bash
# Start the API first
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# In separate terminals:
python test_prosit2_api.py
python test_api.py
python test_prosit5_api.py
```

## 📖 API Endpoints Summary

| Prosit | Endpoint | Method | Description |
|--------|----------|--------|-------------|
| - | `/` | GET | API overview and health check |
| 2 | `/prosit2/cluster/{algorithm}` | POST | Assign cluster |
| 2 | `/prosit2/models/info` | GET | Clustering model info |
| 2 | `/prosit2/results/metrics` | GET | Clustering metrics |
| 3 | `/prosit3/predict/{model}` | POST | Probation risk prediction |
| 3 | `/prosit3/predict/ensemble` | POST | Ensemble prediction |
| 3 | `/prosit3/models/info` | GET | Model information |
| 3 | `/prosit3/features` | GET | Required features |
| 5 | `/prosit5/predict/first-year-struggle` | POST | First year struggle |
| 5 | `/prosit5/predict/ajc` | POST | AJC prediction |
| 5 | `/prosit5/predict/major-success` | POST | Major success |
| 5 | `/prosit5/predict/delayed-graduation` | POST | Delayed graduation |
| 5 | `/prosit5/models/info` | GET | All model info |
| 5 | `/prosit5/results/metrics` | GET | Performance metrics |
| 5 | `/prosit5/results/findings` | GET | Research findings |

## 🎯 Next Steps

1. Integrate with web application
2. Add authentication and authorization
3. Implement caching for frequently accessed results
4. Add logging and monitoring
5. Deploy to production server
6. Create client SDKs (Python, JavaScript)
