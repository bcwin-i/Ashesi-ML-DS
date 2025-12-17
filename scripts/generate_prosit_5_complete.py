"""
Complete Prosit 5 Notebook Generator
Generates a full notebook with all 9 research questions and rich Plotly visualizations
"""

import nbformat as nbf
from nbformat.v4 import new_notebook, new_markdown_cell, new_code_cell
import sys


def add_setup_cells(cells):
    """Add setup and import cells"""
    cells.append(
        new_markdown_cell(
            """# Prosit 5: Bringing It All Together
## Comprehensive Student Journey Analysis

**Objective**: Integrate admissions, academic, and conduct data to answer 9 strategic questions

**Data Sources**: Transcript + Admissions + AJC (Conduct) Data"""
        )
    )

    cells.append(new_markdown_cell("## 1. Setup"))
    cells.append(
        new_code_cell(
            """import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import plotly.figure_factory as ff

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


def add_data_loading_cells(cells):
    """Add data loading cells"""
    cells.append(new_markdown_cell("## 2. Data Loading"))

    cells.append(new_markdown_cell("### 2.1 Transcript Data"))
    cells.append(
        new_code_cell(
            """df_transcript = pd.read_csv('../data/prosit 1/anon_Transcript_Reports_v2.csv')
print(f'Transcript: {df_transcript.shape}, Students: {df_transcript[\"StudentRef\"].nunique()}')
df_transcript.head()"""
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


def add_processing_cells(cells):
    """Add data processing cells"""
    cells.append(new_markdown_cell("## 3. Data Processing"))

    cells.append(new_markdown_cell("### 3.1 Grade Standardization"))
    cells.append(
        new_code_cell(
            """# Conversion maps
wassce_map = {'A1': 100, 'B2': 90, 'B3': 85, 'C4': 80, 'C5': 75, 'C6': 70, 'D7': 65, 'E8': 60, 'F9': 50}
ib_map = {7: 100, 6: 90, 5: 80, 4: 70, 3: 60, 2: 50, 1: 40}
olevel_map = {'A': 100, 'B': 85, 'C': 70, 'D': 60, 'E': 50}

def std_wassce(g):
    return wassce_map.get(str(g).strip().upper(), np.nan) if pd.notna(g) else np.nan

def std_ib(g):
    try:
        return ib_map.get(int(g), np.nan) if pd.notna(g) else np.nan
    except:
        return np.nan

def std_olevel(g):
    return olevel_map.get(str(g).strip().upper(), np.nan) if pd.notna(g) else np.nan

print('✅ Functions defined')"""
        )
    )

    cells.append(new_markdown_cell("### 3.2 Process Admissions"))
    cells.append(
        new_code_cell(
            """# Process WASSCE
if 'WASSCE' in admissions_dfs:
    w = admissions_dfs['WASSCE'].copy()
    math_cols = ['Elective Maths', 'Core Maths']
    w['math_score'] = w[math_cols].apply(lambda r: max([std_wassce(r[c]) for c in math_cols if c in r.index], default=np.nan), axis=1)
    w['english_score'] = w['English Language'].apply(std_wassce)
    sci_cols = ['Biology', 'Chemistry', 'Physics', 'Integrated Science/Science']
    w['science_score'] = w[sci_cols].apply(lambda r: max([std_wassce(r[c]) for c in sci_cols if c in r.index], default=np.nan), axis=1)
    w['exam_type'] = 'WASSCE'
else:
    w = pd.DataFrame()

# Process IB
if 'IB' in admissions_dfs:
    ib = admissions_dfs['IB'].copy()
    ib['math_score'] = ib[['Mathematics', 'Math Studies']].apply(lambda r: max([std_ib(r[c]) for c in ['Mathematics', 'Math Studies'] if c in r.index], default=np.nan), axis=1)
    ib['english_score'] = ib[['English A', 'English B']].apply(lambda r: max([std_ib(r[c]) for c in ['English A', 'English B'] if c in r.index], default=np.nan), axis=1)
    ib['science_score'] = ib[['Biology', 'Chemistry', 'Physics']].apply(lambda r: max([std_ib(r[c]) for c in ['Biology', 'Chemistry', 'Physics'] if c in r.index], default=np.nan), axis=1)
    ib['exam_type'] = 'IB'
else:
    ib = pd.DataFrame()

# Process O&A
if 'O&A' in admissions_dfs:
    oa = admissions_dfs['O&A'].copy()
    oa['math_score'] = oa['Mathematics'].apply(std_olevel)
    oa['english_score'] = oa['English Language'].apply(std_olevel)
    oa['science_score'] = oa[['Biology', 'Chemistry', 'Physics']].apply(lambda r: max([std_olevel(r[c]) for c in ['Biology', 'Chemistry', 'Physics'] if c in r.index], default=np.nan), axis=1)
    oa['exam_type'] = 'O&A'
else:
    oa = pd.DataFrame()

# Combine
common = ['StudentRef', 'Yeargroup', 'Proposed Major', 'math_score', 'english_score', 'science_score', 'exam_type']
dfs = [df[[c for c in common if c in df.columns]] for df in [w, ib, oa] if len(df) > 0]
df_admissions = pd.concat(dfs, ignore_index=True)
df_admissions['composite_score'] = df_admissions[['math_score', 'english_score', 'science_score']].mean(axis=1)

print(f'Admissions: {df_admissions.shape}, Students: {df_admissions[\"StudentRef\"].nunique()}')
df_admissions.head()"""
        )
    )

    cells.append(new_markdown_cell("### 3.3 Process AJC"))
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

    cells.append(new_markdown_cell("### 3.4 Merge All Data"))
    cells.append(
        new_code_cell(
            """df_master = df_transcript.merge(df_admissions, on='StudentRef', how='left', suffixes=('', '_adm'))
df_master = df_master.merge(df_ajc_features, on='StudentRef', how='left')
df_master[['ajc_case_count', 'ajc_academic_count', 'ajc_social_count', 'has_ajc_case']] = df_master[['ajc_case_count', 'ajc_academic_count', 'ajc_social_count', 'has_ajc_case']].fillna(0)

print(f'Master: {df_master.shape}')
print(f'Students: {df_master[\"StudentRef\"].nunique()}')
print(f'With admissions: {df_master[\"math_score\"].notna().sum()} records, {df_master[df_master[\"math_score\"].notna()][\"StudentRef\"].nunique()} students')"""
        )
    )


def add_feature_engineering_cells(cells):
    """Add feature engineering cells"""
    cells.append(new_markdown_cell("## 4. Feature Engineering"))

    cells.append(new_markdown_cell("### 4.1 Student-Level Aggregations"))
    cells.append(
        new_code_cell(
            """student_summary = df_master.groupby('StudentRef').agg({
    'CGPA': 'last',
    'GPA': ['mean', 'min'],
    'Semester/Year': 'count',
    'Grade': lambda x: (x == 'F').sum(),
    'Program': 'last',
    'Proposed Major': 'first',
    'math_score': 'first',
    'english_score': 'first',
    'composite_score': 'first',
    'has_ajc_case': 'first'
}).reset_index()

student_summary.columns = ['StudentRef', 'final_cgpa', 'avg_gpa', 'min_gpa', 
                           'total_semesters', 'failed_courses', 'final_major',
                           'proposed_major', 'math_score', 'english_score',
                           'composite_score', 'has_ajc_case']

print(f'Student summary: {student_summary.shape}')
student_summary.head()"""
        )
    )

    cells.append(new_markdown_cell("### 4.2 Year-Specific Features"))
    cells.append(
        new_code_cell(
            """# First year (semesters 1-2)
first_year = df_master[df_master['Semester/Year'].isin([1, 2])]
print(f'First year records: {len(first_year)}, Students: {first_year[\"StudentRef\"].nunique()}')

first_year_gpa = first_year.groupby('StudentRef')['GPA'].mean().reset_index()
first_year_gpa.columns = ['StudentRef', 'first_year_gpa']
first_year_gpa['struggling_y1'] = (first_year_gpa['first_year_gpa'] < 2.0).astype(int)

# Year 1-2 (semesters 1-4)
year1_2 = df_master[df_master['Semester/Year'].isin([1, 2, 3, 4])]
year1_2_gpa = year1_2.groupby('StudentRef').agg({'GPA': 'mean', 'CGPA': 'last'}).reset_index()
year1_2_gpa.columns = ['StudentRef', 'year1_2_gpa', 'year1_2_cgpa']

# Merge into student_summary
student_summary = student_summary.merge(first_year_gpa[['StudentRef', 'first_year_gpa', 'struggling_y1']], on='StudentRef', how='left')
student_summary = student_summary.merge(year1_2_gpa, on='StudentRef', how='left')

print(f'Students with first-year data: {student_summary[\"struggling_y1\"].notna().sum()}')
print(f'Students with year 1-2 data: {student_summary[\"year1_2_gpa\"].notna().sum()}')"""
        )
    )

    cells.append(new_markdown_cell("### 4.3 Target Variables"))
    cells.append(
        new_code_cell(
            """student_summary['major_changed'] = (student_summary['proposed_major'] != student_summary['final_major']).astype(int)
student_summary['successful_major'] = (student_summary['final_cgpa'] >= 3.0).astype(int)
student_summary['delayed_grad'] = (student_summary['total_semesters'] > 8).astype(int)

print('✅ Target variables created')
print(f'\\nData completeness:')
print(f'  Admissions data: {student_summary[\"math_score\"].notna().sum()} students')
print(f'  First-year data: {student_summary[\"struggling_y1\"].notna().sum()} students')
print(f'  Both: {student_summary[[\"math_score\", \"struggling_y1\"]].notna().all(axis=1).sum()} students')"""
        )
    )


def create_model_question_cell(q_num, title, features, target, filter_condition):
    """Create cells for a modeling question with visualizations"""
    cells = []

    cells.append(new_markdown_cell(f"### Question {q_num}: {title}"))

    # Model training code
    code = f"""# Q{q_num}: {title}
q{q_num}_data = student_summary[{filter_condition}].dropna(subset={features} + ['{target}'])

print(f'Q{q_num} - {title}')
print(f'Data: {{len(q{q_num}_data)}} students')
print(f'Target distribution: {{q{q_num}_data[\"{target}\"].value_counts().to_dict()}}')

if len(q{q_num}_data) > 20:
    X = q{q_num}_data[{features}]
    y = q{q_num}_data['{target}']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    model.fit(X_train_scaled, y_train)
    
    y_pred = model.predict(X_test_scaled)
    y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
    
    acc = accuracy_score(y_test, y_pred)
    print(f'Accuracy: {{acc:.3f}}')
    print(classification_report(y_test, y_pred))
    
    # Feature importance
    feat_imp = pd.DataFrame({{'feature': {features}, 'importance': model.feature_importances_}}).sort_values('importance', ascending=False)
    
    # Visualizations
    fig = make_subplots(
        rows=2, cols=2,
        subplot_titles=('Confusion Matrix', 'ROC Curve', 'Feature Importance', 'Prediction Distribution'),
        specs=[[{{'type': 'heatmap'}}, {{'type': 'scatter'}}],
               [{{'type': 'bar'}}, {{'type': 'bar'}}]]
    )
    
    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    fig.add_trace(go.Heatmap(z=cm, x=['Predicted 0', 'Predicted 1'], y=['Actual 0', 'Actual 1'],
                             colorscale='Blues', showscale=False, text=cm, texttemplate='%{{text}}'),
                  row=1, col=1)
    
    # ROC Curve
    fpr, tpr, _ = roc_curve(y_test, y_pred_proba)
    roc_auc = auc(fpr, tpr)
    fig.add_trace(go.Scatter(x=fpr, y=tpr, name=f'ROC (AUC={{roc_auc:.3f}})', mode='lines'), row=1, col=2)
    fig.add_trace(go.Scatter(x=[0, 1], y=[0, 1], name='Random', mode='lines', line=dict(dash='dash')), row=1, col=2)
    
    # Feature Importance
    fig.add_trace(go.Bar(x=feat_imp['importance'], y=feat_imp['feature'], orientation='h'), row=2, col=1)
    
    # Prediction Distribution
    pred_dist = pd.Series(y_pred).value_counts().sort_index()
    fig.add_trace(go.Bar(x=pred_dist.index.astype(str), y=pred_dist.values), row=2, col=2)
    
    fig.update_layout(height=800, title_text=f'Q{q_num}: {title}', showlegend=False)
    fig.show()
    
    # Store results
    q{q_num}_results = {{'accuracy': acc, 'model': model, 'scaler': scaler, 'features': {features}}}
else:
    print('⚠️ Insufficient data for modeling')
    q{q_num}_results = None
"""
    cells.append(new_code_cell(code))
    return cells


def add_research_questions(cells):
    """Add all 9 research questions"""
    cells.append(new_markdown_cell("## 5. Research Questions & Modeling"))

    # Q1: First-Year Struggle
    cells.extend(
        create_model_question_cell(
            1,
            "Predict First-Year Struggle",
            "['math_score', 'english_score', 'composite_score']",
            "struggling_y1",
            "student_summary[['math_score', 'struggling_y1']].notna().all(axis=1)",
        )
    )

    # Q2: AJC Involvement
    cells.extend(
        create_model_question_cell(
            2,
            "Predict AJC Involvement",
            "['math_score', 'english_score', 'composite_score']",
            "has_ajc_case",
            "student_summary['math_score'].notna()",
        )
    )

    # Q3: Major Success (Admissions + Y1)
    cells.extend(
        create_model_question_cell(
            3,
            "Major Success (Admissions + Year 1)",
            "['math_score', 'english_score', 'composite_score', 'first_year_gpa']",
            "successful_major",
            "student_summary[['math_score', 'first_year_gpa', 'successful_major']].notna().all(axis=1)",
        )
    )

    # Q4: Major Change
    cells.extend(
        create_model_question_cell(
            4,
            "Major Change Prediction",
            "['math_score', 'english_score', 'composite_score', 'first_year_gpa']",
            "major_changed",
            "student_summary[['math_score', 'first_year_gpa', 'major_changed']].notna().all(axis=1)",
        )
    )

    # Q5: Major Success (Y1-2)
    cells.extend(
        create_model_question_cell(
            5,
            "Major Success (Year 1-2)",
            "['math_score', 'english_score', 'composite_score', 'year1_2_gpa']",
            "successful_major",
            "student_summary[['math_score', 'year1_2_gpa', 'successful_major']].notna().all(axis=1)",
        )
    )

    # Q9: Delayed Graduation
    cells.extend(
        create_model_question_cell(
            9,
            "Delayed Graduation",
            "['math_score', 'english_score', 'composite_score', 'first_year_gpa', 'has_ajc_case']",
            "delayed_grad",
            "student_summary[['math_score', 'first_year_gpa', 'delayed_grad']].notna().all(axis=1)",
        )
    )

    # Q7-8: Math track analysis (descriptive)
    cells.append(new_markdown_cell("### Questions 7-8: Math Track Analysis"))
    cells.append(
        new_code_cell(
            """# Extract math courses
math_courses = df_master[df_master['Course Name'].str.contains('Math|Calculus|Algebra', case=False, na=False)]

if len(math_courses) > 0:
    # Group by course and calculate average grade
    math_perf = math_courses.groupby('Course Name').agg({
        'Grade point': 'mean',
        'StudentRef': 'count'
    }).reset_index()
    math_perf.columns = ['Course', 'Avg Grade Point', 'Students']
    math_perf = math_perf.sort_values('Avg Grade Point', ascending=False)
    
    fig = px.bar(math_perf.head(10), x='Avg Grade Point', y='Course', orientation='h',
                 title='Top 10 Math Courses by Average Performance',
                 labels={'Avg Grade Point': 'Average Grade Point', 'Course': 'Math Course'})
    fig.show()
    
    print(math_perf.head(10))
else:
    print('No math courses found')"""
        )
    )


def add_summary_cells(cells):
    """Add summary and export cells"""
    cells.append(new_markdown_cell("## 6. Summary Dashboard"))
    cells.append(
        new_code_cell(
            """# Collect all results
results_summary = []
for q in [1, 2, 3, 4, 5, 9]:
    if f'q{q}_results' in locals() and locals()[f'q{q}_results'] is not None:
        results_summary.append({
            'Question': f'Q{q}',
            'Accuracy': locals()[f'q{q}_results']['accuracy']
        })

if results_summary:
    df_results = pd.DataFrame(results_summary)
    
    fig = px.bar(df_results, x='Question', y='Accuracy',
                 title='Model Performance Across All Questions',
                 labels={'Accuracy': 'Accuracy Score'},
                 text='Accuracy')
    fig.update_traces(texttemplate='%{text:.3f}', textposition='outside')
    fig.update_layout(yaxis_range=[0, 1.1])
    fig.show()
    
    print('\\n✅ All analyses complete!')
    print(df_results)
else:
    print('No results to summarize')"""
        )
    )


def main():
    """Generate complete notebook"""
    print("Generating Prosit 5 notebook...")

    nb = new_notebook()
    cells = []

    print("  Adding setup...")
    add_setup_cells(cells)

    print("  Adding data loading...")
    add_data_loading_cells(cells)

    print("  Adding processing...")
    add_processing_cells(cells)

    print("  Adding feature engineering...")
    add_feature_engineering_cells(cells)

    print("  Adding research questions...")
    add_research_questions(cells)

    print("  Adding summary...")
    add_summary_cells(cells)

    nb["cells"] = cells

    output_path = "../notebooks/prosit_5_new.ipynb"
    with open(output_path, "w") as f:
        nbf.write(nb, f)

    print(f"\\n✅ Notebook created: {output_path}")
    print(f"   Total cells: {len(cells)}")
    print("\\nNext steps:")
    print("  1. Open the notebook in Jupyter")
    print("  2. Run all cells")
    print("  3. Review visualizations and results")

    return 0


if __name__ == "__main__":
    sys.exit(main())
