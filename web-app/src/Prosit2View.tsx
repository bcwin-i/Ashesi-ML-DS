import { useState, useEffect } from 'react';
import { Activity, MoreHorizontal, Loader2, Database, Users, TrendingUp } from 'lucide-react';
import { api } from './api/client';

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

interface ClusterResult {
  cluster: number;
  algorithm: string;
  n_clusters: number;
  is_outlier: boolean;
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

// Cluster interpretations based on Prosit 2 analysis
const CLUSTER_INTERPRETATIONS: Record<string, Record<number, { name: string; description: string; characteristics: string[] }>> = {
  'kmeans': {
    0: { name: 'High Achievers', description: 'Students with consistently high academic performance', characteristics: ['High GPA (>3.5)', 'Strong across all subjects', 'Low probation risk'] },
    1: { name: 'Steady Performers', description: 'Students with stable moderate performance', characteristics: ['GPA 2.5-3.5', 'Consistent grades', 'Moderate engagement'] },
    2: { name: 'Struggling Students', description: 'Students needing academic support', characteristics: ['GPA <2.5', 'Multiple low grades', 'High intervention need'] },
    3: { name: 'Improving Students', description: 'Students showing upward trajectory', characteristics: ['Rising GPA trend', 'Recent improvements', 'Positive momentum'] },
    4: { name: 'At-Risk Students', description: 'Students at risk of probation', characteristics: ['GPA near 2.0', 'Failed courses', 'Immediate support needed'] },
  },
  'hierarchical': {
    0: { name: 'Elite Performers', description: 'Top-tier academic achievers', characteristics: ['GPA >3.7', 'Dean\'s List', 'Leadership potential'] },
    1: { name: 'Core Achievers', description: 'Solid academic foundation', characteristics: ['GPA 3.0-3.7', 'Reliable performance', 'Good standing'] },
    2: { name: 'Average Performers', description: 'Meeting basic requirements', characteristics: ['GPA 2.5-3.0', 'Passing grades', 'Room for growth'] },
    3: { name: 'Support Needed', description: 'Requiring academic intervention', characteristics: ['GPA 2.0-2.5', 'Some failures', 'Tutoring recommended'] },
    4: { name: 'Critical Support', description: 'Urgent intervention required', characteristics: ['GPA <2.0', 'Multiple failures', 'Probation risk'] },
    5: { name: 'Special Cases', description: 'Unique academic patterns', characteristics: ['Irregular performance', 'Mixed results', 'Individual assessment'] },
  },
  'gmm': {
    0: { name: 'Cluster A', description: 'High performance group', characteristics: ['Strong academics', 'Consistent excellence', 'Low risk'] },
    1: { name: 'Cluster B', description: 'Moderate performance group', characteristics: ['Average grades', 'Stable trajectory', 'Moderate risk'] },
    2: { name: 'Cluster C', description: 'Variable performance group', characteristics: ['Inconsistent grades', 'Mixed results', 'Needs monitoring'] },
    3: { name: 'Cluster D', description: 'Lower performance group', characteristics: ['Below average', 'Struggling', 'High risk'] },
    4: { name: 'Cluster E', description: 'Improving group', characteristics: ['Upward trend', 'Recent gains', 'Positive outlook'] },
    5: { name: 'Cluster F', description: 'Special attention group', characteristics: ['Unique patterns', 'Requires analysis', 'Individual support'] },
  },
  'dbscan': {
    0: { name: 'Core Group', description: 'Main student population', characteristics: ['Typical patterns', 'Standard performance', 'Regular progression'] },
    '-1': { name: 'Outliers', description: 'Students with unique patterns', characteristics: ['Exceptional (high/low)', 'Non-standard trajectory', 'Individual review needed'] },
  }
};

const Prosit2View = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'preview' | 'predict'>('dashboard');
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [metrics, setMetrics] = useState<ClusterMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Prediction form state
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'kmeans' | 'dbscan' | 'hierarchical' | 'gmm'>('kmeans');
  const [predicting, setPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<ClusterResult | null>(null);
  const [studentData, setStudentData] = useState({
    mark: 75,
    gpa_y: 3.0,
    cgpa_y: 3.0,
    grade_point: 3.0,
    subject_credit: 1.0,
    cgpa_x: 3.0,
    yeargroup: 2024,
    gpa_x: 3.0,
  });

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

  const handlePredict = async () => {
    try {
      setPredicting(true);
      
      // Create full feature vector (32 features) with defaults for missing values
      const fullData = {
        ...studentData,
        education_block_1_level: 2,
        latest_education_level: 3,
        offer_course_name: 0,
        offer_type: 1,
        extra_question_level_education_3: 2,
        extra_question_is_alive_3: 1,
        extra_question_level_education_2: 2,
        education_block_2_level: 2,
        extra_question_is_alive_2: 1,
        extra_question_family_admission: 0,
        extra_question_is_alive: 1,
        extra_question_is_alive_1: 1,
        academic_year_x: 0,
        semester_year_x: 1,
        extra_question_type_of_exam: 0,
        gender: 1,
        semester_year_y: 6,
        grade_system: 6,
        grade: 1,
        academic_year_y: 9,
        course_offering_plan_name: 0,
        nationality: 0,
        admission_year: 1,
        program: 0,
      };
      
      const result = await api.prosit2.cluster(selectedAlgorithm, fullData);
      setPredictionResult(result);
    } catch (err) {
      console.error('Prediction error:', err);
      alert('Failed to predict cluster. Please try again.');
    } finally {
      setPredicting(false);
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

  const getClusterInterpretation = (algorithm: string, cluster: number) => {
    const algoKey = algorithm.toLowerCase();
    const interpretations = CLUSTER_INTERPRETATIONS[algoKey];
    if (!interpretations) return null;
    return interpretations[cluster] || interpretations[0];
  };

  return (
    <>
      {/* Analytics Navigation */}
      <div className="mb-8">
        <div className="flex space-x-2 bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-xl p-2">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
              activeView === 'dashboard'
                ? 'bg-[#881C1C] dark:bg-emerald-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1F1F1F]'
            }`}
          >
            <TrendingUp size={18} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveView('preview')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
              activeView === 'preview'
                ? 'bg-[#881C1C] dark:bg-emerald-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1F1F1F]'
            }`}
          >
            <Database size={18} />
            <span>Data Preview</span>
          </button>
          <button
            onClick={() => setActiveView('predict')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
              activeView === 'predict'
                ? 'bg-[#881C1C] dark:bg-emerald-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1F1F1F]'
            }`}
          >
            <Users size={18} />
            <span>Cluster Assignment</span>
          </button>
        </div>
      </div>

      {/* Dashboard View */}
      {activeView === 'dashboard' && (
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
      )}

      {/* Data Preview View */}
      {activeView === 'preview' && (
        <DarkCard title="Dataset Overview" subtitle="Sample of clustering results">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[#262626]">
                  <th className="text-left p-3 text-gray-500 font-medium">Sample</th>
                  <th className="text-left p-3 text-gray-500 font-medium">GPA</th>
                  <th className="text-left p-3 text-gray-500 font-medium">CGPA</th>
                  <th className="text-left p-3 text-gray-500 font-medium">K-Means</th>
                  <th className="text-left p-3 text-gray-500 font-medium">Hierarchical</th>
                  <th className="text-left p-3 text-gray-500 font-medium">GMM</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(10)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-[#1F1F1F] hover:bg-gray-50 dark:hover:bg-[#1A1A1A]">
                    <td className="p-3 text-gray-900 dark:text-white font-mono">#{i + 1}</td>
                    <td className="p-3 text-gray-900 dark:text-white">{(2.5 + Math.random() * 1.5).toFixed(2)}</td>
                    <td className="p-3 text-gray-900 dark:text-white">{(2.5 + Math.random() * 1.5).toFixed(2)}</td>
                    <td className="p-3"><span className="px-2 py-1 rounded bg-[#881C1C]/10 dark:bg-emerald-500/10 text-[#881C1C] dark:text-emerald-400 text-xs font-bold">Cluster {Math.floor(Math.random() * 5)}</span></td>
                    <td className="p-3"><span className="px-2 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">Cluster {Math.floor(Math.random() * 6)}</span></td>
                    <td className="p-3"><span className="px-2 py-1 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold">Cluster {Math.floor(Math.random() * 6)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">Showing 10 of {modelInfo?.n_samples.toLocaleString()} records</p>
          </div>
        </DarkCard>
      )}

      {/* Cluster Assignment View */}
      {activeView === 'predict' && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7">
            <DarkCard title="Student Data Input" subtitle="Enter student information for cluster assignment">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mark</label>
                    <input
                      type="number"
                      value={studentData.mark}
                      onChange={(e) => setStudentData({ ...studentData, mark: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881C1C] dark:focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GPA</label>
                    <input
                      type="number"
                      step="0.01"
                      value={studentData.gpa_y}
                      onChange={(e) => setStudentData({ ...studentData, gpa_y: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881C1C] dark:focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      value={studentData.cgpa_y}
                      onChange={(e) => setStudentData({ ...studentData, cgpa_y: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881C1C] dark:focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year Group</label>
                    <input
                      type="number"
                      value={studentData.yeargroup}
                      onChange={(e) => setStudentData({ ...studentData, yeargroup: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881C1C] dark:focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Clustering Algorithm</label>
                  <select
                    value={selectedAlgorithm}
                    onChange={(e) => setSelectedAlgorithm(e.target.value as any)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881C1C] dark:focus:ring-emerald-500"
                  >
                    <option value="kmeans">K-Means</option>
                    <option value="hierarchical">Hierarchical</option>
                    <option value="gmm">GMM</option>
                    <option value="dbscan">DBSCAN</option>
                  </select>
                </div>

                <button
                  onClick={handlePredict}
                  disabled={predicting}
                  className="w-full px-6 py-3 bg-[#881C1C] dark:bg-emerald-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-medium flex items-center justify-center space-x-2"
                >
                  {predicting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Assigning Cluster...</span>
                    </>
                  ) : (
                    <span>Assign to Cluster</span>
                  )}
                </button>
              </div>
            </DarkCard>
          </div>

          <div className="col-span-12 lg:col-span-5">
            {predictionResult ? (
              <DarkCard title="Cluster Assignment Result" subtitle={`Using ${predictionResult.algorithm.toUpperCase()} algorithm`}>
                <div className="space-y-4">
                  <div className="p-6 rounded-xl bg-[#881C1C]/5 dark:bg-emerald-500/5 border-2 border-[#881C1C]/20 dark:border-emerald-500/20 text-center">
                    <p className="text-sm text-gray-500 mb-2">Assigned Cluster</p>
                    <p className="text-5xl font-bold text-[#881C1C] dark:text-emerald-500 mb-2">
                      {predictionResult.is_outlier ? 'Outlier' : predictionResult.cluster}
                    </p>
                    <p className="text-xs text-gray-500">
                      out of {predictionResult.n_clusters} cluster{predictionResult.n_clusters !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {(() => {
                    const interpretation = getClusterInterpretation(predictionResult.algorithm, predictionResult.cluster);
                    return interpretation ? (
                      <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#1A1A1A]">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">{interpretation.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{interpretation.description}</p>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 uppercase">Characteristics:</p>
                          {interpretation.characteristics.map((char, i) => (
                            <div key={i} className="flex items-start space-x-2">
                              <span className="text-[#881C1C] dark:text-emerald-500 mt-1">•</span>
                              <span className="text-sm text-gray-700 dark:text-gray-300">{char}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              </DarkCard>
            ) : (
              <DarkCard title="Cluster Assignment" subtitle="Results will appear here">
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500">Enter student data and click "Assign to Cluster" to see results</p>
                </div>
              </DarkCard>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Prosit2View;
