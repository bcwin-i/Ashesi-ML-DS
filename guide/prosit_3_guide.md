# Prosit 3 Study Guide: Predicting and Supporting Student Success

## Problem Overview

**Context**: After discovering hidden patterns in student data, Ashesi leadership wants to move from exploration to prediction. They want to identify students who might need academic support before it's too late.

**Key Request**: "We don't want to wait until it's too late. If we could anticipate academic challenges early enough, our advisors could reach out and help, but we must do this responsibly."

**Critical Policies** (Ashesi Student Handbook 2022/2023):
- **Dean's List**: Semester GPA ≥ 3.5
- **Probation**: Cumulative GPA < 2.0
- **Dismissal**: (1) Failure to make normal degree progress, OR (2) After two consecutive semesters on probation without achieving GPA ≥ 2.0

---

## Learning Objectives

### 1. **Supervised Learning Fundamentals**
- Understand supervised vs unsupervised learning
- Distinguish between classification and regression
- Apply classical supervised learning methods

### 2. **Model Training & Validation**
- Implement train-test splits and cross-validation
- Perform hyperparameter tuning
- Avoid overfitting through proper validation

### 3. **Regularization Techniques**
- Understand bias-variance tradeoff
- Apply L1 (Lasso) and L2 (Ridge) regularization
- Use Elastic Net for combined regularization

---

## Key Concepts

### Model Comparison

| Model | Pros | Cons | Use Case |
|-------|------|------|----------|
| **Linear/Logistic Regression** | Interpretable, fast | Assumes linearity | Baseline, interpretability needed |
| **Ridge** | Handles multicollinearity | All features retained | Many correlated features |
| **Lasso** | Feature selection | Can be unstable | Want sparse model |
| **Random Forest** | Handles non-linearity, robust | Less interpretable | Complex relationships |
| **Gradient Boosting** | High accuracy | Prone to overfitting | Maximum performance |

### Evaluation Metrics

#### Classification

| Metric | Formula | When to Use | Range |
|--------|---------|-------------|-------|
| **Accuracy** | (TP + TN) / Total | Balanced classes | [0, 1] |
| **Precision** | TP / (TP + FP) | Minimize false alarms | [0, 1] |
| **Recall** | TP / (TP + FN) | Catch all positives | [0, 1] |
| **F1-Score** | 2 × (Prec × Rec) / (Prec + Rec) | Balance prec/recall | [0, 1] |
| **ROC-AUC** | Area under ROC curve | Overall performance | [0, 1] |

---

## Implementation Examples

### Train-Test Split

```python
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
```

### Logistic Regression with Cross-Validation

```python
from sklearn.linear_model import LogisticRegressionCV
from sklearn.metrics import classification_report, roc_auc_score

# Train with CV
log_reg = LogisticRegressionCV(cv=5, random_state=42, max_iter=1000)
log_reg.fit(X_train_scaled, y_train)

# Predict
y_pred = log_reg.predict(X_test_scaled)
y_pred_proba = log_reg.predict_proba(X_test_scaled)[:, 1]

# Evaluate
print(classification_report(y_test, y_pred))
print(f"ROC-AUC: {roc_auc_score(y_test, y_pred_proba):.3f}")
```

### Ridge Regression

```python
from sklearn.linear_model import RidgeCV

# Hyperparameter tuning
alphas = np.logspace(-3, 3, 50)
ridge = RidgeCV(alphas=alphas, cv=5)
ridge.fit(X_train_scaled, y_train)

print(f"Optimal alpha: {ridge.alpha_:.3f}")

# Evaluate
from sklearn.metrics import mean_squared_error, r2_score
y_pred = ridge.predict(X_test_scaled)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print(f"RMSE: {rmse:.3f}")
print(f"R²: {r2:.3f}")
```

### Random Forest with GridSearch

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV

# Define parameter grid
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [5, 10, 15],
    'min_samples_split': [5, 10, 20]
}

# Grid search
grid_search = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid,
    cv=5,
    scoring='f1',
    n_jobs=-1
)

grid_search.fit(X_train_scaled, y_train)
print(f"Best parameters: {grid_search.best_params_}")
print(f"Best F1 score: {grid_search.best_score_:.3f}")
```

---

## Bias-Variance Tradeoff

```
Total Error = Bias² + Variance + Irreducible Error

Bias: Error from wrong assumptions (underfitting)
Variance: Error from sensitivity to training data (overfitting)
```

**Regularization helps:**
- **Ridge (L2)**: Shrinks all coefficients, reduces variance
- **Lasso (L1)**: Eliminates some coefficients, feature selection
- **Elastic Net**: Combines both

---

## Ethical Considerations

### Fairness Analysis

```python
# Check performance across demographic groups
for group in df['demographic_group'].unique():
    group_mask = df['demographic_group'] == group
    group_pred = model.predict(X_test[group_mask])
    group_labels = y_test[group_mask]
    
    f1 = f1_score(group_labels, group_pred)
    print(f"{group}: F1 = {f1:.3f}")
```

### Responsible Deployment

1. **Human-in-the-Loop**: Never auto-act on predictions
2. **Transparency**: Explain why a student was flagged
3. **Positive Framing**: "Eligible for support" not "at-risk"
4. **Regular Audits**: Monitor for bias and drift
5. **Opt-Out**: Allow students to decline intervention

---

## Deliverables

1. **Detailed Notebook**
   - Multiple models implemented
   - Hyperparameter tuning
   - Cross-validation
   - Model evaluation
   - Bias-variance analysis

2. **Technical Report**
   - Problem formulation
   - Methodology
   - Results and comparisons
   - Ethical considerations
   - Recommendations

---

## Success Checklist

- [ ] Defined ethically appropriate target variable
- [ ] Selected relevant, non-discriminatory features
- [ ] Properly split data (train/validation/test)
- [ ] Implemented multiple models for comparison
- [ ] Applied regularization techniques
- [ ] Tuned hyperparameters with CV
- [ ] Evaluated with appropriate metrics
- [ ] Analyzed bias-variance tradeoff
- [ ] Checked fairness across groups
- [ ] Documented limitations clearly

---

## Resources

**Textbooks:**
- Géron, A. (2022). Hands-on Machine Learning with Scikit-Learn, Keras, and TensorFlow (3rd ed.)
- James, G., et al. (2023). An Introduction to Statistical Learning with Applications in Python

**Online:**
- [Machine Learning with Python](https://github.com/mariahsonja/machine-learning)
- [Supervised Learning Guide](https://medium.com/@ngneha090/a-guide-to-supervised-learning-f2ddf1018ee0)
