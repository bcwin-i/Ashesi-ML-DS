// API Client for FastAPI Backend
const API_BASE_URL = "http://localhost:8000";

// Types
export interface ClusterResponse {
  cluster: number;
  algorithm: string;
  n_clusters: number;
  is_outlier: boolean;
}

export interface PredictionResponse {
  probation_risk: number;
  probability: number;
  model_used: string;
  confidence: string;
}

export interface Prosit5Response {
  prediction: number;
  probability: number;
  model_used: string;
  confidence: string;
  interpretation: string;
}

// API Client
export const api = {
  // Health check
  getHealth: async () => {
    const response = await fetch(`${API_BASE_URL}/`);
    return response.json();
  },

  // Prosit 2 - Clustering
  prosit2: {
    cluster: async (
      algorithm: "kmeans" | "dbscan" | "hierarchical" | "gmm",
      data: any
    ): Promise<ClusterResponse> => {
      const response = await fetch(
        `${API_BASE_URL}/prosit2/cluster/${algorithm}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Clustering failed");
      return response.json();
    },

    getModelsInfo: async () => {
      const response = await fetch(`${API_BASE_URL}/prosit2/models/info`);
      return response.json();
    },

    getMetrics: async () => {
      const response = await fetch(`${API_BASE_URL}/prosit2/results/metrics`);
      return response.json();
    },
  },

  // Prosit 3 - Probation Risk
  prosit3: {
    predict: async (model: string, data: any): Promise<PredictionResponse> => {
      const response = await fetch(`${API_BASE_URL}/prosit3/predict/${model}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Prediction failed");
      }
      return response.json();
    },

    predictEnsemble: async (data: any): Promise<PredictionResponse> => {
      const response = await fetch(`${API_BASE_URL}/prosit3/predict/ensemble`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Ensemble prediction failed");
      }
      return response.json();
    },

    getModelsInfo: async () => {
      const response = await fetch(`${API_BASE_URL}/prosit3/models/info`);
      return response.json();
    },

    getFeatures: async () => {
      const response = await fetch(`${API_BASE_URL}/prosit3/features`);
      return response.json();
    },

    getMetrics: async () => {
      const response = await fetch(`${API_BASE_URL}/prosit3/results/metrics`);
      return response.json();
    },
  },

  // Prosit 5 - Student Success Prediction
  prosit5: {
    predictFirstYearStruggle: async (data: {
      math_score: number;
      english_score: number;
      composite_score: number;
    }): Promise<Prosit5Response> => {
      const response = await fetch(
        `${API_BASE_URL}/prosit5/predict/first-year-struggle`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Prediction failed");
      return response.json();
    },

    predictAJC: async (data: {
      math_score: number;
      english_score: number;
      composite_score: number;
    }): Promise<Prosit5Response> => {
      const response = await fetch(`${API_BASE_URL}/prosit5/predict/ajc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Prediction failed");
      return response.json();
    },

    predictMajorSuccess: async (data: {
      math_score: number;
      english_score: number;
      first_year_gpa: number;
    }): Promise<Prosit5Response> => {
      const response = await fetch(
        `${API_BASE_URL}/prosit5/predict/major-success`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Prediction failed");
      return response.json();
    },

    predictDelayedGraduation: async (data: {
      math_score: number;
      english_score: number;
      first_year_gpa: number;
      failed_courses: number;
    }): Promise<Prosit5Response> => {
      const response = await fetch(
        `${API_BASE_URL}/prosit5/predict/delayed-graduation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Prediction failed");
      return response.json();
    },

    getModelsInfo: async () => {
      const response = await fetch(`${API_BASE_URL}/prosit5/models/info`);
      return response.json();
    },

    getMetrics: async () => {
      const response = await fetch(`${API_BASE_URL}/prosit5/results/metrics`);
      return response.json();
    },

    getFindings: async () => {
      const response = await fetch(`${API_BASE_URL}/prosit5/results/findings`);
      return response.json();
    },
  },
};
