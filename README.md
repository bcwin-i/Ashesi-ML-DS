# Ashesi Student Success Analysis
## Machine Learning & Data Science Final Prosit

This project analyzes student success patterns at Ashesi University through exploratory data analysis, clustering, and predictive modeling.

---

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Prosit Breakdown](#prosit-breakdown)
- [Data](#data)
- [Technologies](#technologies)

---

## 🎯 Project Overview

This comprehensive analysis project consists of multiple "Prosits" (problem-solving exercises) that progressively build understanding of student success factors:

1. **Prosit 1**: Exploratory Data Analysis (EDA)
2. **Prosit 2**: Clustering Analysis
3. **Prosit 3**: Predictive Modeling
4. **Prosit 4**: Advanced Analytics
5. **Prosit 5**: Integration & Dashboard

---

## 📁 Project Structure

```
Final Prosit/
├── data/
│   └── merged_cleaned.csv          # Main dataset
├── notebooks/
│   ├── prosit_1.ipynb              # EDA notebook
│   ├── prosit_2.ipynb              # Clustering analysis
│   ├── prosit_3.ipynb              # Predictive modeling
│   ├── prosit_4.ipynb              # Advanced analytics
│   └── prosit_5.ipynb              # Final integration
├── guide/
│   ├── prosit_3_guide.md           # Study guide for Prosit 3
│   ├── prosit_4_guide.md           # Study guide for Prosit 4
│   └── prosit_5_guide.md           # Study guide for Prosit 5
├── requirements.txt                # Python dependencies
└── README.md                       # This file
```

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd "/Volumes/External Storage/School/Ashesi/ML & DS/Final Prosit"
   ```

2. **Create a virtual environment (recommended)**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```

4. **Install required packages**
   ```bash
   pip install -r requirements.txt
   ```

5. **Verify installation**
   ```bash
   python -c "import pandas, numpy, plotly, sklearn; print('✅ All packages installed successfully!')"
   ```

---

## 💻 Usage

### Running Jupyter Notebooks

1. **Start Jupyter Notebook**
   ```bash
   jupyter notebook
   ```
   This will open Jupyter in your default web browser.

2. **Navigate to the notebooks folder** and open any `.ipynb` file

3. **Run cells sequentially** using `Shift + Enter`

### Using VS Code

1. Open the project folder in VS Code
2. Install the **Jupyter extension** for VS Code
3. Open any `.ipynb` file
4. Select the Python kernel (the virtual environment you created)
5. Run cells using the play button or `Shift + Enter`

---

## 📊 Prosit Breakdown

### Prosit 1: Exploratory Data Analysis
**Objective**: Understand the data clearly before building models

**Key Activities**:
- Load and inspect the merged dataset
- Analyze data quality (missing values, data types)
- Explore key variables (Gender, Programs, Nationalities)
- Analyze GPA distributions and academic performance
- Create interactive visualizations with Plotly
- Identify patterns and insights

**Notebook**: `notebooks/prosit_1.ipynb`

---

### Prosit 2: Clustering Analysis
**Objective**: Discover hidden patterns in student journeys

**Key Activities**:
- Feature engineering and selection
- Apply clustering algorithms (K-Means, Hierarchical)
- Determine optimal number of clusters
- Interpret and visualize clusters
- Profile student segments

**Notebook**: `notebooks/prosit_2.ipynb`

---

### Prosit 3: Predictive Modeling
**Objective**: Build models to predict student success

**Key Activities**:
- Define prediction targets
- Feature engineering
- Train classification/regression models
- Model evaluation and comparison
- Feature importance analysis

**Notebook**: `notebooks/prosit_3.ipynb`  
**Study Guide**: `guide/prosit_3_guide.md`

---

### Prosit 4: Advanced Analytics
**Objective**: Deep dive into specific success factors

**Notebook**: `notebooks/prosit_4.ipynb`  
**Study Guide**: `guide/prosit_4_guide.md`

---

### Prosit 5: Integration & Dashboard
**Objective**: Integrate all analyses into a cohesive dashboard

**Notebook**: `notebooks/prosit_5.ipynb`  
**Study Guide**: `guide/prosit_5_guide.md`

---

## 📈 Data

### Dataset: `merged_cleaned.csv`

The dataset contains student information including:
- **Demographics**: Gender, Nationality, Age
- **Academic**: Programs, GPA, Grades, Course performance
- **Admissions**: Offer types, Entry qualifications
- **Conduct**: Academic Judiciary Committee (AJC) records

**Note**: The dataset has been pre-cleaned and merged from multiple sources.

---

## 🛠 Technologies

### Core Libraries
- **pandas**: Data manipulation and analysis
- **numpy**: Numerical computing
- **plotly**: Interactive visualizations
- **scikit-learn**: Machine learning algorithms

### Development Environment
- **Jupyter Notebook**: Interactive computing
- **Python 3.11+**: Programming language

---

## 📝 Notes

- Each Prosit builds upon the previous one
- Study guides are available in the `guide/` folder
- All visualizations use Plotly for interactivity
- The dataset is pre-cleaned and ready for analysis

---

## 🤝 Contributing

This is an academic project. If you're working on similar analyses:
1. Ensure data privacy and ethical considerations
2. Document your methodology clearly
3. Validate findings with domain experts

---

## 📧 Contact

For questions or collaboration:
- **Project**: Ashesi Student Success Analysis
- **Course**: Machine Learning & Data Science
- **Institution**: Ashesi University

---

## ⚖️ License

This project is for educational purposes as part of the ML & DS course at Ashesi University.

---

**Last Updated**: December 2025
