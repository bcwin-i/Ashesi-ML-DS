# Prosit 1 Study Guide: Charting the Path to Student Success

## Problem Overview

**Context**: Ashesi University wants to understand what factors influence student success as their student body becomes more diverse. They need to identify patterns in admissions and registry data that could help predict which students will thrive and which might struggle.

**Key Request**: "Please don't jump straight into building models. First, help us see and understand the data clearly."

---

## Learning Objectives

### 1. **Exploratory Data Analysis (EDA) Fundamentals**

- Understand EDA's role in the ML pipeline
- Learn to explore data before modeling
- Identify patterns, anomalies, and relationships

### 2. **Data Types & Statistical Summaries**

- Distinguish between data types (categorical, numerical, ordinal)
- Choose appropriate summary statistics for each type
- Compute variance, standard deviation, IQR

### 3. **Data Visualization**

- Create and interpret box plots, histograms, heatmaps
- Use visualizations to communicate insights
- Critique graphical summaries for effectiveness

### 4. **Probability & Distributions**

- Understand common distributions (Normal, Binomial, Poisson, Exponential)
- Apply Central Limit Theorem (CLT)
- Explain sampling distributions

### 5. **Data Preprocessing**

- Detect and handle missing values
- Identify and treat outliers
- Perform type casting and encoding
- Apply scaling and normalization

### 6. **Ethics in Data Science**

- Recognize privacy and confidentiality concerns
- Address fairness and potential bias
- Ensure analyses don't reinforce stereotypes

---

## Solution Process

### Phase 1: Initial Data Understanding

#### 1.1 Load and Inspect Data

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Load the dataset
df = pd.read_csv('ashesi_student_data.csv')

# Basic inspection
print(df.head())
print(df.info())
print(df.describe())
print(df.shape)
```

**Key Questions to Answer:**

- How many records and features?
- What are the data types?
- Are there any obvious issues?

#### 1.2 Understand the Variables

Create a data dictionary documenting:

- **Admissions Data**: High school, region, entrance scores, demographics
- **Registry Data**: GPA, retention status, progression, graduation outcomes
- **Target Variables**: What defines "success"? (GPA, retention, graduation)

---

### Phase 2: Data Quality Assessment

#### 2.1 Missing Values Analysis

```python
# Check missing values
missing_summary = pd.DataFrame({
    'Column': df.columns,
    'Missing_Count': df.isnull().sum(),
    'Missing_Percentage': (df.isnull().sum() / len(df)) * 100
})
missing_summary = missing_summary[missing_summary['Missing_Count'] > 0]
print(missing_summary.sort_values('Missing_Percentage', ascending=False))

# Visualize missing data
import missingno as msno
msno.matrix(df)
plt.show()
```

**Handling Strategies:**

- **< 5% missing**: Consider dropping rows
- **5-20% missing**: Imputation (mean/median/mode)
- **> 20% missing**: Investigate why, consider dropping column or advanced imputation

#### 2.2 Duplicate Detection

```python
# Check for duplicates
duplicates = df.duplicated().sum()
print(f"Number of duplicate rows: {duplicates}")

# Examine duplicates
if duplicates > 0:
    print(df[df.duplicated(keep=False)])
```

#### 2.3 Data Type Validation

```python
# Ensure correct data types
df['admission_year'] = pd.to_datetime(df['admission_year'])
df['student_id'] = df['student_id'].astype(str)
df['gpa'] = pd.to_numeric(df['gpa'], errors='coerce')
```

---

### Phase 3: Univariate Analysis

#### 3.1 Categorical Variables

```python
categorical_cols = df.select_dtypes(include=['object']).columns

for col in categorical_cols:
    print(f"\n{col} Distribution:")
    print(df[col].value_counts())
    print(f"Unique values: {df[col].nunique()}")

    # Visualization
    plt.figure(figsize=(10, 6))
    df[col].value_counts().plot(kind='bar')
    plt.title(f'Distribution of {col}')
    plt.xlabel(col)
    plt.ylabel('Count')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()
```

**Key Variables to Analyze:**

- High school type/region
- Gender
- Major
- Retention status

#### 3.2 Numerical Variables

```python
numerical_cols = df.select_dtypes(include=['int64', 'float64']).columns

for col in numerical_cols:
    print(f"\n{col} Statistics:")
    print(df[col].describe())

    # Calculate additional statistics
    print(f"Variance: {df[col].var():.2f}")
    print(f"Std Dev: {df[col].std():.2f}")
    print(f"IQR: {df[col].quantile(0.75) - df[col].quantile(0.25):.2f}")
    print(f"Skewness: {df[col].skew():.2f}")
    print(f"Kurtosis: {df[col].kurtosis():.2f}")

    # Visualizations
    fig, axes = plt.subplots(1, 3, figsize=(15, 4))

    # Histogram
    axes[0].hist(df[col].dropna(), bins=30, edgecolor='black')
    axes[0].set_title(f'{col} - Histogram')
    axes[0].set_xlabel(col)
    axes[0].set_ylabel('Frequency')

    # Box plot
    axes[1].boxplot(df[col].dropna())
    axes[1].set_title(f'{col} - Box Plot')
    axes[1].set_ylabel(col)

    # Q-Q plot (to check normality)
    from scipy import stats
    stats.probplot(df[col].dropna(), dist="norm", plot=axes[2])
    axes[2].set_title(f'{col} - Q-Q Plot')

    plt.tight_layout()
    plt.show()
```

**Key Variables to Analyze:**

- Entrance exam scores
- GPA (overall and by semester)
- Age at admission

---

### Phase 4: Outlier Detection

#### 4.1 Statistical Methods

```python
def detect_outliers_iqr(df, column):
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR

    outliers = df[(df[column] < lower_bound) | (df[column] > upper_bound)]
    print(f"{column}: {len(outliers)} outliers detected")
    return outliers

# Apply to numerical columns
for col in numerical_cols:
    outliers = detect_outliers_iqr(df, col)
```

#### 4.2 Z-Score Method

```python
from scipy import stats

def detect_outliers_zscore(df, column, threshold=3):
    z_scores = np.abs(stats.zscore(df[column].dropna()))
    outliers = df[np.abs(stats.zscore(df[column])) > threshold]
    print(f"{column}: {len(outliers)} outliers (Z-score > {threshold})")
    return outliers
```

**Handling Outliers:**

- Investigate if they're data errors or legitimate extreme values
- Consider capping, transformation, or removal based on context

---

### Phase 5: Bivariate & Multivariate Analysis

#### 5.1 Correlation Analysis

```python
# Correlation matrix
correlation_matrix = df[numerical_cols].corr()

# Heatmap
plt.figure(figsize=(12, 10))
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0,
            square=True, linewidths=1, cbar_kws={"shrink": 0.8})
plt.title('Correlation Heatmap')
plt.tight_layout()
plt.show()

# Identify strong correlations
threshold = 0.7
strong_corr = []
for i in range(len(correlation_matrix.columns)):
    for j in range(i+1, len(correlation_matrix.columns)):
        if abs(correlation_matrix.iloc[i, j]) > threshold:
            strong_corr.append((correlation_matrix.columns[i],
                              correlation_matrix.columns[j],
                              correlation_matrix.iloc[i, j]))

print("\nStrong Correlations (|r| > 0.7):")
for var1, var2, corr in strong_corr:
    print(f"{var1} <-> {var2}: {corr:.3f}")
```

#### 5.2 Categorical vs Numerical

```python
# Example: GPA by High School Region
plt.figure(figsize=(12, 6))
sns.boxplot(data=df, x='high_school_region', y='gpa')
plt.title('GPA Distribution by High School Region')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# Statistical test (ANOVA)
from scipy.stats import f_oneway
groups = [group['gpa'].dropna() for name, group in df.groupby('high_school_region')]
f_stat, p_value = f_oneway(*groups)
print(f"ANOVA: F-statistic = {f_stat:.3f}, p-value = {p_value:.4f}")
```

#### 5.3 Categorical vs Categorical

```python
# Contingency table
contingency_table = pd.crosstab(df['high_school_type'], df['retention_status'])
print(contingency_table)

# Chi-square test
from scipy.stats import chi2_contingency
chi2, p_value, dof, expected = chi2_contingency(contingency_table)
print(f"Chi-square: {chi2:.3f}, p-value: {p_value:.4f}")

# Visualization
contingency_table.plot(kind='bar', stacked=True, figsize=(10, 6))
plt.title('Retention Status by High School Type')
plt.xlabel('High School Type')
plt.ylabel('Count')
plt.legend(title='Retention Status')
plt.tight_layout()
plt.show()
```

#### 5.4 Pair Plots

```python
# Select key variables for pair plot
key_vars = ['entrance_score', 'gpa', 'age_at_admission', 'retention_status']
sns.pairplot(df[key_vars], hue='retention_status', diag_kind='kde')
plt.suptitle('Pair Plot of Key Variables', y=1.02)
plt.show()
```

---

### Phase 6: Distribution Analysis

#### 6.1 Test for Normality

```python
from scipy.stats import shapiro, normaltest

for col in numerical_cols:
    stat, p_value = shapiro(df[col].dropna().sample(min(5000, len(df[col].dropna()))))
    print(f"{col}: Shapiro-Wilk p-value = {p_value:.4f}")
    if p_value > 0.05:
        print(f"  → Likely normal distribution")
    else:
        print(f"  → Not normally distributed")
```

#### 6.2 Identify Distribution Types

```python
# Example: Check if count data follows Poisson
# Example: Check if binary outcomes follow Binomial
# Example: Check if time-to-event follows Exponential

# Fit distributions and compare
from scipy.stats import norm, poisson, expon
import scipy.stats as stats

# Example for GPA (continuous)
data = df['gpa'].dropna()
mu, std = norm.fit(data)

plt.figure(figsize=(10, 6))
plt.hist(data, bins=30, density=True, alpha=0.6, color='g', label='Data')

xmin, xmax = plt.xlim()
x = np.linspace(xmin, xmax, 100)
p = norm.pdf(x, mu, std)
plt.plot(x, p, 'k', linewidth=2, label=f'Normal fit: μ={mu:.2f}, σ={std:.2f}')

plt.title('GPA Distribution with Normal Fit')
plt.xlabel('GPA')
plt.ylabel('Density')
plt.legend()
plt.show()
```

---

### Phase 7: Data Preprocessing

#### 7.1 Handle Missing Values

```python
# Strategy 1: Drop rows with missing target variable
df = df.dropna(subset=['gpa'])

# Strategy 2: Impute numerical variables
from sklearn.impute import SimpleImputer

num_imputer = SimpleImputer(strategy='median')
df[numerical_cols] = num_imputer.fit_transform(df[numerical_cols])

# Strategy 3: Impute categorical variables
cat_imputer = SimpleImputer(strategy='most_frequent')
df[categorical_cols] = cat_imputer.fit_transform(df[categorical_cols])
```

#### 7.2 Encode Categorical Variables

```python
# One-Hot Encoding for nominal variables
df_encoded = pd.get_dummies(df, columns=['high_school_region', 'major'],
                             drop_first=True)

# Label Encoding for ordinal variables
from sklearn.preprocessing import LabelEncoder

le = LabelEncoder()
df['high_school_type_encoded'] = le.fit_transform(df['high_school_type'])
```

#### 7.3 Feature Scaling

```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler

# Standardization (Z-score normalization)
scaler = StandardScaler()
df[['entrance_score_scaled', 'age_scaled']] = scaler.fit_transform(
    df[['entrance_score', 'age_at_admission']]
)

# Min-Max Normalization
minmax_scaler = MinMaxScaler()
df[['gpa_normalized']] = minmax_scaler.fit_transform(df[['gpa']])
```

#### 7.4 Handle Outliers

```python
# Option 1: Remove outliers
df_no_outliers = df[np.abs(stats.zscore(df['gpa'])) < 3]

# Option 2: Cap outliers
def cap_outliers(df, column):
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR

    df[column] = df[column].clip(lower=lower_bound, upper=upper_bound)
    return df

# Option 3: Transform (log, square root)
df['entrance_score_log'] = np.log1p(df['entrance_score'])
```

---

### Phase 8: Key Insights & Patterns

#### 8.1 Identify Success Factors

Document patterns such as:

- **High School Background**: Do students from certain regions/types perform better?
- **Entrance Scores**: What's the correlation with GPA?
- **Demographics**: Are there disparities by gender, age, etc.?
- **Retention Patterns**: What distinguishes students who stay vs. leave?

#### 8.2 Statistical Significance

```python
# Example: Compare GPA between two groups
from scipy.stats import ttest_ind

group1 = df[df['high_school_type'] == 'Public']['gpa']
group2 = df[df['high_school_type'] == 'Private']['gpa']

t_stat, p_value = ttest_ind(group1, group2)
print(f"T-test: t={t_stat:.3f}, p={p_value:.4f}")

if p_value < 0.05:
    print("Significant difference in GPA between public and private school students")
```

---

### Phase 9: Ethical Considerations

#### 9.1 Privacy & Confidentiality

- **Anonymization**: Ensure student IDs are de-identified
- **Aggregation**: Report findings at group level, not individual
- **Secure Storage**: Protect sensitive data

#### 9.2 Fairness & Bias

```python
# Check for representation bias
print("Sample Distribution:")
print(df['gender'].value_counts(normalize=True))
print(df['high_school_region'].value_counts(normalize=True))

# Compare outcomes across groups
fairness_check = df.groupby('gender')['gpa'].agg(['mean', 'std', 'count'])
print("\nGPA by Gender:")
print(fairness_check)
```

**Key Questions:**

- Are all groups adequately represented?
- Could findings reinforce stereotypes?
- Are there historical biases in the data?

#### 9.3 Mitigation Strategies

- Use stratified sampling to ensure representation
- Report confidence intervals to show uncertainty
- Avoid causal language when showing correlations
- Consult with stakeholders about sensitive findings

---

## Deliverables

### 1. **Jupyter Notebook Script**

Structure your notebook as follows:

```
1. Introduction & Problem Statement
2. Data Loading & Initial Inspection
3. Data Quality Assessment
   - Missing values
   - Duplicates
   - Data types
4. Univariate Analysis
   - Categorical variables
   - Numerical variables
5. Outlier Detection & Treatment
6. Bivariate & Multivariate Analysis
   - Correlations
   - Group comparisons
7. Distribution Analysis
8. Data Preprocessing
   - Missing value imputation
   - Encoding
   - Scaling
9. Key Insights & Patterns
10. Ethical Considerations
11. Recommendations
```

### 2. **In-Class Presentation**

**Slide Structure:**

1. **Problem Context** (1 slide)
   - Ashesi's question about student success
2. **Data Overview** (1 slide)
   - Dataset size, variables, time period
3. **Data Quality** (1-2 slides)
   - Missing values, outliers, quality issues
4. **Key Findings** (3-4 slides)
   - Most important patterns discovered
   - Visualizations that tell the story
5. **Statistical Insights** (2 slides)
   - Significant correlations
   - Group differences
6. **Ethical Considerations** (1 slide)
   - Privacy measures taken
   - Bias awareness
7. **Recommendations** (1 slide)
   - Next steps for Ashesi
   - Suggested interventions

**Presentation Tips:**

- Focus on storytelling, not just statistics
- Use clear, compelling visualizations
- Explain technical concepts in accessible language
- Highlight actionable insights
- Be prepared to discuss limitations

---

## Key Concepts Reference

### Statistical Measures

| Measure      | Formula                   | Interpretation                              |
| ------------ | ------------------------- | ------------------------------------------- |
| **Mean**     | μ = Σx / n                | Average value                               |
| **Variance** | σ² = Σ(x - μ)² / n        | Spread of data                              |
| **Std Dev**  | σ = √variance             | Average distance from mean                  |
| **IQR**      | Q3 - Q1                   | Range of middle 50%                         |
| **Skewness** | Measure of asymmetry      | Positive = right tail, Negative = left tail |
| **Kurtosis** | Measure of tail heaviness | High = heavy tails, Low = light tails       |

### Probability Distributions

| Distribution    | Use Case                      | Parameters                  | Example                     |
| --------------- | ----------------------------- | --------------------------- | --------------------------- |
| **Normal**      | Continuous, symmetric data    | μ (mean), σ (std dev)       | GPA, test scores            |
| **Binomial**    | Binary outcomes, fixed trials | n (trials), p (probability) | Pass/fail rates             |
| **Poisson**     | Count of events in interval   | λ (rate)                    | Number of dropouts per year |
| **Exponential** | Time between events           | λ (rate)                    | Time to graduation          |

### Central Limit Theorem (CLT)

**Statement**: The sampling distribution of the sample mean approaches a normal distribution as sample size increases, regardless of the population distribution.

**Implications:**

- Allows us to make inferences about population parameters
- Justifies use of normal-based confidence intervals
- Typically applies when n ≥ 30

```python
# Demonstrate CLT
sample_means = []
for _ in range(1000):
    sample = df['gpa'].sample(30)
    sample_means.append(sample.mean())

plt.hist(sample_means, bins=30, edgecolor='black')
plt.title('Distribution of Sample Means (CLT Demonstration)')
plt.xlabel('Sample Mean GPA')
plt.ylabel('Frequency')
plt.show()
```

---

## Common Pitfalls to Avoid

1. **Jumping to Conclusions**

   - ❌ "High school region CAUSES lower GPA"
   - ✅ "High school region is ASSOCIATED with lower GPA"

2. **Ignoring Missing Data Patterns**

   - Check if missingness is random or systematic
   - Missing data might be informative

3. **Over-relying on Correlation**

   - Correlation ≠ Causation
   - Consider confounding variables

4. **Inappropriate Visualizations**

   - Don't use pie charts for many categories
   - Avoid 3D charts that distort perception
   - Choose chart types that match data types

5. **Neglecting Data Context**

   - Understand domain-specific nuances
   - Consult with Ashesi stakeholders

6. **Ethical Oversights**
   - Failing to anonymize data
   - Reporting findings that could stigmatize groups
   - Not considering historical context of inequities

---

## Recommended Tools & Libraries

### Essential Python Libraries

```python
# Data manipulation
import pandas as pd
import numpy as np

# Visualization
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px  # For interactive plots

# Statistical analysis
from scipy import stats
from scipy.stats import normaltest, shapiro, chi2_contingency, f_oneway

# Preprocessing
from sklearn.preprocessing import StandardScaler, MinMaxScaler, LabelEncoder
from sklearn.impute import SimpleImputer

# Missing data visualization
import missingno as msno
```

### Visualization Best Practices

```python
# Set style for better-looking plots
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (10, 6)
plt.rcParams['font.size'] = 12

# Use color palettes that are colorblind-friendly
sns.set_palette("colorblind")
```

---

## Additional Resources

### Textbooks

- **Anand & Sharma (2022)**: Data Science Fundamentals and Practical Approaches
- **Gupta (2022)**: Practical Data Science with Jupyter
- **Ozdemir (2024)**: Principles of Data Science (3rd ed.)

### Example Notebooks

- [Healthcare Dataset EDA](https://www.kaggle.com/code/hainescity/healthcare-dataset-eda)
- [No-Show Appointment EDA](https://github.com/jemc36/Udacity-DAND-EDA-NoShowApp)
- [Customer Loans EDA](https://github.com/joelsud18/exploratory-data-analysis---customer-loans-in-finance)
- [Banking EDA](https://github.com/SouRitra01/Exploratory-Data-Analysis-EDA-in-Banking-Python-Project-)

### Articles

- [EDA with Python Jupyter Notebook](https://medium.com/@techlatest.net/exploratory-data-analysis-with-python-jupyter-notebook-a-tutorial-on-how-to-perform-exploratory-5a800791b04f)
- [Quick Guide to EDA](https://www.geeksforgeeks.org/data-analysis/quick-guide-to-exploratory-data-analysis-using-jupyter-notebook)
- [Saturn Cloud EDA Guide](https://saturncloud.io/blog/a-quick-guide-to-exploratory-data-analysis-using-jupyter-notebook)

---

## Success Checklist

Before submitting, ensure you have:

- [ ] Loaded and inspected the dataset
- [ ] Documented all variables in a data dictionary
- [ ] Assessed data quality (missing values, duplicates, types)
- [ ] Performed univariate analysis on all key variables
- [ ] Detected and handled outliers appropriately
- [ ] Conducted bivariate/multivariate analysis
- [ ] Created meaningful visualizations
- [ ] Tested for statistical significance where appropriate
- [ ] Identified key patterns related to student success
- [ ] Preprocessed data (imputation, encoding, scaling)
- [ ] Addressed ethical considerations
- [ ] Documented all code with clear comments
- [ ] Prepared presentation with compelling narrative
- [ ] Tested all code to ensure reproducibility

---

## Final Tips for Success

1. **Start Early**: EDA is iterative and time-consuming
2. **Document Everything**: Future you will thank present you
3. **Visualize Often**: A good plot is worth a thousand numbers
4. **Think Critically**: Question your assumptions and findings
5. **Collaborate**: Discuss insights with your team
6. **Stay Ethical**: Always consider the human impact of your analysis
7. **Tell a Story**: Connect your findings to Ashesi's original question

**Remember**: The goal is not just to analyze data, but to provide actionable insights that can help Ashesi better support student success.
