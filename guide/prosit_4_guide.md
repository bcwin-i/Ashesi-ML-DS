# Prosit 4 Study Guide: Telling the Story Behind the Numbers

## Problem Overview

**Context**: After months of technical work—exploration, clustering, and prediction—Ashesi leadership has valuable insights but a critical problem: "No one outside this room understands them."

**The Challenge**: Different stakeholders have different needs:
- **Academic Advisor**: Quick identification of students needing support
- **Dean of Students**: Concerns about stigmatization
- **Faculty**: Understanding course stress points
- **Provost**: Coherent story for Executive team

**Key Request**: "We need you to help us see the story. Not just the statistics."

---

## Learning Objectives

### 1. **Visual Design Principles**
- Apply Gestalt principles
- Choose appropriate chart types
- Use color, size, and position effectively
- Create accessible visualizations

### 2. **Data Storytelling**
- Construct narrative arc (context → conflict → insight → action)
- Translate technical findings into plain language
- Tailor message to audience

### 3. **Dashboard Design**
- Design for different user personas
- Enable exploration without overwhelming
- Implement "what-if" scenarios

---

## Chart Selection Guide

| Data Type | Relationship | Best Chart | Example |
|-----------|--------------|------------|---------|
| **Categorical** | Comparison | Bar chart | GPA by major |
| **Categorical** | Composition | Stacked bar, pie | Student distribution |
| **Numerical** | Distribution | Histogram, box plot | GPA distribution |
| **Numerical** | Trend over time | Line chart | GPA trajectory |
| **Numerical** | Correlation | Scatter plot | Entrance score vs GPA |
| **Numerical** | Comparison | Box plot | GPA across clusters |

---

## Narrative Structure

### The Narrative Arc

**1. Context** (Setup)
- What problem are we solving?
- Why does it matter?

**2. Conflict** (Tension)
- What challenges did we face?
- What patterns emerged?

**3. Insight** (Resolution)
- What did we discover?
- Why is it important?

**4. Action** (Call to Action)
- What should we do?
- How do we measure success?

---

## Plotly Dashboard Example

```python
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Create comprehensive dashboard
fig = make_subplots(
    rows=2, cols=2,
    subplot_titles=(
        'GPA Distribution',
        'Gender Distribution',
        'Offer Type',
        'GPA by Gender'
    ),
    specs=[
        [{'type': 'histogram'}, {'type': 'pie'}],
        [{'type': 'pie'}, {'type': 'box'}]
    ]
)

# GPA histogram
fig.add_trace(
    go.Histogram(x=df['GPA'], nbinsx=30, marker_color='steelblue'),
    row=1, col=1
)

# Gender pie chart
gender_counts = df['Gender'].value_counts()
fig.add_trace(
    go.Pie(labels=gender_counts.index, values=gender_counts.values),
    row=1, col=2
)

# Offer type pie chart
offer_counts = df['Offer_type'].value_counts()
fig.add_trace(
    go.Pie(labels=offer_counts.index, values=offer_counts.values),
    row=2, col=1
)

# GPA by Gender box plot
for gender in df['Gender'].unique():
    gender_gpa = df[df['Gender'] == gender]['GPA']
    fig.add_trace(
        go.Box(y=gender_gpa, name=gender),
        row=2, col=2
    )

fig.update_layout(
    title_text='Student Success Dashboard',
    height=800,
    showlegend=True
)

fig.show()
```

---

## Color Best Practices

```python
import plotly.express as px

# Use colorblind-friendly palettes
fig = px.bar(df, x='category', y='value', 
             color='category',
             color_discrete_sequence=px.colors.qualitative.Safe)

# Sequential (for continuous data)
fig = px.scatter(df, x='x', y='y', color='value',
                color_continuous_scale='Blues')

# Diverging (for data with meaningful midpoint)
fig = px.imshow(correlation_matrix,
               color_continuous_scale='RdBu_r',
               zmin=-1, zmax=1)
```

**Guidelines:**
- Limit palette to 5-7 colors maximum
- Use color AND shape/pattern for accessibility
- Consistent colors across charts
- Test with colorblind simulators

---

## Presentation Structure (15 minutes)

**Slide 1: Title** (30 sec)
**Slide 2: Context** (1 min)
**Slide 3: Approach** (1 min)
**Slides 4-6: Key Findings** (6 min)
**Slide 7: Dashboard Demo** (3 min)
**Slide 8: Ethical Considerations** (2 min)
**Slide 9: Recommendations** (1.5 min)
**Slide 10: Q&A** (Remaining time)

---

## Handling Questions

**Q: "How accurate is your model?"**
**A:** "Our model correctly identifies 75% of students who will need support, with a 20% false positive rate. We believe this is acceptable because the cost of missing a student is higher than offering unnecessary support."

**Q: "Won't this stigmatize students?"**
**A:** "Great question. We've designed the system to be supportive, not punitive. Students are never labeled 'at-risk'—instead, they're 'eligible for enhanced support.' All outreach is voluntary and confidential."

---

## Ethical Visual Framing

### ❌ Bad (Stigmatizing)
```python
colors = ['red' if x == 'at-risk' else 'green' for x in df['status']]
plt.title('At-Risk Students (Red) vs Safe Students (Green)')
```

### ✅ Good (Neutral/Positive)
```python
fig = px.scatter(df, x='gpa', y='credits',
                color='support_eligible',
                color_discrete_map={
                    True: 'steelblue',
                    False: 'lightgray'
                },
                labels={'support_eligible': 'Eligible for Enhanced Support'})
plt.title('Student Support Eligibility')
```

---

## Deliverables

1. **15-Minute Presentation**
   - Clear problem statement
   - 3-5 key findings with visuals
   - Live dashboard demonstration
   - Ethical considerations
   - Specific recommendations

2. **Interactive Dashboard**
   - Multiple user personas supported
   - Filters and drill-down capabilities
   - Key metrics (KPIs) prominently displayed
   - Export functionality

---

## Success Checklist

- [ ] Identified all stakeholder needs
- [ ] Crafted clear narrative arc
- [ ] Selected appropriate chart types
- [ ] Applied visual design principles
- [ ] Created accessible visualizations
- [ ] Built interactive dashboard
- [ ] Prepared presentation slides
- [ ] Practiced presentation (timed)
- [ ] Prepared for Q&A
- [ ] Addressed ethical considerations

---

## Resources

**Textbooks:**
- Knaflic, C. N. (2015). Storytelling with Data
- Wilke, C. O. (2019). Fundamentals of Data Visualization

**Online:**
- [Mastering Data Storytelling](https://medium.com/@dossieranalysis/mastering-the-art-of-data-storytelling-strategies-for-engaging-and-impactful-narratives-0abc25864319)
- [Telling Effective Data Stories](https://www.datacamp.com/blog/telling-effective-data-stories-with-data-narrative-and-visuals)
