import { useState, useEffect } from 'react';
import { Activity, MoreHorizontal, Loader2 } from 'lucide-react';
import { api } from '../api/client';

interface ClusterMetric {
  Algorithm: string;
  N_Clusters: number;
  'Davies-Bouldin': number | string;
  'Calinski-Harabasz': number | string;
}

interface ModelInfo {
  algorithms: string[];
  n_features: number;
  n_samples: number;
  scaler_type: string;
  pca_components: number;
  algorithm_details: any;
}

const DarkCard = ({ title, subtitle, children, className = "" }: { title?: string, subtitle?: string, children: React.ReactNode, className?: string }) => (
  <div className={`bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-2xl p-6 transition-colors duration-300 ${className}`}>
    {(title || subtitle) && (
      <div className="mb-6 flex justify-between items-start">
        <div>
           {title && <h3 className="text-gray-900 dark:text-white font-bold text-lg">{title}</h3>}
           {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <MoreHorizontal className="text-gray-400 dark:text-gray-600 cursor-pointer hover:text-gray-700 dark:hover:text-white" size={20}/>
      </div>
    )}
    {children}
  </div>
);

const Prosit2Dashboard = () => {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [metrics, setMetrics] = useState<ClusterMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [infoData, metricsData] = await Promise.all([
        api.prosit2.getModelsInfo(),
        api.prosit2.getMetrics()
      ]);
      
      setModelInfo(infoData);
      setMetrics(metricsData);
    } catch (err) {
      setError('Failed to load clustering data. Make sure the API is running.');
      console.error('Error loading Prosit 2 data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#881C1C] dark:text-emerald-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading clustering models...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800 rounded-2xl p-8 text-center">
        <p className="text-rose-600 dark:text-rose-400 font-medium">{error}</p>
        <button 
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-[#881C1C] dark:bg-emerald-500 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Top KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <DarkCard>
          <div className="flex items-center space-x-2 text-gray-500 mb-2">
            <Activity size={14}/>
            <span className="text-xs font-mono uppercase">Total Samples</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {modelInfo?.n_samples.toLocaleString()}
              </h2>
              <p className="text-xs text-gray-500 mt-1">Student records</p>
            </div>
          </div>
        </DarkCard>

        <DarkCard>
          <div className="flex items-center space-x-2 text-gray-500 mb-2">
            <Activity size={14}/>
            <span className="text-xs font-mono uppercase">Features</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {modelInfo?.n_features}
              </h2>
              <p className="text-xs text-gray-500 mt-1">Dimensions</p>
            </div>
          </div>
        </DarkCard>

        <DarkCard>
          <div className="flex items-center space-x-2 text-gray-500 mb-2">
            <Activity size={14}/>
            <span className="text-xs font-mono uppercase">PCA Components</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {modelInfo?.pca_components}
              </h2>
              <p className="text-xs text-gray-500 mt-1">Reduced dimensions</p>
            </div>
          </div>
        </DarkCard>

        <DarkCard>
          <div className="flex items-center space-x-2 text-gray-500 mb-2">
            <Activity size={14}/>
            <span className="text-xs font-mono uppercase">Algorithms</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {modelInfo?.algorithms.length}
              </h2>
              <p className="text-xs text-gray-500 mt-1">Clustering models</p>
            </div>
          </div>
        </DarkCard>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Clustering Algorithms */}
        <div className="col-span-12 lg:col-span-8">
          <DarkCard title="Clustering Algorithms" subtitle="Performance comparison across different methods">
            <div className="space-y-4">
              {metrics.map((metric, i) => {
                const algorithmDetails = modelInfo?.algorithm_details[metric.Algorithm];
                const nClusters = algorithmDetails?.n_clusters || metric.N_Clusters;
                const nOutliers = algorithmDetails?.n_outliers;

                return (
                  <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#262626]">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{metric.Algorithm}</h4>
                        <p className="text-xs text-gray-500">
                          {nClusters} cluster{nClusters !== 1 ? 's' : ''}
                          {nOutliers && ` • ${nOutliers.toLocaleString()} outliers`}
                        </p>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-[#881C1C]/10 dark:bg-emerald-500/10 text-[#881C1C] dark:text-emerald-400 text-xs font-bold">
                        Active
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Davies-Bouldin Index</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {metric['Davies-Bouldin'] 
                            ? typeof metric['Davies-Bouldin'] === 'number' 
                              ? metric['Davies-Bouldin'].toFixed(4)
                              : metric['Davies-Bouldin']
                            : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Lower is better</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Calinski-Harabasz Score</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {metric['Calinski-Harabasz']
                            ? typeof metric['Calinski-Harabasz'] === 'number'
                              ? metric['Calinski-Harabasz'].toLocaleString(undefined, { maximumFractionDigits: 2 })
                              : metric['Calinski-Harabasz']
                            : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Higher is better</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </DarkCard>
        </div>

        {/* Model Details */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <DarkCard title="Model Configuration" subtitle="Preprocessing pipeline">
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#1A1A1A]">
                <p className="text-xs text-gray-500 mb-1">Scaler</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{modelInfo?.scaler_type}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#1A1A1A]">
                <p className="text-xs text-gray-500 mb-1">Dimensionality Reduction</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  PCA ({modelInfo?.n_features} → {modelInfo?.pca_components})
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#1A1A1A]">
                <p className="text-xs text-gray-500 mb-1">Best Performing</p>
                <p className="text-sm font-bold text-[#881C1C] dark:text-emerald-400">
                  {metrics.length > 0 && metrics[0].Algorithm}
                </p>
                <p className="text-xs text-gray-500 mt-1">Lowest Davies-Bouldin</p>
              </div>
            </div>
          </DarkCard>

          <DarkCard title="Available Models" subtitle={`${modelInfo?.algorithms.length} clustering algorithms`}>
            <div className="space-y-2">
              {modelInfo?.algorithms.map((algo, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] hover:bg-gray-100 dark:hover:bg-[#202020] transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-[#881C1C] dark:bg-emerald-500"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{algo}</span>
                  </div>
                  <span className="text-xs text-gray-500">Ready</span>
                </div>
              ))}
            </div>
          </DarkCard>
        </div>
      </div>
    </>
  );
};

export default Prosit2Dashboard;
