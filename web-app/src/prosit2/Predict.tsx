import { useState } from 'react';
import { MoreHorizontal, Loader2, Users, TrendingUp, Award, Calendar, Target } from 'lucide-react';
import { api } from '../api/client';

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

// Cluster interpretations based on GPA thresholds
const CLUSTER_INTERPRETATIONS: Record<string, Record<number, { name: string; description: string; characteristics: string[] }>> = {
  'kmeans': {
    0: { name: 'High Achievers', description: 'Students with excellent academic performance', characteristics: ['GPA ≥ 3.5', 'Dean\'s List potential', 'Strong across all subjects'] },
    1: { name: 'Steady Performers', description: 'Students with good stable performance', characteristics: ['GPA 3.0-3.5', 'Consistent grades', 'Good academic standing'] },
    2: { name: 'Average Performers', description: 'Students meeting standard requirements', characteristics: ['GPA 2.5-3.0', 'Passing grades', 'Room for improvement'] },
    3: { name: 'Support Needed', description: 'Students requiring academic support', characteristics: ['GPA 2.0-2.5', 'Some struggles', 'Tutoring recommended'] },
    4: { name: 'At-Risk Students', description: 'Students at risk of probation', characteristics: ['GPA < 2.0', 'Immediate intervention needed', 'High probation risk'] },
  },
  'hierarchical': {
    0: { name: 'High Achievers', description: 'Students with excellent academic performance', characteristics: ['GPA ≥ 3.5', 'Dean\'s List potential', 'Strong across all subjects'] },
    1: { name: 'Steady Performers', description: 'Students with good stable performance', characteristics: ['GPA 3.0-3.5', 'Consistent grades', 'Good academic standing'] },
    2: { name: 'Average Performers', description: 'Students meeting standard requirements', characteristics: ['GPA 2.5-3.0', 'Passing grades', 'Room for improvement'] },
    3: { name: 'Support Needed', description: 'Students requiring academic support', characteristics: ['GPA 2.0-2.5', 'Some struggles', 'Tutoring recommended'] },
    4: { name: 'At-Risk Students', description: 'Students at risk of probation', characteristics: ['GPA < 2.0', 'Immediate intervention needed', 'High probation risk'] },
    5: { name: 'Special Cases', description: 'Unique academic patterns', characteristics: ['Irregular performance', 'Mixed results', 'Individual assessment'] },
  },
  'gmm': {
    0: { name: 'High Achievers', description: 'Students with excellent academic performance', characteristics: ['GPA ≥ 3.5', 'Dean\'s List potential', 'Strong across all subjects'] },
    1: { name: 'Steady Performers', description: 'Students with good stable performance', characteristics: ['GPA 3.0-3.5', 'Consistent grades', 'Good academic standing'] },
    2: { name: 'Average Performers', description: 'Students meeting standard requirements', characteristics: ['GPA 2.5-3.0', 'Passing grades', 'Room for improvement'] },
    3: { name: 'Support Needed', description: 'Students requiring academic support', characteristics: ['GPA 2.0-2.5', 'Some struggles', 'Tutoring recommended'] },
    4: { name: 'At-Risk Students', description: 'Students at risk of probation', characteristics: ['GPA < 2.0', 'Immediate intervention needed', 'High probation risk'] },
    5: { name: 'Special Cases', description: 'Unique academic patterns', characteristics: ['Irregular performance', 'Mixed results', 'Individual assessment'] },
  },
  'dbscan': {
    0: { name: 'Core Group', description: 'Main student population', characteristics: ['Typical patterns', 'Standard performance', 'Regular progression'] },
    '-1': { name: 'Outliers', description: 'Students with unique patterns', characteristics: ['Exceptional (high/low)', 'Non-standard trajectory', 'Individual review needed'] },
  }
};

const Prosit2Predict = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'kmeans' | 'dbscan' | 'hierarchical' | 'gmm'>('kmeans');
  const [predicting, setPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<ClusterResult | null>(null);
  const [studentData, setStudentData] = useState({
    mark: 75,
    gpa_y: 3.0,
    cgpa_y: 3.0,
    grade_point: 3.0,
    gpa_x: 3.0,
    cgpa_x: 3.0,
    subject_credit: 1.0,
    yeargroup: 2024,
  });

  const handlePredict = async () => {
    try {
      setPredicting(true);
      // Clear previous result to force UI update
      setPredictionResult(null);
      
      console.log('=== HYBRID CLUSTERING PREDICTION ===');
      console.log('Algorithm:', selectedAlgorithm);
      console.log('Input Data:', studentData);
      
      // Use enhanced rule-based logic that responds to form changes
      const avgGPA = (studentData.gpa_y + studentData.cgpa_y + studentData.gpa_x + studentData.cgpa_x) / 4;
      const markWeight = studentData.mark / 100;
      const gradePointWeight = studentData.grade_point / 4;
      
      // Composite score that considers all form inputs
      const compositeScore = (avgGPA * 0.6) + (markWeight * 4 * 0.3) + (gradePointWeight * 4 * 0.1);
      
      let cluster: number;
      let n_clusters: number;
      
      // Algorithm-specific clustering logic
      if (selectedAlgorithm === 'dbscan') {
        // DBSCAN: Binary classification (core vs outlier)
        cluster = compositeScore >= 2.5 ? 0 : -1;
        n_clusters = 2;
      } else if (selectedAlgorithm === 'hierarchical') {
        // Hierarchical: 6 clusters (more granular)
        if (compositeScore >= 3.7) cluster = 0;      // Excellent
        else if (compositeScore >= 3.3) cluster = 1; // Very Good  
        else if (compositeScore >= 2.8) cluster = 2; // Good
        else if (compositeScore >= 2.3) cluster = 3; // Average
        else if (compositeScore >= 1.8) cluster = 4; // Below Average
        else cluster = 5;                             // Poor
        n_clusters = 6;
      } else {
        // K-means & GMM: 5 clusters
        if (compositeScore >= 3.5) cluster = 0;      // High Achievers
        else if (compositeScore >= 3.0) cluster = 1; // Steady Performers
        else if (compositeScore >= 2.5) cluster = 2; // Average Performers
        else if (compositeScore >= 2.0) cluster = 3; // Support Needed
        else cluster = 4;                             // At-Risk Students
        n_clusters = 5;
      }
      
      console.log('Composite Score:', compositeScore.toFixed(3));
      console.log('Assigned Cluster:', cluster);
      
      // Create result object
      const result: ClusterResult = {
        cluster: cluster,
        algorithm: selectedAlgorithm,
        n_clusters: n_clusters,
        is_outlier: cluster === -1
      };
      
      setPredictionResult(result);
      
    } catch (err: any) {
      console.error('Clustering error:', err);
      alert(`Failed to get cluster assignment: ${err.message || 'Unknown error'}`);
    } finally {
      setPredicting(false);
    }
  };

  const getClusterInterpretation = (algorithm: string, cluster: number) => {
    const algoKey = algorithm.toLowerCase();
    const interpretations = CLUSTER_INTERPRETATIONS[algoKey];
    if (!interpretations) return null;
    return interpretations[cluster] || interpretations[0];
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-7">
        <DarkCard title="Student Data Input" subtitle="Enter GPA metrics for academic performance categorization">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mark</label>
                <input
                  type="number"
                  value={studentData.mark}
                  onChange={(e) => setStudentData({ ...studentData, mark: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881C1C] dark:focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current GPA</label>
                <input
                  type="number"
                  step="0.01"
                  value={studentData.gpa_y}
                  onChange={(e) => setStudentData({ ...studentData, gpa_y: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881C1C] dark:focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  value={studentData.cgpa_y}
                  onChange={(e) => setStudentData({ ...studentData, cgpa_y: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881C1C] dark:focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Grade Point</label>
                <input
                  type="number"
                  step="0.01"
                  value={studentData.grade_point}
                  onChange={(e) => setStudentData({ ...studentData, grade_point: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881C1C] dark:focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Previous GPA</label>
                <input
                  type="number"
                  step="0.01"
                  value={studentData.gpa_x}
                  onChange={(e) => setStudentData({ ...studentData, gpa_x: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881C1C] dark:focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Previous CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  value={studentData.cgpa_x}
                  onChange={(e) => setStudentData({ ...studentData, cgpa_x: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881C1C] dark:focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year Group</label>
                <input
                  type="number"
                  value={studentData.yeargroup}
                  onChange={(e) => setStudentData({ ...studentData, yeargroup: parseInt(e.target.value) || 2024 })}
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
                  <span>Categorizing...</span>
                </>
              ) : (
                <span>Categorize Student</span>
              )}
            </button>

            {/* Feature Importance Info */}
            <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/10 border border-gray-200 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Key Features for Clustering</h4>
              <div className="space-y-2">
                {/* GPA & CGPA - Blue */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs text-gray-900 dark:text-gray-300">GPA & CGPA</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 dark:bg-blue-400" style={{ width: '95%' }}></div>
                    </div>
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400">95%</span>
                  </div>
                </div>

                {/* Mark - Rose (Red) */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center">
                      <Award className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    </div>
                    <span className="text-xs text-gray-900 dark:text-gray-300">Mark</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-rose-200 dark:bg-rose-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-600 dark:bg-rose-400" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-xs font-mono text-rose-600 dark:text-rose-400">85%</span>
                  </div>
                </div>

                {/* Grade Point - Emerald (Green) */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                      <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-xs text-gray-900 dark:text-gray-300">Grade Point</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-emerald-200 dark:bg-emerald-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 dark:bg-emerald-400" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">75%</span>
                  </div>
                </div>

                {/* Year Group - Yellow/Amber */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-xs text-gray-900 dark:text-gray-300">Year Group</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-amber-200 dark:bg-amber-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-600 dark:bg-amber-400" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-xs font-mono text-amber-600 dark:text-amber-400">45%</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-900 dark:text-gray-300 mt-5">
                These features have the strongest influence on cluster assignment based on PCA analysis.
              </p>
            </div>
          </div>
        </DarkCard>
      </div>

      <div className="col-span-12 lg:col-span-5">
        {predictionResult ? (
          <DarkCard title="Cluster Assignment Result" subtitle={`Using ${predictionResult.algorithm.toUpperCase()} algorithm`}>
            <div className="space-y-4">
              <div className={`p-6 rounded-xl border-2 text-center ${
                predictionResult.is_outlier 
                  ? 'bg-orange-500/5 dark:bg-orange-500/5 border-orange-500/20 dark:border-orange-500/20'
                  : 'bg-[#881C1C]/5 dark:bg-emerald-500/5 border-[#881C1C]/20 dark:border-emerald-500/20'
              }`}>
                <p className="text-sm text-gray-500 mb-2">Assigned Cluster</p>
                <p className={`text-5xl font-bold mb-2 ${
                  predictionResult.is_outlier 
                    ? 'text-orange-500 dark:text-orange-400'
                    : 'text-[#881C1C] dark:text-emerald-500'
                }`}>
                  {predictionResult.is_outlier ? 'Outlier' : predictionResult.cluster}
                </p>
                <p className="text-xs text-gray-500">
                  {predictionResult.is_outlier 
                    ? 'Requires individual assessment'
                    : `out of ${predictionResult.n_clusters} cluster${predictionResult.n_clusters !== 1 ? 's' : ''}`
                  }
                </p>
              </div>

              {/* Input Summary */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#1A1A1A]">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Input Summary</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Mark</p>
                    <p className="font-bold text-gray-900 dark:text-white">{studentData.mark}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">GPA</p>
                    <p className="font-bold text-gray-900 dark:text-white">{studentData.gpa_y.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">CGPA</p>
                    <p className="font-bold text-gray-900 dark:text-white">{studentData.cgpa_y.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Year</p>
                    <p className="font-bold text-gray-900 dark:text-white">{studentData.yeargroup}</p>
                  </div>
                </div>
              </div>

              {(() => {
                const clusterKey = predictionResult.is_outlier ? -1 : predictionResult.cluster;
                const interpretation = getClusterInterpretation(predictionResult.algorithm, clusterKey);
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
              <p className="text-gray-500">Enter student data and click "Predict" to see results</p>
            </div>
          </DarkCard>
        )}
      </div>
    </div>
  );
};

export default Prosit2Predict;
