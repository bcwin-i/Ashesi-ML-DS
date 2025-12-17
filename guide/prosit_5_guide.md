# Prosit 5 Study Guide: Bringing It All Together

## Problem Overview

**Context**: This is the finale—integrating the entire student lifecycle. You have your existing clean data (`merged_cleaned_encoded.csv` from Prosit 2/3) and now, crucially, **Admissions** and **Judicial (AJC)** data.

**Goal**: Build a unified view of the student journey to answer 9 critical strategic questions about admissions, academic success, and misconduct.

---

## 1. Data Inventory & Setup

### Core Datasets
All files are located in `data/` and `data/prosit 5/`.

1.  **Main Student Records**: `data/merged_cleaned_encoded.csv`
    -   *Contains*: Transcript info, grades, demographics (from Prosit 2).
    -   *Key*: `StudentRef` (or equivalent ID column).

2.  **Admissions Data** (`data/prosit 5/`):
    -   `WASSCE_C2023-C2028-anon.csv`: Largest group. Key cols: `Elective Math`, `Mathematics`, `Physics`.
    -   `IB_C2023-C2028-anon.csv`: Key cols: `Math HL`, `Math SL`.
    -   `O&A_Level_C2023-C2028-anon.csv`: Cambridge system.
    -   *Others*: `FrenchBacc...`, `HSDiploma...`.
    -   *Challenge*: Scores are on different scales (1-9, A-F, 1-7). You **must** standardize them.

3.  **Conduct Data** (`data/prosit 5/anon_AJC.csv`):
    -   *Contains*: `Type of Misconduct` (Academic vs Social), `Verdict`.

---

## 2. Research Questions (The "Exam")

You must explicitly answer these 9 questions in your analysis/presentation:

**Group A: Admissions & First Year**
1.  Predict **First-Year Academic Struggle** using Admissions data.
2.  Predict **AJC Involvement** (Misconduct) using Admissions data.

**Group B: Major Success**
3.  Predict **Major Success** using Admissions + Year 1 data.
4.  Predict **Major Failure/Switching** using Admissions + Year 1 data.
5.  Predict **Major Success** using Admissions + Year 1 + Year 2 data.
6.  Predict **Major Failure/Switching** using Admissions + Year 1 + Year 2 data.

**Group C: Strategic Analysis**
7.  **Math Tracks**: Significant performance difference (Grad GPA, Time to Grad) between *Calculus*, *Pre-Calc*, and *College Algebra* tracks?
8.  **Algebra to CS**: Can *College Algebra* track students succeed in Computer Science?
9.  **Early Warning**: Predict if a student will need **>8 semesters** to graduate?

---

## 3. Implementation Plan

### Phase 1: Data Integration & Cleaning
*Critical Step: Creating a single 'Master Table'.*

```python
import pandas as pd
import numpy as np

# 1. Load Main Data
df_main = pd.read_csv('../data/merged_cleaned_encoded.csv')

# 2. Load and Unify Admissions Data
# defined mapping for Standardization (Example)
grade_map = {'A1': 1, 'B2': 2, ...} # WASSCE
ib_map = {7: 1, 6: 2, ...} # IB inverted to match WASSCE direction if needed, or normalized 0-1

# You need a function to extract 'Math Score' regardless of system
def extract_math_score(row):
    # Logic to check system type and pull correct column
    pass

# Concatenate all admissions files into one df_admissions
# columns: [StudentRef, standardized_math, standardized_english, high_school_type]

# 3. Load AJC Data
df_ajc = pd.read_csv('../data/prosit 5/anon_AJC.csv')
# Feature: has_ajc_case (0/1), ajc_type_academic (0/1)
df_ajc_features = df_ajc.groupby('StudentRef').agg({
    'Verdict': 'count', 
    'Type of Misconduct': lambda x: 1 if 'Academic' in str(x) else 0
}).reset_index()

# 4. Merge Everything
df_master = df_main.merge(df_admissions, on='StudentRef', how='left')
df_master = df_master.merge(df_ajc_features, on='StudentRef', how='left')
df_master.fillna(0, inplace=True) # careful with grades, maybe mean imputation
```

### Phase 2: Feature Engineering
You need specific features for the questions:

1.  **Target Variables**:
    -   `is_struggling_y1`: GPA < 2.0 in Sem 1/2.
    -   `has_misconduct`: From AJC data.
    -   `successful_major`: Graduated with GPA > X in major.
    -   `delayed_grad`: Semesters > 8.

2.  **Input Features**:
    -   *Admissions*: `math_z_score`, `english_z_score`, `school_tier`.
    -   *Math Track*: Infer from first math course if not explicit (e.g., if took 'College Algebra' in Sem 1).

### Phase 3: Modeling Strategy

| Question | Model Type | Recommended Features |
| :--- | :--- | :--- |
| **1. Y1 Struggle** | Classification (RF/LogReg) | HS Grades, School Type, Age |
| **2. AJC Pred** | Classification (unbalanced!)| HS Demographics, Scholarship Status? |
| **3-6. Major Success** | Classification/Regression | Add Y1/Y2 GPA, specific course grades (e.g., Intro CS) |
| **7-8. Math Tracks** | Statistical Test (ANOVA/T-test) | Group by `math_track`, compare `grad_gpa` |
| **9. Delayed Grad** | Classification | Failed courses count, Credits per sem |

**Ethical Audit**:
For every model, run a bias check. Does the "AJC Predictor" unfairly flag specific high schools or demographics? **This is a specific grading criteria.**

### Phase 4: Visualization & Reporting
-   **Math Track Plot**: Boxplot of Graduation GPA by Track.
-   **Feature Importance**: specific for "Major Success" (e.g., does HS Math matter for CS?).
-   **Confusion Matrices**: For prediction tasks (Balance Precision/Recall).

---

## 4. Final Checklist

-   [ ] **Standardization**: Did you normalize WASSCE/IB/IGCSE grades to a common scale (e.g., 0-100 or Z-score)?
-   [ ] **Merging**: Did you use `StudentRef` carefully to avoid row duplication?
-   [ ] **Questions**: distinct code section/answer for ALL 9 questions?
-   [ ] **Ethics**: explicit markdown section discussing bias in your AJC prediction?
-   [ ] **Story**: Do not just show code. Explain the *student journey*.

**Good Luck! This is the capstone of your work.**
