"""
Generate a complete Prosit 5 notebook from scratch with all 9 research questions
and rich Plotly visualizations.
"""

import nbformat as nbf
from nbformat.v4 import new_notebook, new_markdown_cell, new_code_cell


def create_prosit_5_notebook():
    """Create the complete Prosit 5 notebook"""
    nb = new_notebook()
    cells = []

    # ========== TITLE ==========
    cells.append(
        new_markdown_cell(
            """# Prosit 5: Bringing It All Together
## Comprehensive Student Journey Analysis

**Objective**: Integrate admissions, academic, and conduct data to answer 9 strategic questions about student success at Ashesi University.

**Data Sources**:
- Transcript data (course-level academic records)
- Admissions data (pre-enrollment test scores)
- AJC data (conduct records)
"""
        )
    )

    # ========== 1. SETUP ==========
    cells.append(new_markdown_cell("## 1. Setup & Imports"))

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
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    classification_report, confusion_matrix, 
    roc_curve, auc, accuracy_score, f1_score
)
from scipy.stats import f_oneway, ttest_ind

import warnings
warnings.filterwarnings('ignore')

print('✅ Libraries loaded successfully!')"""
        )
    )

    # ========== 2. DATA LOADING ==========
    cells.append(new_markdown_cell("## 2. Data Loading"))

    cells.append(new_markdown_cell("### 2.1 Load Transcript Data"))
    cells.append(
        new_code_cell(
            """# Load transcript data with course-level details
df_transcript = pd.read_csv('../data/prosit 1/anon_Transcript_Reports_v2.csv')

print(f'Transcript data shape: {df_transcript.shape}')
print(f'Unique students: {df_transcript[\"StudentRef\"].nunique()}')
print(f'Date range: {df_transcript[\"Academic Year\"].min()} to {df_transcript[\"Academic Year\"].max()}')
print(f'\\nColumns: {list(df_transcript.columns)}')

df_transcript.head()"""
        )
    )

    cells.append(new_markdown_cell("### 2.2 Load Admissions Data"))
    cells.append(
        new_code_cell(
            """import glob

# Find all admissions files
admissions_files = glob.glob('../data/prosit 5/*_C2023-C2028-anon.csv')
print(f'Found {len(admissions_files)} admissions files:')
for f in admissions_files:
    print(f'  - {f.split(\"/\")[-1]}')

# Load each file
admissions_dfs = {}
for file in admissions_files:
    exam_type = file.split('/')[-1].split('_')[0]
    df = pd.read_csv(file)
    admissions_dfs[exam_type] = df
    print(f'{exam_type}: {df.shape[0]} students')"""
        )
    )

    cells.append(new_markdown_cell("### 2.3 Load AJC (Conduct) Data"))
    cells.append(
        new_code_cell(
            """# Load Ashesi Judicial Council records
df_ajc = pd.read_csv('../data/prosit 5/anon_AJC.csv')

print(f'AJC data shape: {df_ajc.shape}')
print(f'Students with AJC cases: {df_ajc[\"StudentRef\"].nunique()}')
print(f'\\nMisconduct types:')
print(df_ajc['Type of Misconduct'].value_counts())

df_ajc.head()"""
        )
    )

    # ========== 3. DATA PROCESSING ==========
    cells.append(
        new_markdown_cell(
            """## 3. Data Processing & Integration

We need to:
1. Standardize admissions grades from different exam systems
2. Process AJC data into student-level features
3. Merge all datasets"""
        )
    )

    cells.append(new_markdown_cell("### 3.1 Grade Standardization Functions"))
    cells.append(
        new_code_cell(
            """# Grade conversion mappings to 0-100 scale
wassce_map = {
    'A1': 100, 'B2': 90, 'B3': 85, 'C4': 80, 'C5': 75, 'C6': 70,
    'D7': 65, 'E8': 60, 'F9': 50
}

ib_map = {
    7: 100, 6: 90, 5: 80, 4: 70, 3: 60, 2: 50, 1: 40
}

olevel_map = {
    'A': 100, 'B': 85, 'C': 70, 'D': 60, 'E': 50, 'F': 40
}

def standardize_wassce_grade(grade):
    if pd.isna(grade):
        return np.nan
    grade_str = str(grade).strip().upper()
    return wassce_map.get(grade_str, np.nan)

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
    grade_str = str(grade).strip().upper()
    return olevel_map.get(grade_str, np.nan)

print('✅ Grade standardization functions defined')"""
        )
    )

    cells.append(new_markdown_cell("### 3.2 Process WASSCE Data"))
    cells.append(
        new_code_cell(
            """if 'WASSCE' in admissions_dfs:
    wassce = admissions_dfs['WASSCE'].copy()
    
    # Standardize math scores
    math_cols = ['Elective Maths', 'Core Maths']
    wassce['math_score'] = wassce[math_cols].apply(
        lambda row: max([standardize_wassce_grade(row[col]) for col in math_cols if col in row.index], 
                       default=np.nan), axis=1
    )
    
    # Standardize English
    wassce['english_score'] = wassce['English Language'].apply(standardize_wassce_grade)
    
    # Standardize Science (take best of Biology, Chemistry, Physics)
    science_cols = ['Biology', 'Chemistry', 'Physics', 'Integrated Science/Science']
    wassce['science_score'] = wassce[science_cols].apply(
        lambda row: max([standardize_wassce_grade(row[col]) for col in science_cols if col in row.index], 
                       default=np.nan), axis=1
    )
    
    wassce['exam_type'] = 'WASSCE'
    print(f'WASSCE processed: {len(wassce)} students')
else:
    wassce = pd.DataFrame()"""
        )
    )

    cells.append(new_markdown_cell("### 3.3 Process IB Data"))
    cells.append(
        new_code_cell(
            """if 'IB' in admissions_dfs:
    ib = admissions_dfs['IB'].copy()
    
    # IB Math
    math_cols = ['Mathematics', 'Math Studies', 'Further Mathematics']
    ib['math_score'] = ib[math_cols].apply(
        lambda row: max([standardize_ib_grade(row[col]) for col in math_cols if col in row.index], 
                       default=np.nan), axis=1
    )
    
    # IB English
    eng_cols = ['English A', 'English B', 'English Language & Literature']
    ib['english_score'] = ib[eng_cols].apply(
        lambda row: max([standardize_ib_grade(row[col]) for col in eng_cols if col in row.index], 
                       default=np.nan), axis=1
    )
    
    # IB Science
    science_cols = ['Biology', 'Chemistry', 'Physics', 'Environmental Systems']
    ib['science_score'] = ib[science_cols].apply(
        lambda row: max([standardize_ib_grade(row[col]) for col in science_cols if col in row.index], 
                       default=np.nan), axis=1
    )
    
    ib['exam_type'] = 'IB'
    print(f'IB processed: {len(ib)} students')
else:
    ib = pd.DataFrame()"""
        )
    )

    cells.append(new_markdown_cell("### 3.4 Process O&A Level Data"))
    cells.append(
        new_code_cell(
            """if 'O&A' in admissions_dfs:
    olevel = admissions_dfs['O&A'].copy()
    
    # O/A Level Math
    math_cols = ['Mathematics', 'Pure Mathematics', 'Further Mathematics']
    olevel['math_score'] = olevel[math_cols].apply(
        lambda row: max([standardize_olevel_grade(row[col]) for col in math_cols if col in row.index], 
                       default=np.nan), axis=1
    )
    
    # O/A Level English
    olevel['english_score'] = olevel['English Language'].apply(standardize_olevel_grade)
    
    # O/A Level Science
    science_cols = ['Biology', 'Chemistry', 'Physics']
    olevel['science_score'] = olevel[science_cols].apply(
        lambda row: max([standardize_olevel_grade(row[col]) for col in science_cols if col in row.index], 
                       default=np.nan), axis=1
    )
    
    olevel['exam_type'] = 'O&A Level'
    print(f'O&A Level processed: {len(olevel)} students')
else:
    olevel = pd.DataFrame()"""
        )
    )

    cells.append(new_markdown_cell("### 3.5 Combine All Admissions Data"))
    cells.append(
        new_code_cell(
            """# Common columns to keep
common_cols = ['StudentRef', 'Yeargroup', 'Proposed Major', 'High School', 
               'Exam Type', 'math_score', 'english_score', 'science_score', 'exam_type']

# Combine all admissions data
df_admissions_list = []
for df in [wassce, ib, olevel]:
    if len(df) > 0:
        # Only keep columns that exist
        cols_to_keep = [col for col in common_cols if col in df.columns]
        df_admissions_list.append(df[cols_to_keep])

df_admissions = pd.concat(df_admissions_list, ignore_index=True)

# Calculate composite score
df_admissions['composite_score'] = df_admissions[['math_score', 'english_score', 'science_score']].mean(axis=1)

print(f'Combined admissions data: {df_admissions.shape}')
print(f'Students with admissions data: {df_admissions[\"StudentRef\"].nunique()}')
print(f'\\nExam type distribution:')
print(df_admissions['exam_type'].value_counts())

df_admissions.head()"""
        )
    )

    cells.append(new_markdown_cell("### 3.6 Process AJC Data"))
    cells.append(
        new_code_cell(
            """# Create AJC features at student level
df_ajc_features = df_ajc.groupby('StudentRef').agg({
    'Verdict': 'count',  # Total cases
    'Type of Misconduct': lambda x: (x.str.contains('Academic', na=False)).sum()  # Academic cases
}).reset_index()

df_ajc_features.columns = ['StudentRef', 'ajc_case_count', 'ajc_academic_count']
df_ajc_features['ajc_social_count'] = df_ajc_features['ajc_case_count'] - df_ajc_features['ajc_academic_count']
df_ajc_features['has_ajc_case'] = 1

print(f'Students with AJC cases: {len(df_ajc_features)}')
df_ajc_features.head()"""
        )
    )

    cells.append(new_markdown_cell("### 3.7 Merge All Data"))
    cells.append(
        new_code_cell(
            """# Merge transcript with admissions
df_master = df_transcript.merge(
    df_admissions,
    on='StudentRef',
    how='left',
    suffixes=('', '_admissions')
)

# Merge with AJC features
df_master = df_master.merge(
    df_ajc_features,
    on='StudentRef',
    how='left'
)

# Fill missing AJC values with 0
ajc_cols = ['ajc_case_count', 'ajc_academic_count', 'ajc_social_count', 'has_ajc_case']
df_master[ajc_cols] = df_master[ajc_cols].fillna(0)

print(f'Master dataset: {df_master.shape}')
print(f'Unique students: {df_master[\"StudentRef\"].nunique()}')
print(f'Students with admissions data: {df_master[\"math_score\"].notna().sum()}')
print(f'Unique students with admissions data: {df_master[df_master[\"math_score\"].notna()][\"StudentRef\"].nunique()}')"""
        )
    )

    # Continue in next file due to length...
    nb["cells"] = cells
    return nb


if __name__ == "__main__":
    print("Creating Prosit 5 notebook (Part 1/3)...")
    nb = create_prosit_5_notebook()

    with open("../notebooks/prosit_5_new.ipynb", "w") as f:
        nbf.write(nb, f)

    print("✅ Part 1 complete! Notebook structure created.")
    print("   Next: Run part 2 to add feature engineering and models")
