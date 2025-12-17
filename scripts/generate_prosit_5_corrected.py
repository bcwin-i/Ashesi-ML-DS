"""
Corrected Prosit 5 Notebook Generator - Using actual column names and data structure
"""

import nbformat as nbf
from nbformat.v4 import new_notebook, new_markdown_cell, new_code_cell
import sys


def main():
    """Generate complete Prosit 5 notebook with correct data handling"""
    print("Generating corrected Prosit 5 notebook...")

    nb = new_notebook()
    cells = []

    # ========== TITLE ==========
    cells.append(
        new_markdown_cell(
            """# Prosit 5: Bringing It All Together
## Comprehensive Student Journey Analysis

**Objective**: Integrate admissions, academic, and conduct data to answer 9 strategic research questions

**Data Sources**:
- Student academic data: `merged_cleaned_encoded.csv` (24K records)
- Admissions test scores: WASSCE, IB, O&A Level files
- Conduct records: AJC data"""
        )
    )

    # ========== 1. SETUP ==========
    cells.append(new_markdown_cell("## 1. Setup"))
    cells.append(
        new_code_cell(
            """import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, roc_curve, auc, accuracy_score

from scipy.stats import f_oneway, ttest_ind
import warnings
warnings.filterwarnings('ignore')

print('✅ Libraries loaded!')"""
        )
    )

    # ========== 2. DATA LOADING ==========
    cells.append(new_markdown_cell("## 2. Data Loading"))

    cells.append(new_markdown_cell("### 2.1 Student Academic Data"))
    cells.append(
        new_code_cell(
            """# Load student-level academic data
df_students = pd.read_csv('../data/merged_cleaned_encoded.csv')

print(f'Student data: {df_students.shape}')
print(f'Unique students: {df_students[\"StudentRef\"].nunique()}')
print(f'\\nColumns: {list(df_students.columns)}')

df_students.head()"""
        )
    )

    cells.append(new_markdown_cell("### 2.2 Admissions Data"))
    cells.append(
        new_code_cell(
            """import glob

admissions_files = glob.glob('../data/prosit 5/*_C2023-C2028-anon.csv')
print(f'Found {len(admissions_files)} admissions files')

admissions_dfs = {}
for file in admissions_files:
    exam_type = file.split('/')[-1].split('_')[0]
    admissions_dfs[exam_type] = pd.read_csv(file)
    print(f'{exam_type}: {admissions_dfs[exam_type].shape[0]} students')"""
        )
    )

    cells.append(new_markdown_cell("### 2.3 AJC Data"))
    cells.append(
        new_code_cell(
            """df_ajc = pd.read_csv('../data/prosit 5/anon_AJC.csv')
print(f'AJC: {df_ajc.shape}, Students: {df_ajc[\"StudentRef\"].nunique()}')
df_ajc.head()"""
        )
    )

    # ========== 3. DATA PROCESSING ==========
    cells.append(new_markdown_cell("## 3. Data Processing"))

    cells.append(new_markdown_cell("### 3.1 Grade Standardization Functions"))
    cells.append(
        new_code_cell(
            """# WASSCE grade mapping
wassce_map = {
    'A1': 100, 'B2': 90, 'B3': 85, 'C4': 80, 'C5': 75, 'C6': 70,
    'D7': 65, 'E8': 60, 'F9': 50
}

# IB grade mapping
ib_map = {7: 100, 6: 90, 5: 80, 4: 70, 3: 60, 2: 50, 1: 40}

# O/A Level grade mapping
olevel_map = {'A': 100, 'B': 85, 'C': 70, 'D': 60, 'E': 50}

def standardize_wassce_grade(grade):
    if pd.isna(grade):
        return np.nan
    return wassce_map.get(str(grade).strip().upper(), np.nan)

def standardize_ib_grade(grade):
    if pd.isna(grade):
        return np.nan
    try:
        return ib_map.get(int(grade), np.nan)
    except:
        return np.nan

def standardize_olevel_grade(grade):
    if pd.isna(grade):
        return np.nan
    return olevel_map.get(str(grade).strip().upper(), np.nan)

print('✅ Grade standardization functions defined')"""
        )
    )

    cells.append(new_markdown_cell("### 3.2 Process Admissions Data"))
    cells.append(
        new_code_cell(
            """# Process WASSCE - using ACTUAL column names
wassce = admissions_dfs['WASSCE'].copy()
wassce['math_score'] = wassce['Elective Math'].fillna(wassce['Mathematics']).apply(standardize_wassce_grade)
wassce['english_score'] = wassce['English Language'].apply(standardize_wassce_grade)
wassce['science_score'] = wassce[['Physics', 'Chemistry', 'Biology']].apply(
    lambda row: row.apply(standardize_wassce_grade).mean(), axis=1
)
wassce['exam_type'] = 'WASSCE'

# Process IB - dynamic column search
ib = admissions_dfs['IB'].copy()
math_cols = [col for col in ib.columns if 'Math' in col or 'math' in col]
ib['math_score'] = ib[math_cols].apply(
    lambda row: row.apply(standardize_ib_grade).max(), axis=1
)
eng_cols = [col for col in ib.columns if 'English' in col or 'english' in col]
ib['english_score'] = ib[eng_cols].apply(
    lambda row: row.apply(standardize_ib_grade).max(), axis=1
)
sci_cols = [col for col in ib.columns if any(s in col for s in ['Physics', 'Chemistry', 'Biology'])]
ib['science_score'] = ib[sci_cols].apply(
    lambda row: row.apply(standardize_ib_grade).mean(), axis=1
)
ib['exam_type'] = 'IB'

# Process O&A Level - using ACTUAL column names
olevel = admissions_dfs['O&A'].copy()
olevel['math_score'] = olevel['Mathematics'].apply(standardize_olevel_grade)
olevel['english_score'] = olevel['English'].apply(standardize_olevel_grade)
olevel['science_score'] = olevel[['Physics', 'Chemistry', 'Biology']].apply(
    lambda row: row.apply(standardize_olevel_grade).mean(), axis=1
)
olevel['exam_type'] = 'O&A_Level'

print('✅ Admissions data processed')"""
        )
    )

    cells.append(new_markdown_cell("### 3.3 Combine Admissions Data"))
    cells.append(
        new_code_cell(
            """common_cols = ['StudentRef', 'Yeargroup', 'Proposed Major', 'High School', 
               'Exam Type', 'math_score', 'english_score', 'science_score', 'exam_type']

df_admissions = pd.concat([
    wassce[common_cols],
    ib[common_cols],
    olevel[common_cols]
], ignore_index=True)

df_admissions['composite_score'] = df_admissions[['math_score', 'english_score', 'science_score']].mean(axis=1)

print(f'Combined admissions: {df_admissions.shape}')
print(f'Students: {df_admissions[\"StudentRef\"].nunique()}')
df_admissions.head()"""
        )
    )

    cells.append(new_markdown_cell("### 3.4 Process AJC Data"))
    cells.append(
        new_code_cell(
            """df_ajc_features = df_ajc.groupby('StudentRef').agg({
    'Verdict': 'count',
    'Type of Misconduct': lambda x: (x.str.contains('Academic', na=False)).sum()
}).reset_index()
df_ajc_features.columns = ['StudentRef', 'ajc_case_count', 'ajc_academic_count']
df_ajc_features['ajc_social_count'] = df_ajc_features['ajc_case_count'] - df_ajc_features['ajc_academic_count']
df_ajc_features['has_ajc_case'] = 1

print(f'AJC features: {len(df_ajc_features)} students')
df_ajc_features.head()"""
        )
    )

    cells.append(new_markdown_cell("### 3.5 Merge All Data"))
    cells.append(
        new_code_cell(
            """# Merge student data with admissions
df_master = df_students.merge(df_admissions, on='StudentRef', how='left', suffixes=('', '_adm'))

# Merge with AJC
df_master = df_master.merge(df_ajc_features, on='StudentRef', how='left')
df_master[['ajc_case_count', 'ajc_academic_count', 'ajc_social_count', 'has_ajc_case']] = df_master[['ajc_case_count', 'ajc_academic_count', 'ajc_social_count', 'has_ajc_case']].fillna(0)

print(f'Master dataset: {df_master.shape}')
print(f'Students: {df_master[\"StudentRef\"].nunique()}')
print(f'With admissions: {df_master[\"math_score\"].notna().sum()} records')
print(f'Unique students with admissions: {df_master[df_master[\"math_score\"].notna()][\"StudentRef\"].nunique()}')

df_master.head()"""
        )
    )

    # ========== 4. FEATURE ENGINEERING ==========
    cells.append(new_markdown_cell("## 4. Feature Engineering"))

    cells.append(new_markdown_cell("### 4.1 Student-Level Summary"))
    cells.append(
        new_code_cell(
            """# Create student-level summary
student_summary = df_master.groupby('StudentRef').agg({
    'CGPA': 'last',
    'GPA': ['mean', 'last'],
    'Semester/Year': 'max',
    'Program': 'last',
    'Intended_Major': 'first',
    'math_score': 'first',
    'english_score': 'first',
    'composite_score': 'first',
    'has_ajc_case': 'first',
    'Yeargroup': 'first'
}).reset_index()

student_summary.columns = ['StudentRef', 'final_cgpa', 'avg_gpa', 'last_gpa',
                           'total_semesters', 'final_major', 'proposed_major',
                           'math_score', 'english_score', 'composite_score',
                           'has_ajc_case', 'yeargroup']

print(f'Student summary: {student_summary.shape}')
student_summary.head()"""
        )
    )

    cells.append(new_markdown_cell("### 4.2 Target Variables"))
    cells.append(
        new_code_cell(
            """# Create target variables
student_summary['struggling'] = (student_summary['final_cgpa'] < 2.0).astype(int)
student_summary['successful'] = (student_summary['final_cgpa'] >= 3.0).astype(int)
student_summary['major_changed'] = (student_summary['proposed_major'] != student_summary['final_major']).astype(int)
student_summary['delayed_grad'] = (student_summary['total_semesters'] > 8).astype(int)

print('✅ Target variables created')
print(f'\\nData completeness:')
print(f'  Students with admissions: {student_summary[\"math_score\"].notna().sum()}')
print(f'  Students with CGPA: {student_summary[\"final_cgpa\"].notna().sum()}')
print(f'  Both: {student_summary[[\"math_score\", \"final_cgpa\"]].notna().all(axis=1).sum()}')"""
        )
    )

    # ========== 5. RESEARCH QUESTIONS ==========
    cells.append(new_markdown_cell("## 5. Research Questions"))

    # Helper function to create model cells
    def create_q_cells(q_num, title, features_list, target, filter_desc):
        q_cells = []
        q_cells.append(new_markdown_cell(f"### Question {q_num}: {title}"))

        code = f"""# Q{q_num}: {title}
print(f'\\n{'='*60}')
print(f'Q{q_num}: {title}')
print(f'{'='*60}')

# Filter data
q{q_num}_data = student_summary[{filter_desc}].copy()
print(f'Data: {{len(q{q_num}_data)}} students')

if len(q{q_num}_data) > 20:
    X = q{q_num}_data[{features_list}]
    y = q{q_num}_data['{target}']
    
    print(f'Target distribution: {{y.value_counts().to_dict()}}')
    
    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    model.fit(X_train_scaled, y_train)
    
    # Predictions
    y_pred = model.predict(X_test_scaled)
    y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
    
    acc = accuracy_score(y_test, y_pred)
    print(f'\\nAccuracy: {{acc:.3f}}')
    print(classification_report(y_test, y_pred))
    
    # Feature importance
    feat_imp = pd.DataFrame({{'feature': {features_list}, 'importance': model.feature_importances_}})
    feat_imp = feat_imp.sort_values('importance', ascending=False)
    
    # === VISUALIZATIONS ===
    fig = make_subplots(
        rows=2, cols=2,
        subplot_titles=('Confusion Matrix', 'ROC Curve', 'Feature Importance', 'Prediction Distribution'),
        specs=[[{{'type': 'heatmap'}}, {{'type': 'scatter'}}],
               [{{'type': 'bar'}}, {{'type': 'bar'}}]]
    )
    
    # 1. Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    fig.add_trace(
        go.Heatmap(z=cm, x=['Pred 0', 'Pred 1'], y=['True 0', 'True 1'],
                   colorscale='Blues', showscale=False, text=cm, texttemplate='%{{text}}'),
        row=1, col=1
    )
    
    # 2. ROC Curve
    fpr, tpr, _ = roc_curve(y_test, y_pred_proba)
    roc_auc = auc(fpr, tpr)
    fig.add_trace(
        go.Scatter(x=fpr, y=tpr, name=f'AUC={{roc_auc:.3f}}', mode='lines',
                   line=dict(color='blue', width=2)),
        row=1, col=2
    )
    fig.add_trace(
        go.Scatter(x=[0, 1], y=[0, 1], name='Random', mode='lines',
                   line=dict(dash='dash', color='gray')),
        row=1, col=2
    )
    
    # 3. Feature Importance
    fig.add_trace(
        go.Bar(x=feat_imp['importance'], y=feat_imp['feature'], orientation='h',
               marker=dict(color='steelblue')),
        row=2, col=1
    )
    
    # 4. Prediction Distribution
    pred_counts = pd.Series(y_pred).value_counts().sort_index()
    fig.add_trace(
        go.Bar(x=pred_counts.index.astype(str), y=pred_counts.values,
               marker=dict(color='lightcoral')),
        row=2, col=2
    )
    
    fig.update_layout(height=800, title_text=f'Q{q_num}: {title}', showlegend=False)
    fig.show()
    
    # Store results
    q{q_num}_results = {{'accuracy': acc, 'auc': roc_auc}}
else:
    print('⚠️ Insufficient data')
    q{q_num}_results = None
"""
        q_cells.append(new_code_cell(code))
        return q_cells

    # Q1: Academic Struggle
    cells.extend(
        create_q_cells(
            1,
            "Predict Academic Struggle",
            "['math_score', 'english_score', 'composite_score']",
            "struggling",
            "student_summary[['math_score', 'final_cgpa']].notna().all(axis=1)",
        )
    )

    # Q2: AJC Involvement
    cells.extend(
        create_q_cells(
            2,
            "Predict AJC Involvement",
            "['math_score', 'english_score', 'composite_score']",
            "has_ajc_case",
            "student_summary['math_score'].notna()",
        )
    )

    # Q3: Academic Success
    cells.extend(
        create_q_cells(
            3,
            "Predict Academic Success",
            "['math_score', 'english_score', 'composite_score', 'avg_gpa']",
            "successful",
            "student_summary[['math_score', 'avg_gpa', 'final_cgpa']].notna().all(axis=1)",
        )
    )

    # Q4: Major Change
    cells.extend(
        create_q_cells(
            4,
            "Predict Major Change",
            "['math_score', 'english_score', 'composite_score', 'avg_gpa']",
            "major_changed",
            "student_summary[['math_score', 'avg_gpa', 'proposed_major', 'final_major']].notna().all(axis=1)",
        )
    )

    # Q5: Delayed Graduation
    cells.extend(
        create_q_cells(
            5,
            "Predict Delayed Graduation",
            "['math_score', 'english_score', 'composite_score', 'avg_gpa', 'has_ajc_case']",
            "delayed_grad",
            "student_summary[['math_score', 'avg_gpa', 'total_semesters']].notna().all(axis=1)",
        )
    )

    # ========== 6. SUMMARY ==========
    cells.append(new_markdown_cell("## 6. Summary Dashboard"))
    cells.append(
        new_code_cell(
            """# Collect results
results = []
for q in [1, 2, 3, 4, 5]:
    var_name = f'q{q}_results'
    if var_name in locals() and locals()[var_name] is not None:
        results.append({
            'Question': f'Q{q}',
            'Accuracy': locals()[var_name]['accuracy'],
            'AUC': locals()[var_name].get('auc', 0)
        })

if results:
    df_results = pd.DataFrame(results)
    
    fig = px.bar(df_results, x='Question', y='Accuracy',
                 title='Model Performance Summary',
                 text='Accuracy', color='Accuracy',
                 color_continuous_scale='Blues')
    fig.update_traces(texttemplate='%{text:.3f}', textposition='outside')
    fig.update_layout(yaxis_range=[0, 1.1])
    fig.show()
    
    print('\\n✅ Analysis Complete!')
    print(df_results)
else:
    print('No results to display')"""
        )
    )

    # Save notebook
    nb["cells"] = cells
    output_path = "../notebooks/prosit_5_corrected.ipynb"

    with open(output_path, "w") as f:
        nbf.write(nb, f)

    print(f"\\n✅ Notebook created: {output_path}")
    print(f"   Total cells: {len(cells)}")
    print("\\nNext: Open in Jupyter and run all cells")

    return 0


if __name__ == "__main__":
    sys.exit(main())
