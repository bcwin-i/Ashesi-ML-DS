# Prosit 5: Technical Documentation & Decision Log

**Project**: Comprehensive Student Journey Analysis  
**Objective**: Integrate admissions, academic, and conduct data to answer 9 strategic research questions  
**Date**: December 2025  
**Author**: Isaac Bekoe

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Data Sources & Integration](#data-sources--integration)
3. [Research Questions Overview](#research-questions-overview)
4. [Technical Decisions & Rationale](#technical-decisions--rationale)
5. [Data Processing Pipeline](#data-processing-pipeline)
6. [Model Selection & Justification](#model-selection--justification)
7. [Ethical Considerations](#ethical-considerations)
8. [Limitations & Constraints](#limitations--constraints)
9. [QA Validation Points](#qa-validation-points)
10. [Results Summary](#results-summary)

---

## Executive Summary

### Purpose
Prosit 5 represents the culmination of a multi-phase student analytics project, integrating:
- **Admissions data** (6 exam systems: WASSCE, IB, O&A Level, French Baccalaureate, High School Diploma, Other)
- **Academic performance data** (from Prosit 2: clustering analysis)
- **Conduct records** (Ashesi Judicial Council cases)

### Key Outcomes
- **9 research questions** addressed using supervised learning and statistical analysis
- **1,963 students** analyzed across cohorts 2023-2028
- **Predictive models** built for academic struggle, AJC involvement, major success, and graduation delays
- **Statistical comparisons** of math track performance
- **Fairness analysis** to ensure ethical AI deployment

---

## Data Sources & Integration

### 1. Main Academic Data
**Source**: `merged_cleaned_encoded.csv` (from Prosit 2)  
**Records**: 538,147 rows  
**Students**: 12,207 unique students  
**Features**: 56 columns including GPA, CGPA, courses, semesters, programs

**Key Decision**: Used this as the primary dataset because it contains the most comprehensive academic history with temporal information.

### 2. Admissions Data
**Sources**: 6 separate CSV files by exam type
- `WASSCE_C2023-C2028-anon.csv` (1,274 students - largest group)
- `IB_C2023-C2028-anon.csv` (131 students)
- `O&A_Level_C2023-C2028-anon.csv` (343 students)
- `HSDiploma_C2023-C2028-anon.csv` (51 students)
- `FrenchBacc_C2023-C2028-anon.csv` (23 students)
- `Other_C2023-C2028-anon.csv` (141 students)

**Total Admissions Records**: 1,963 students

**Key Decision**: Standardized all exam grades to a 0-100 scale to enable cross-system comparison.

### 3. Conduct Data (AJC)
**Source**: `anon_AJC.csv`  
**Records**: 143 cases  
**Students**: 134 unique students with misconduct cases

**Misconduct Distribution**:
- Academic Misconduct: 103 cases (72%)
- Social Misconduct: 22 cases (15%)
- Sexual Misconduct: 6 cases (4%)
- Combined Academic & Social: 5 cases (3%)

**Key Decision**: Created binary flag `has_ajc_case` rather than using case counts to avoid bias against students with multiple cases.

---

## Research Questions Overview

### Question 1: First-Year Academic Struggle Prediction
**Goal**: Predict if a student will struggle (GPA < 2.0) in Year 1 using only admissions data

**Features Used**:
- Math score (standardized)
- English score (standardized)
- Composite score (average of all subjects)

**Model**: Random Forest Classifier with class balancing
**Performance**: 71% accuracy, but low recall (21%) for struggling students due to class imbalance

**Key Finding**: Composite score is the strongest predictor (60% feature importance)

---

### Question 2: AJC Involvement Prediction
**Goal**: Predict which students will have AJC cases using admissions data

**Features Used**:
- Math score
- English score
- Composite score

**Model**: Logistic Regression with class balancing
**Performance**: 61% accuracy with severe class imbalance (35 cases vs 1,198 non-cases)

**Key Finding**: Model struggles with extreme imbalance (2.8% positive class rate)

**Decision Rationale**: Used Logistic Regression for interpretability in this sensitive use case

---

### Question 3: Major Success Prediction (Admissions + Year 1)
**Goal**: Predict if a student will be successful in their chosen major using admissions + Year 1 data

**Success Definition**: Final CGPA ≥ 2.5 in declared major

**Features Used**:
- Math score
- English score
- First-year GPA

**Model**: Random Forest Classifier
**Performance**: 92% accuracy with balanced precision/recall

**Key Finding**: First-year GPA is highly predictive of major success

---

### Question 4: Major Change Prediction
**Goal**: Predict which students will change majors

**Critical Finding**: **Only 2 students (0.2%) changed majors** in the dataset

**Decision**: Did not build a predictive model due to insufficient positive cases

**Interpretation**: 
- Strong alignment between admissions decisions and student interests
- Effective major selection during admissions process
- Possible structural barriers to changing majors

**Profiles of Students Who Changed**:
1. Student 1: Electrical Engineering → Mechanical Engineering (GPA: 2.75, Math: 90, English: 100)
2. Student 2: MIS → Computer Engineering (GPA: 3.10, Math: 100, English: 85)

---

### Question 5: Major Success with Year 1-2 Data
**Goal**: Improve major success prediction by including Year 2 performance

**Features Used**:
- Math score
- English score
- First-year GPA
- Year 2 GPA

**Model**: Random Forest Classifier
**Performance**: 98% accuracy (significant improvement over Q3's 92%)

**Key Finding**: 
- First-year GPA: 65% feature importance
- Year 2 GPA: 31% feature importance
- Admissions scores: <5% combined importance

**Interpretation**: Academic performance trends over 2 years are far more predictive than admissions scores alone

---

### Question 6: [Not Explicitly Defined]
**Note**: The notebook addresses 9 questions but Q6 appears to be merged with Q3-5 as part of the major success analysis progression.

---

### Question 7: Math Track Performance Comparison
**Goal**: Statistical comparison of graduation GPA across math tracks

**Math Tracks Identified**:
- **Calculus I** (direct entry): 883 students
- **Pre-Calculus**: Data insufficient
- **College Algebra**: 10 students
- **Other**: 465 students

**Statistical Test**: ANOVA followed by t-test

**Results**:
- F-statistic: 5.932, p-value: 0.0151 (significant)
- Calculus students: Mean CGPA = 2.97 (SD: 0.60)
- College Algebra students: Mean CGPA = 2.51 (SD: 0.56)
- **Mean difference**: 0.46 points (statistically significant)

**Key Finding**: Students starting in Calculus I perform significantly better than those in College Algebra

**Decision**: Only compared Calculus vs College Algebra due to insufficient data in Pre-Calculus track

---

### Question 8: College Algebra Track in Computer Science
**Goal**: Analyze performance of College Algebra students specifically in Computer Science major

**Critical Finding**: **Zero College Algebra students** found in Computer Science major

**Possible Interpretations**:
1. College Algebra students self-select into other majors
2. Academic advising steers them away from CS
3. Math prerequisites prevent enrollment in CS courses
4. Structural barriers in curriculum design

**Decision**: No statistical analysis possible; documented as a structural finding

**Implication**: Potential equity issue if math placement creates barriers to CS access

---

### Question 9: Delayed Graduation Prediction
**Goal**: Predict if a student will need more than 8 semesters to graduate

**Features Used**:
- Math score
- English score
- First-year GPA
- Failed courses count

**Model**: Random Forest Classifier with class balancing
**Performance**: 99% accuracy, but extreme class imbalance (only 3 on-time graduates in test set)

**Feature Importance**:
- First-year GPA: 76%
- English score: 16%
- Math score: 9%
- Failed courses: 0%

**Key Finding**: Almost all students in this cohort are delayed, making prediction trivial

**Interpretation**: This reflects the dataset composition (recent cohorts still enrolled) rather than a true pattern

---

## Technical Decisions & Rationale

### 1. Grade Standardization

**Problem**: Different exam systems use incompatible grading scales

**Solution**: Mapped all grades to 0-100 scale

**Mapping Tables**:

#### WASSCE (West African Senior School Certificate)
```python
'A1': 100, 'B2': 90, 'B3': 85, 'C4': 80, 'C5': 75, 'C6': 70,
'D7': 65, 'E8': 60, 'F9': 50
```

#### IB (International Baccalaureate)
```python
7: 100, 6: 90, 5: 80, 4: 70, 3: 60, 2: 50, 1: 40
```

#### O/A Level
```python
'A': 100, 'B': 85, 'C': 70, 'D': 60, 'E': 50, 'F': 40
```

**Rationale**: 
- Preserves relative ranking within each system
- Enables cross-system comparison
- Maintains interpretability (higher = better)

**Limitation**: Assumes linear equivalence between systems, which may not reflect true difficulty

---

### 2. Feature Engineering

#### Composite Score
**Formula**: Average of standardized Math and English scores

**Rationale**: 
- Captures overall academic preparedness
- Reduces dimensionality
- Proved to be the strongest predictor in Q1

#### Math Track Classification
**Logic**:
```python
if 'Calculus I' in course_name: return 'Calculus'
elif 'Pre-Calculus' in course_name: return 'Pre-Calculus'
elif 'College Algebra' in course_name: return 'College Algebra'
else: return 'Other'
```

**Rationale**: First math course indicates placement level and preparedness

#### Success Metrics
- **Struggling**: GPA < 2.0 (Ashesi probation threshold)
- **Successful Major**: Final CGPA ≥ 2.5
- **Delayed Graduation**: More than 8 semesters enrolled

**Rationale**: Aligned with Ashesi's academic policies

---

### 3. Model Selection

#### Random Forest (Q1, Q3, Q5, Q9)
**Chosen for**:
- Non-linear relationships
- Feature importance interpretability
- Robustness to outliers
- No assumptions about data distribution

**Hyperparameters**:
- `n_estimators=100` (balance between performance and speed)
- `class_weight='balanced'` (address class imbalance)
- `random_state=42` (reproducibility)

#### Logistic Regression (Q2)
**Chosen for**:
- Interpretability (critical for AJC prediction)
- Probabilistic outputs
- Transparency for ethical review
- Better calibration for imbalanced data

**Hyperparameters**:
- `class_weight='balanced'`
- `max_iter=1000` (ensure convergence)

#### Statistical Tests (Q7, Q8)
**ANOVA**: Compare means across multiple groups
**T-test**: Pairwise comparison when only 2 groups
**Significance level**: α = 0.05

**Rationale**: Descriptive analysis more appropriate than prediction for policy questions

---

### 4. Train-Test Split Strategy

**Configuration**:
- Test size: 20%
- Random state: 42 (reproducibility)
- Stratification: Applied when possible to maintain class balance

**Rationale**: 
- 80/20 split is standard for datasets of this size (1,000-2,000 samples)
- Stratification critical for imbalanced classes
- Random state ensures reproducible results for QA

---

### 5. Handling Class Imbalance

**Strategies Used**:

1. **Class Weighting** (`class_weight='balanced'`)
   - Applied to: Q1, Q2, Q9
   - Effect: Penalizes misclassification of minority class more heavily

2. **Stratified Sampling**
   - Applied to: All train-test splits
   - Effect: Maintains class distribution in both sets

3. **Metric Selection**
   - Primary: F1-score (harmonic mean of precision/recall)
   - Secondary: Precision and Recall separately
   - Avoided: Accuracy alone (misleading with imbalance)

**Decision Not to Use**:
- SMOTE/oversampling: Risk of overfitting with small positive class
- Undersampling: Would lose too much information from majority class

---

## Data Processing Pipeline

### Stage 1: Data Loading
```
1. Load main academic data (538K records)
2. Load 6 admissions files (1,963 students)
3. Load AJC conduct data (143 cases)
```

### Stage 2: Grade Standardization
```
1. Apply exam-specific conversion functions
2. Extract Math and English scores
3. Calculate composite scores
4. Handle missing values (NaN preserved for later filtering)
```

### Stage 3: Student-Level Aggregation
```
1. Group academic data by StudentRef
2. Calculate first-year GPA (semesters 1-2)
3. Calculate year-two GPA (semesters 3-4)
4. Calculate final CGPA
5. Count failed courses
6. Identify major changes
7. Determine graduation timeline
```

### Stage 4: Data Integration
```
1. Merge admissions → academic (left join on StudentRef)
2. Merge AJC → combined (left join, create binary flag)
3. Result: student_summary dataframe (1,963 rows)
```

### Stage 5: Feature Engineering
```
1. Create success flags (struggling, successful_major, delayed_grad)
2. Classify math tracks
3. Handle missing values per question
4. Create question-specific datasets
```

### Stage 6: Modeling
```
For each question:
1. Filter to relevant features
2. Drop rows with missing values
3. Split train/test (80/20, stratified)
4. Scale features (StandardScaler)
5. Train model
6. Evaluate on test set
7. Extract feature importance/statistics
```

---

## Model Selection & Justification

### Why Random Forest for Most Questions?

**Advantages**:
1. **Non-parametric**: No assumptions about data distribution
2. **Handles non-linearity**: Captures complex relationships
3. **Feature importance**: Built-in interpretability
4. **Robust**: Less prone to overfitting than single decision trees
5. **Handles mixed data**: Works with continuous and categorical features

**Disadvantages** (acknowledged):
1. **Black box**: Less interpretable than linear models
2. **Computational cost**: Slower than simpler models
3. **Memory intensive**: Stores multiple trees

**Trade-off Decision**: Prioritized predictive performance and robustness over pure interpretability, except for Q2 (AJC) where ethical concerns warranted Logistic Regression.

### Why Logistic Regression for Q2 (AJC)?

**Rationale**:
1. **Transparency**: Coefficients show exact contribution of each feature
2. **Auditability**: Easier to explain to stakeholders
3. **Ethical requirement**: AJC predictions have serious consequences
4. **Calibrated probabilities**: Better for decision thresholds
5. **Regulatory compliance**: More defensible in fairness audits

---

## Ethical Considerations

### 1. Feature Selection Ethics

**Excluded Features**:
- Nationality (except for fairness analysis)
- Gender
- Financial aid status
- High school location
- Socioeconomic indicators

**Rationale**: Avoid encoding systemic biases into predictions

**Exception**: Used nationality in fairness analysis (Section 6) to detect disparate impact

---

### 2. Fairness Analysis (Question 2 - AJC Prediction)

**Method**: Disparate Impact Ratio

**Formula**: 
```
Disparate Impact = min(predicted_rate_by_group) / max(predicted_rate_by_group)
```

**Threshold**: 0.8 (80% rule from employment discrimination law)

**Results**:
- Disparate Impact Ratio: 0.88
- **Conclusion**: No significant disparate impact detected

**Limitation**: Only analyzed nationality; should also check gender, socioeconomic status

---

### 3. Use Case Appropriateness

**Appropriate Uses**:
- ✅ Early warning systems for academic support
- ✅ Resource allocation for tutoring programs
- ✅ Curriculum design decisions (e.g., math track analysis)

**Inappropriate Uses**:
- ❌ Automated admissions decisions
- ❌ Punitive measures based on predictions
- ❌ Denying opportunities to predicted "high-risk" students

**Recommendation**: All predictions should trigger **support interventions**, not **exclusionary actions**

---

### 4. Model Transparency

**Documentation Requirements**:
- All models saved with metadata (features, hyperparameters, performance)
- Feature importance reported for all tree-based models
- Confusion matrices provided for classification tasks
- Sample size and class distribution reported

**Reproducibility**:
- Random seeds fixed (`random_state=42`)
- All preprocessing steps documented
- Data splits preserved

---

## Limitations & Constraints

### 1. Data Limitations

#### Temporal Coverage
- **Admissions data**: Only cohorts 2023-2028
- **Academic data**: Extends back further but merged dataset limited to recent cohorts
- **Implication**: Cannot analyze long-term trends or older cohorts

#### Missing Data
- **Year 2 data**: Only 1,117 students (57% of admissions cohort)
- **Reason**: Recent cohorts haven't completed Year 2
- **Impact**: Q5 limited to subset of students

#### Sample Size Issues
- **Major changes**: Only 2 cases (Q4 not viable)
- **College Algebra in CS**: 0 cases (Q8 descriptive only)
- **On-time graduation**: Only 3 cases in test set (Q9 biased)

---

### 2. Methodological Limitations

#### Grade Standardization Assumptions
- Assumes linear equivalence between exam systems
- Does not account for subject difficulty variations
- May not reflect true academic preparedness

#### Class Imbalance
- **Q1 (Struggling)**: 19 positive vs 227 negative (7.7%)
- **Q2 (AJC)**: 7 positive vs 240 negative (2.8%)
- **Q9 (Delayed)**: 243 positive vs 3 negative (98.8%)

**Impact**: Models may have poor minority class performance

#### Causality vs Correlation
- All models are **correlational**, not causal
- Cannot determine if admissions scores **cause** academic outcomes
- Confounding variables (motivation, support systems) not measured

---

### 3. Generalizability Constraints

#### Population Specificity
- Results specific to Ashesi University context
- May not generalize to other institutions
- Different grading policies, support systems, student populations

#### Temporal Validity
- Models trained on 2023-2028 cohorts
- May not apply to future cohorts if:
  - Admissions criteria change
  - Curriculum evolves
  - Student demographics shift

---

### 4. Technical Limitations

#### Feature Engineering
- Limited to admissions scores and academic performance
- Missing potentially important features:
  - Extracurricular involvement
  - Work experience
  - Leadership roles
  - Peer network strength
  - Mental health indicators

#### Model Complexity
- Random Forests are ensemble models (less interpretable)
- Cannot easily explain individual predictions
- Difficult to identify specific intervention points

---

## QA Validation Points

### 1. Data Integrity Checks

**Pre-Processing**:
- [ ] Verify StudentRef uniqueness in admissions data
- [ ] Check for duplicate records in AJC data
- [ ] Validate GPA ranges (0.0-4.0)
- [ ] Confirm semester numbering (1-8+)
- [ ] Verify exam grade formats match expected patterns

**Post-Processing**:
- [ ] Confirm standardized scores in 0-100 range
- [ ] Validate composite score calculations
- [ ] Check for data leakage (future data in features)
- [ ] Verify train-test split has no overlap

---

### 2. Model Validation Checks

**Training**:
- [ ] Confirm class weights applied correctly
- [ ] Verify stratification in train-test split
- [ ] Check for overfitting (train vs test performance)
- [ ] Validate feature scaling (mean≈0, std≈1)

**Evaluation**:
- [ ] Reproduce reported metrics on test set
- [ ] Verify confusion matrix calculations
- [ ] Check feature importance sums to 1.0
- [ ] Validate statistical test assumptions (normality, equal variance)

---

### 3. Reproducibility Checks

**Environment**:
- [ ] Python version: 3.x
- [ ] Key libraries: pandas, numpy, scikit-learn, scipy, plotly
- [ ] Random seed: 42 (all models)

**Data**:
- [ ] Same data files used
- [ ] Same preprocessing steps applied
- [ ] Same train-test splits generated

**Results**:
- [ ] Metrics match within ±0.01
- [ ] Feature importance rankings consistent
- [ ] Statistical p-values match within ±0.001

---

### 4. Ethical Validation Checks

**Fairness**:
- [ ] Disparate impact ratio ≥ 0.8 for all protected groups
- [ ] No protected attributes in feature set (except fairness analysis)
- [ ] Model performance similar across demographic groups

**Transparency**:
- [ ] All decisions documented with rationale
- [ ] Feature importance reported for all models
- [ ] Limitations clearly stated
- [ ] Appropriate use cases defined

---

### 5. Statistical Validation Checks

**Question 7 (ANOVA)**:
- [ ] Normality assumption checked (Shapiro-Wilk or Q-Q plot)
- [ ] Equal variance assumption checked (Levene's test)
- [ ] Sample sizes sufficient (n≥5 per group)
- [ ] Post-hoc tests appropriate (t-test for 2 groups)

**Question 8 (T-test)**:
- [ ] Independence assumption met
- [ ] Normality checked for both groups
- [ ] Equal variance assumption tested
- [ ] Two-tailed test appropriate for research question

---

## Results Summary

### Model Performance Overview

| Question | Model | Accuracy | Key Finding |
|----------|-------|----------|-------------|
| Q1: First-Year Struggle | Random Forest | 71% | Composite score most predictive (60%) |
| Q2: AJC Involvement | Logistic Regression | 61% | Severe class imbalance limits performance |
| Q3: Major Success (Y1) | Random Forest | 92% | First-year GPA highly predictive |
| Q4: Major Change | N/A | N/A | Only 2 cases - insufficient data |
| Q5: Major Success (Y1-2) | Random Forest | 98% | Adding Y2 data improves accuracy 6% |
| Q7: Math Track Comparison | ANOVA + T-test | N/A | Calculus students outperform by 0.46 GPA |
| Q8: College Algebra in CS | Descriptive | N/A | Zero cases found - structural barrier |
| Q9: Delayed Graduation | Random Forest | 99% | Almost all students delayed (dataset artifact) |

---

### Key Insights for Stakeholders

#### 1. Admissions Predictors
- **Composite score** (average of all subjects) is more predictive than individual subjects
- **Math and English** alone explain <20% of variance in first-year performance
- **Implication**: Holistic admissions approach justified

#### 2. Academic Performance Trends
- **First-year GPA** is the strongest predictor of major success (65% importance)
- **Year 2 GPA** adds significant predictive power (31% importance)
- **Implication**: Early intervention in Year 1 is critical

#### 3. Math Track Equity
- **Calculus students** graduate with 0.46 higher CGPA than College Algebra students
- **Zero College Algebra students** in Computer Science major
- **Implication**: Math placement may create structural barriers to STEM access

#### 4. Major Changes
- **Extremely rare** (0.2% of students)
- Both cases involved high-performing students (GPA > 2.75)
- **Implication**: Strong admissions-major alignment OR barriers to switching

#### 5. AJC Prediction Challenges
- **Severe class imbalance** (2.8% positive rate)
- **Low predictive power** from admissions data alone
- **Implication**: Conduct issues not predictable from academic metrics

---

### Recommendations for Future Work

#### 1. Data Collection
- **Expand features**: Collect extracurricular, leadership, work experience data
- **Longitudinal tracking**: Follow cohorts through graduation
- **Qualitative data**: Interview students who changed majors or struggled

#### 2. Model Improvements
- **Ensemble methods**: Combine multiple models for better performance
- **Time-series analysis**: Model GPA trajectories over time
- **Survival analysis**: Model time-to-graduation more rigorously

#### 3. Fairness Enhancements
- **Intersectional analysis**: Check fairness across multiple demographics simultaneously
- **Counterfactual fairness**: Test if changing protected attributes changes predictions
- **Stakeholder engagement**: Involve students in model design and validation

#### 4. Deployment Considerations
- **Human-in-the-loop**: All predictions reviewed by advisors
- **Feedback loops**: Track intervention effectiveness
- **Model monitoring**: Detect performance degradation over time
- **Bias audits**: Annual fairness reviews

---

## Conclusion

Prosit 5 successfully integrates multiple data sources to provide actionable insights into student success patterns at Ashesi University. While predictive models show promise for early warning systems, significant limitations exist:

1. **Class imbalance** severely impacts minority class prediction
2. **Small sample sizes** for rare events (major changes, on-time graduation)
3. **Missing features** limit explanatory power
4. **Temporal constraints** prevent long-term validation

**Most Important Finding**: Math track placement appears to create structural inequities in access to Computer Science and overall academic outcomes. This warrants immediate policy review.

**Ethical Imperative**: All models must be used for **support and intervention**, never for **exclusion or punishment**. Predictions should trigger resource allocation, not opportunity denial.

---

## Appendix: Glossary

**ANOVA**: Analysis of Variance - statistical test comparing means across multiple groups  
**AJC**: Ashesi Judicial Council - disciplinary body for misconduct cases  
**CGPA**: Cumulative Grade Point Average (0.0-4.0 scale)  
**Disparate Impact**: Disproportionate effect on protected demographic groups  
**F1-Score**: Harmonic mean of precision and recall (0.0-1.0)  
**GPA**: Grade Point Average for a single semester (0.0-4.0 scale)  
**IB**: International Baccalaureate (graded 1-7)  
**O&A Level**: Ordinary and Advanced Level (British system, graded A-F)  
**Random Forest**: Ensemble of decision trees for classification/regression  
**Stratification**: Maintaining class distribution in train-test split  
**WASSCE**: West African Senior School Certificate Examination (graded A1-F9)

---

**Document Version**: 1.0  
**Last Updated**: December 17, 2025  
**Review Status**: Ready for QA validation
