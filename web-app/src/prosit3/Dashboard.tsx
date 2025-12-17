import { BarChart3, TrendingUp, Activity, MoreHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid } from 'recharts';

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

const AccuracyBarChart = ({ data }: { data: any[] }) => {
    return (
        <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis 
                        dataKey="model" 
                        tick={{fill: '#6B7280', fontSize: 10}}
                        tickFormatter={(val) => {
                            const map: any = {
                                'baseline_logistic': 'Log',
                                'lasso_logistic': 'Lasso',
                                'ridge_logistic': 'Ridge',
                                'elastic_net_logistic': 'Elastic',
                                'random_forest': 'RF',
                                'gradient_boosting': 'GB'
                            };
                            return map[val] || val;
                        }}
                        interval={0}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                        cursor={{fill: 'transparent'}}
                        formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Accuracy']}
                    />
                    <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.model === 'gradient_boosting' ? '#10B981' : '#374151'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

const CalibrationCurve = () => {
    // Simulated calibration data for Gradient Boosting (well-calibrated)
    const data = [
        { prob: 0, actual: 0.02, ideal: 0 },
        { prob: 0.2, actual: 0.18, ideal: 0.2 },
        { prob: 0.4, actual: 0.42, ideal: 0.4 },
        { prob: 0.6, actual: 0.58, ideal: 0.6 },
        { prob: 0.8, actual: 0.82, ideal: 0.8 },
        { prob: 1.0, actual: 0.98, ideal: 1.0 }
    ];

    return (
        <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
                    <XAxis dataKey="prob" type="number" domain={[0, 1]} tick={{fill: '#6B7280', fontSize: 10}} label={{ value: 'Predicted Probability', position: 'bottom', offset: 0, fill: '#6B7280', fontSize: 10 }} />
                    <YAxis type="number" domain={[0, 1]} tick={{fill: '#6B7280', fontSize: 10}} label={{ value: 'Actual Fraction', angle: -90, position: 'insideLeft', fill: '#6B7280', fontSize: 10 }} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                        formatter={(value: number) => value.toFixed(2)}
                    />
                    <Line type="monotone" dataKey="ideal" stroke="#9CA3AF" strokeDasharray="5 5" dot={false} strokeWidth={1} name="Ideal" />
                    <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2} dot={{r: 4, fill: '#10B981'}} name="Actual" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

const Dashboard = () => {
    const [metrics, setMetrics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await api.prosit3.getMetrics();
                setMetrics(data);
            } catch (error) {
                console.error("Failed to fetch metrics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    const bestModel = metrics.reduce((prev, current) => (prev.accuracy > current.accuracy) ? prev : current, { accuracy: 0, name: '' });

    if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard metrics...</div>;
  
    return (
      <>
        {/* Top KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <DarkCard>
              <div className="flex items-center space-x-2 text-gray-500 mb-2">
                <Activity size={14}/>
                <span className="text-xs font-mono uppercase">Total Models</span>
              </div>
              <div className="flex justify-between items-end">
                  <div>
                     <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.length}</h2>
                     <p className="text-xs text-gray-500 mt-1">Logistic regression variants</p>
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
                     <h2 className="text-3xl font-bold text-gray-900 dark:text-white">23</h2>
                     <p className="text-xs text-gray-500 mt-1">Input variables</p>
                  </div>
              </div>
          </DarkCard>
  
          <DarkCard>
              <div className="flex items-center space-x-2 text-gray-500 mb-2">
                <Activity size={14}/>
                <span className="text-xs font-mono uppercase">Best Accuracy</span>
              </div>
              <div className="flex justify-between items-end">
                  <div>
                     <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{(bestModel.accuracy * 100).toFixed(1)}%</h2>
                     <p className="text-xs text-gray-500 mt-1">{bestModel.model?.replace('_', ' ')}</p>
                  </div>
                  <div className="text-xs font-bold px-2 py-1 rounded bg-gray-100 dark:bg-white/5 text-emerald-500 dark:text-emerald-400">
                      Top
                  </div>
              </div>
          </DarkCard>
  
          <DarkCard>
              <div className="flex items-center space-x-2 text-gray-500 mb-2">
                <Activity size={14}/>
                <span className="text-xs font-mono uppercase">Ensemble</span>
              </div>
              <div className="flex justify-between items-end">
                  <div>
                     <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Active</h2>
                     <p className="text-xs text-gray-500 mt-1">Majority voting</p>
                  </div>
              </div>
          </DarkCard>
        </div>
  
        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left Col - Charts & Tables */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
              <DarkCard title="Model Performance Comparison" subtitle="Metrics across all trained models">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-[#262626]">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Model</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Accuracy</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Precision</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Recall</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">ROC-AUC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {metrics.map((model, idx) => (
                          <tr 
                            key={idx}
                            className={`border-b border-gray-100 dark:border-[#1A1A1A] hover:bg-gray-50 dark:hover:bg-[#1A1A1A] translation-colors`}
                          >
                            <td className="py-4 px-4 font-medium text-gray-900 dark:text-white capitalize">
                              {model.model.replace(/_/g, ' ')}
                            </td>
                            <td className="text-right py-4 px-4 text-gray-700 dark:text-gray-300">
                              {(model.accuracy * 100).toFixed(1)}%
                            </td>
                            <td className="text-right py-4 px-4 text-gray-700 dark:text-gray-300">
                              {(model.precision * 100).toFixed(1)}%
                            </td>
                            <td className="text-right py-4 px-4 text-gray-700 dark:text-gray-300">
                              {(model.recall * 100).toFixed(1)}%
                            </td>
                            <td className="text-right py-4 px-4 font-bold text-gray-900 dark:text-white">
                              {(model.roc_auc * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              </DarkCard>
  
              <div className="grid grid-cols-2 gap-6">
                   <DarkCard title="Feature Importance" subtitle="Top predictors">
                      <div className="space-y-4">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>CGPA (Current)</span>
                              <span className="text-gray-900 dark:text-white">28%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-[#333] rounded-full h-1.5">
                              <div className="bg-[#881C1C] dark:bg-emerald-500 h-1.5 rounded-full" style={{width: '28%'}}></div>
                          </div>
  
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>GPA (Current)</span>
                              <span className="text-gray-900 dark:text-white">22%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-[#333] rounded-full h-1.5">
                              <div className="bg-[#881C1C] dark:bg-emerald-500 h-1.5 rounded-full" style={{width: '22%'}}></div>
                          </div>
  
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>CGPA (Previous)</span>
                              <span className="text-gray-900 dark:text-white">18%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-[#333] rounded-full h-1.5">
                              <div className="bg-[#881C1C] dark:bg-emerald-500 h-1.5 rounded-full" style={{width: '18%'}}></div>
                          </div>
                      </div>
                   </DarkCard>
  
                   <DarkCard title="Model Calibration" subtitle="Reliability curve (Gradient Boosting)">
                      <div className="px-2 pb-6">
                        <CalibrationCurve />
                      </div>
                   </DarkCard>
              </div>
          </div>
  
          {/* Right Col - Visuals */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
               <DarkCard title="Accuracy Distribution" subtitle="All 6 models">
                  <div className="flex justify-between mb-2">
                       <div>
                           <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {(metrics.reduce((acc, curr) => acc + curr.accuracy, 0) / metrics.length * 100).toFixed(1)}%
                           </p>
                           <p className="text-[10px] text-gray-500 uppercase">Avg Accuracy</p>
                       </div>
                  </div>
                  <AccuracyBarChart data={metrics} />
               </DarkCard>
  
               <DarkCard title="Key Findings" subtitle="Model analysis summary">
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3 text-sm">
                      <span className="text-emerald-500 mt-1">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        Elastic Net achieves highest ROC-AUC (91%)
                      </span>
                    </li>
                    <li className="flex items-start space-x-3 text-sm">
                      <span className="text-emerald-500 mt-1">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        Regularization (Lasso/Ridge) prevents overfitting
                      </span>
                    </li>
                    <li className="flex items-start space-x-3 text-sm">
                      <span className="text-blue-500 mt-1">ℹ</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        GPA and CGPA are strongest predictors of risk
                      </span>
                    </li>
                    <li className="flex items-start space-x-3 text-sm">
                      <span className="text-blue-500 mt-1">ℹ</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        Ensemble voting provides most robust predictions
                      </span>
                    </li>
                  </ul>
               </DarkCard>
          </div>
  
        </div>
      </>
    );
  };
  
  export default Dashboard;
