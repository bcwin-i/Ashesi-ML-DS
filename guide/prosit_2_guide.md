# Prosit 2 Study Guide: Hidden Patterns in Student Journeys

## Problem Overview

**Context**: After successfully helping Ashesi understand their data through exploratory analysis, the leadership team is now ready to dive deeper. They've shared semester-by-semester transcript data and want to discover hidden structures and patterns that aren't immediately visible.

**Key Request**: "We want to discover meaningful structure in the data without predefined labels. Are there groups of students with similar academic pathways? Can we identify bottlenecks and outliers?"

---

## Learning Objectives

### 1. **Unsupervised Learning Fundamentals**
- Understand the role of unsupervised learning in ML pipeline
- Contrast unsupervised vs supervised learning approaches
- Identify when to use unsupervised methods

### 2. **Clustering Algorithms**
- K-Means clustering
- Hierarchical clustering  
- DBSCAN (Density-Based Spatial Clustering)
- Gaussian Mixture Models (GMM)

### 3. **Dimensionality Reduction**
- Principal Component Analysis (PCA)
- t-SNE (t-Distributed Stochastic Neighbor Embedding)
- UMAP (Uniform Manifold Approximation and Projection)

### 4. **Evaluation Metrics**
- **Internal Metrics**: Silhouette score, Davies-Bouldin index
- **External Metrics**: Adjusted Rand Index, Normalized Mutual Information

---

## Key Concepts

### Clustering Comparison

| Algorithm | Pros | Cons | Best For |
|-----------|------|------|----------|
| **K-Means** | Fast, scalable, simple | Assumes spherical clusters, needs k | Large datasets, spherical clusters |
| **Hierarchical** | No k needed, dendrogram | Slow (O(n²)), sensitive to noise | Small datasets, hierarchy important |
| **DBSCAN** | Arbitrary shapes, finds outliers | Sensitive to parameters | Spatial data, outlier detection |
| **GMM** | Soft clustering, flexible shapes | Assumes Gaussians, slow | Probabilistic assignments needed |

### Dimensionality Reduction

| Method | Type | Preserves | Use Case |
|--------|------|-----------|----------|
| **PCA** | Linear | Global variance | Preprocessing, feature reduction |
| **t-SNE** | Non-linear | Local structure | Visualization only |
| **UMAP** | Non-linear | Local + global | Visualization + preprocessing |

---

## Implementation Examples

### K-Means Clustering

```python
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# Prepare data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Elbow method
inertias = []
K_range = range(2, 11)

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(X_scaled)
    inertias.append(kmeans.inertia_)

# Plot elbow curve
plt.plot(K_range, inertias, marker='o')
plt.xlabel('Number of Clusters (k)')
plt.ylabel('Inertia')
plt.title('Elbow Method')
plt.show()

# Fit final model
kmeans = KMeans(n_clusters=4, random_state=42)
clusters = kmeans.fit_predict(X_scaled)
```

### PCA for Dimensionality Reduction

```python
from sklearn.decomposition import PCA

# Fit PCA
pca = PCA()
X_pca = pca.fit_transform(X_scaled)

# Explained variance
explained_var = pca.explained_variance_ratio_

# Choose components (95% variance)
n_components = np.argmax(np.cumsum(explained_var) >= 0.95) + 1
print(f"Components for 95% variance: {n_components}")
```

### Evaluation with Silhouette Score

```python
from sklearn.metrics import silhouette_score

# Calculate silhouette score
sil_score = silhouette_score(X_scaled, clusters)
print(f"Silhouette Score: {sil_score:.3f}")

# Interpretation:
# > 0.5: Strong structure
# 0.25-0.5: Weak structure
# < 0.25: No substantial structure
```

---

## Deliverables

1. **Detailed Notebook**
   - Multiple clustering algorithms implemented
   - Dimensionality reduction applied
   - Evaluation metrics calculated
   - Cluster interpretation

2. **Technical Report**
   - Methodology explanation
   - Results and visualizations
   - Ethical considerations
   - Recommendations

---

## Success Checklist

- [ ] Implemented at least 3 clustering algorithms
- [ ] Applied dimensionality reduction (PCA, t-SNE, or UMAP)
- [ ] Evaluated clusters with multiple metrics
- [ ] Profiled and interpreted each cluster
- [ ] Identified bottlenecks and outliers
- [ ] Created compelling visualizations
- [ ] Addressed ethical considerations
- [ ] Documented all code and decisions

---

## Resources

**Textbooks:**
- Géron, A. (2022). Hands-on Machine Learning with Scikit-Learn, Keras, and TensorFlow (3rd ed.)
- James, G., et al. (2023). An Introduction to Statistical Learning with Applications in Python

**Online:**
- [Wine Clustering with Unsupervised Learning](https://github.com/Ireanuoluwa/Wine-Clustering)
- [Different Clustering Techniques](https://www.kaggle.com/code/azminetoushikwasi/different-clustering-techniques-and-algorithms)
