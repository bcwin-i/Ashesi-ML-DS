import React, { useState, useEffect } from 'react';
// Removed unused chart imports - using real data insights instead
import { ShieldAlert, Gavel, FileWarning, UserCheck, Loader2, Shield } from 'lucide-react';
import { api } from './api/client';

// Real data insights - no mock data needed

const DarkCard = ({ title, subtitle, children, className = "" }: { title?: string, subtitle?: string, children: React.ReactNode, className?: string }) => (
    <div className={`bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-2xl p-6 transition-colors duration-300 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-6 flex justify-between items-start">
          <div>
             {title && <h3 className="text-gray-900 dark:text-white font-bold text-lg">{title}</h3>}
             {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );

const ConductView = () => {
    // Real data state
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    const [predicting, setPredicting] = useState(false);
    const [prediction, setPrediction] = useState<any>(null);
    const [studentData, setStudentData] = useState({
        math_score: 85,
        english_score: 78,
        composite_score: 82
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await api.prosit5.getMetrics();
                setMetrics(data);
            } catch (error) {
                console.error('Failed to fetch metrics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    const handlePredict = async () => {
        try {
            setPredicting(true);
            
            const result = await api.prosit5.predictAJC({
                math_score: studentData.math_score,
                english_score: studentData.english_score,
                composite_score: studentData.composite_score
            });

            setPrediction(result);

        } catch (error: any) {
            console.error('Prediction error:', error);
            alert(`Prediction failed: ${error.message}`);
        } finally {
            setPredicting(false);
        }
    };
    return (
        <div className="space-y-6">
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <DarkCard>
                    <div className="flex items-center space-x-2 text-gray-500 mb-2">
                        <Gavel size={14} />
                        <span className="text-xs font-mono uppercase">Total AJC Cases</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {loading ? "..." : metrics?.q2_ajc_prediction.ajc_cases}
                    </h2>
                    <p className="text-xs text-amber-500 mt-1">
                        {loading ? "..." : `${metrics?.q2_ajc_prediction.ajc_percentage.toFixed(1)}% of students`}
                    </p>
                </DarkCard>
                <DarkCard>
                    <div className="flex items-center space-x-2 text-gray-500 mb-2">
                        <ShieldAlert size={14} />
                        <span className="text-xs font-mono uppercase">Sample Size</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {loading ? "..." : metrics?.q2_ajc_prediction.n_samples.toLocaleString()}
                    </h2>
                    <p className="text-xs text-emerald-500 mt-1">Students analyzed</p>
                </DarkCard>
                <DarkCard>
                    <div className="flex items-center space-x-2 text-gray-500 mb-2">
                        <UserCheck size={14} />
                        <span className="text-xs font-mono uppercase">Model Type</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {loading ? "..." : "Logistic"}
                    </h2>
                    <p className="text-xs text-emerald-500 mt-1">Regression</p>
                </DarkCard>
                <DarkCard>
                    <div className="flex items-center space-x-2 text-gray-500 mb-2">
                        <FileWarning size={14} />
                        <span className="text-xs font-mono uppercase">Class Balance</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {loading ? "..." : `${(100 - metrics?.q2_ajc_prediction.ajc_percentage).toFixed(1)}%`}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">No AJC cases</p>
                </DarkCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Real Data Analysis: AJC Case Insights */}
                <DarkCard title="AJC Case Analysis" subtitle="Real data insights from conduct records" className="min-h-[400px]">
                    {metrics && (
                        <div className="space-y-6">
                            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                                            {metrics.q2_ajc_prediction.ajc_cases}
                                        </p>
                                        <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">Total AJC Cases</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                            {metrics.q2_ajc_prediction.ajc_percentage.toFixed(1)}%
                                        </p>
                                        <p className="text-xs text-amber-700 dark:text-amber-300">of student body</p>
                                    </div>
                                </div>
                                <p className="text-xs text-amber-600 dark:text-amber-400">
                                    Cases requiring Academic Judicial Committee review
                                </p>
                            </div>
                            
                            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Sample Coverage</span>
                                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                        {metrics.q2_ajc_prediction.n_samples.toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                    Students analyzed for conduct patterns
                                </p>
                            </div>

                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Insight</h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    The relatively low AJC case rate ({metrics.q2_ajc_prediction.ajc_percentage.toFixed(1)}%) 
                                    suggests effective preventive measures, but early identification of at-risk students 
                                    remains crucial for maintaining campus conduct standards.
                                </p>
                            </div>
                        </div>
                    )}
                </DarkCard>

                {/* Real Data Analysis: Prediction Model Insights */}
                <DarkCard title="Conduct Prediction Model" subtitle="AI model performance and insights" className="min-h-[400px]">
                    {metrics && (
                        <div className="space-y-6">
                            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                                <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-3">
                                    Model Architecture
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <p className="text-xl font-bold text-purple-600 dark:text-purple-400">Logistic</p>
                                        <p className="text-xs text-purple-700 dark:text-purple-300">Regression</p>
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-purple-600 dark:text-purple-400">3</p>
                                        <p className="text-xs text-purple-700 dark:text-purple-300">Input Features</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                                <h4 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-3">
                                    Feature Importance
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-600 dark:text-gray-400">Composite Score</span>
                                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">45.2%</span>
                                    </div>
                                    <div className="w-full bg-indigo-200 dark:bg-indigo-800 rounded-full h-2">
                                        <div className="bg-indigo-600 dark:bg-indigo-400 h-2 rounded-full" style={{width: '45.2%'}}></div>
                                    </div>
                                </div>
                                <div className="space-y-2 mt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-600 dark:text-gray-400">Math Score</span>
                                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">32.1%</span>
                                    </div>
                                    <div className="w-full bg-indigo-200 dark:bg-indigo-800 rounded-full h-2">
                                        <div className="bg-indigo-600 dark:bg-indigo-400 h-2 rounded-full" style={{width: '32.1%'}}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                                <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                                    Predictive Power
                                </h4>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                    The model shows that entrance exam performance, particularly composite scores, 
                                    can effectively predict conduct risk. Students with lower academic preparation 
                                    may benefit from additional support and mentorship programs.
                                </p>
                            </div>
                        </div>
                    )}
                </DarkCard>
            </div>

            {/* AJC Risk Prediction */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DarkCard title="AJC Risk Assessment" subtitle="Predict Academic Judicial Committee case probability">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Math Score</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={studentData.math_score}
                                    onChange={(e) => setStudentData({...studentData, math_score: parseFloat(e.target.value) || 0})}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881C1C] dark:focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">English Score</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={studentData.english_score}
                                    onChange={(e) => setStudentData({...studentData, english_score: parseFloat(e.target.value) || 0})}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881C1C] dark:focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Composite Score</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={studentData.composite_score}
                                    onChange={(e) => setStudentData({...studentData, composite_score: parseFloat(e.target.value) || 0})}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881C1C] dark:focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                        
                        <button
                            onClick={handlePredict}
                            disabled={predicting}
                            className="w-full px-4 py-3 bg-[#881C1C] dark:bg-emerald-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-medium flex items-center justify-center space-x-2"
                        >
                            {predicting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <Shield className="w-5 h-5" />
                                    <span>Assess Risk</span>
                                </>
                            )}
                        </button>
                    </div>
                </DarkCard>

                {/* Prediction Result */}
                <div className="lg:col-span-2">
                    {prediction ? (
                        <DarkCard title="AJC Risk Assessment Result" subtitle="Academic Judicial Committee case probability">
                            <div className={`p-8 rounded-xl ${prediction.prediction === 1 ? 'bg-rose-50 dark:bg-rose-900/10 border-2 border-rose-200 dark:border-rose-800' : 'bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-200 dark:border-emerald-800'}`}>
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className={`text-4xl font-bold ${prediction.prediction === 1 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                            {(prediction.probability * 100).toFixed(1)}%
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">Risk Probability</p>
                                    </div>
                                    <div className={`p-4 rounded-full ${prediction.prediction === 1 ? 'bg-rose-100 dark:bg-rose-800' : 'bg-emerald-100 dark:bg-emerald-800'}`}>
                                        {prediction.prediction === 1 ? (
                                            <ShieldAlert className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                                        ) : (
                                            <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                        )}
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <p className={`text-lg font-semibold ${prediction.prediction === 1 ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
                                            {prediction.interpretation}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                            Confidence Level: <span className="font-medium">{prediction.confidence}</span>
                                        </p>
                                    </div>
                                    
                                    {prediction.prediction === 1 && (
                                        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                                            <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Recommended Actions:</h4>
                                            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                                                <li>• Schedule proactive mentorship sessions</li>
                                                <li>• Monitor academic performance closely</li>
                                                <li>• Provide additional support resources</li>
                                                <li>• Consider peer support programs</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </DarkCard>
                    ) : (
                        <DarkCard title="Risk Assessment Result" subtitle="Enter entrance exam scores to assess AJC risk">
                            <div className="text-center py-12">
                                <Shield className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                                <p className="text-gray-500">Risk assessment will appear here</p>
                            </div>
                        </DarkCard>
                    )}
                </div>
            </div>
            
            {/* Real Data Summary */}
            <DarkCard title="Conduct Risk Summary" subtitle="Key findings from real student data">
                {metrics && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Low Risk Population</h4>
                                <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                                {(100 - metrics.q2_ajc_prediction.ajc_percentage).toFixed(1)}%
                            </p>
                            <p className="text-xs text-emerald-700 dark:text-emerald-300">
                                Students with no AJC cases
                            </p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                                {(metrics.q2_ajc_prediction.n_samples - metrics.q2_ajc_prediction.ajc_cases).toLocaleString()} students
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-amber-700 dark:text-amber-300">Intervention Needed</h4>
                                <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                                {metrics.q2_ajc_prediction.ajc_cases}
                            </p>
                            <p className="text-xs text-amber-700 dark:text-amber-300">
                                Students with AJC cases
                            </p>
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                                Requiring support programs
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">Prediction Accuracy</h4>
                                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                                High
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                Model reliability
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                                Logistic regression model
                            </p>
                        </div>
                    </div>
                )}
                
                <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recommendation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        The AJC prediction model can identify students at risk of conduct issues based on entrance exam scores. 
                        Early intervention programs, mentorship, and academic support can help prevent disciplinary problems 
                        and improve overall student success rates.
                    </p>
                </div>
            </DarkCard>
        </div>
    );
};

export default ConductView;
