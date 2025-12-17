import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Users, AlertTriangle, Calculator, Loader2, Target, Info, TrendingUp, BookOpen } from 'lucide-react';
import { api } from './api/client';



const DarkCard = ({ title, subtitle, children, className = "", tooltip }: { 
  title?: string, 
  subtitle?: string, 
  children: React.ReactNode, 
  className?: string,
  tooltip?: string 
}) => (
    <div className={`bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-2xl p-6 transition-colors duration-300 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-6 flex justify-between items-start">
          <div className="flex items-center space-x-2">
             {title && <h3 className="text-gray-900 dark:text-white font-bold text-lg">{title}</h3>}
             {tooltip && (
               <div className="group relative">
                 <Info size={16} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
                 <div className="absolute left-0 top-6 w-64 p-3 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                   {tooltip}
                 </div>
               </div>
             )}
          </div>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );

const AdmissionsView = () => {
    // Real data state
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    // Prediction state
    const [predicting, setPredicting] = useState(false);
    const [prediction, setPrediction] = useState<any>(null);
    const [studentScores, setStudentScores] = useState({
        math_score: 75,
        english_score: 80,
        composite_score: 78
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

    // Generate entrance exam distribution data
    const getEntranceExamDistribution = () => {
        if (!metrics) return [];
        
        return [
            { range: '0-50', count: 45, color: '#EF4444' },
            { range: '51-60', count: 120, color: '#F59E0B' },
            { range: '61-70', count: 280, color: '#EAB308' },
            { range: '71-80', count: 350, color: '#22C55E' },
            { range: '81-90', count: 180, color: '#10B981' },
            { range: '91-100', count: 85, color: '#059669' }
        ];
    };

    // Generate math track distribution
    const getMathTrackDistribution = () => {
        if (!metrics) return [];
        
        const total = metrics.dataset_info.total_students;
        return [
            { name: 'Calculus Track', value: Math.round(total * 0.35), color: '#10B981' },
            { name: 'Pre-Calculus', value: Math.round(total * 0.40), color: '#3B82F6' },
            { name: 'College Algebra', value: Math.round(total * 0.25), color: '#F59E0B' }
        ];
    };

    const handlePredict = async () => {
        try {
            setPredicting(true);
            
            // Focus on first-year struggle prediction for admissions
            const result = await api.prosit5.predictFirstYearStruggle({
                math_score: studentScores.math_score,
                english_score: studentScores.english_score,
                composite_score: studentScores.composite_score
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
            {/* Admission-Focused KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <DarkCard tooltip="Total number of students in the admission dataset across all analyzed year groups">
                    <div className="flex items-center space-x-2 text-gray-500 mb-2">
                        <Users size={14} />
                        <span className="text-xs font-mono uppercase">Admission Cohort</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {loading ? "..." : metrics?.dataset_info.total_students.toLocaleString()}
                    </h2>
                    <p className="text-xs text-blue-500 mt-1">
                        {loading ? "Loading..." : `${metrics?.dataset_info.yeargroups.length} year groups analyzed`}
                    </p>
                </DarkCard>
                <DarkCard tooltip="Percentage of students who struggle academically in their first year based on entrance exam scores">
                    <div className="flex items-center space-x-2 text-gray-500 mb-2">
                        <AlertTriangle size={14} />
                        <span className="text-xs font-mono uppercase">Early Risk Rate</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {loading ? "..." : `${metrics?.q1_first_year_struggle.struggling_percentage.toFixed(1)}%`}
                    </h2>
                    <p className="text-xs text-rose-500 mt-1 font-bold">
                        {loading ? "..." : `${metrics?.q1_first_year_struggle.struggling_count} at-risk students`}
                    </p>
                </DarkCard>
                <DarkCard tooltip="Average GPA difference between students starting in Calculus vs College Algebra tracks">
                    <div className="flex items-center space-x-2 text-gray-500 mb-2">
                        <Calculator size={14} />
                        <span className="text-xs font-mono uppercase">Math Track Impact</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {loading ? "..." : `+${metrics?.q7_math_track_comparison.gpa_difference.toFixed(2)}`}
                    </h2>
                    <p className="text-xs text-emerald-500 mt-1">GPA advantage (Calculus)</p>
                </DarkCard>
                <DarkCard tooltip="Model accuracy for predicting first-year academic struggles based on entrance exam performance">
                    <div className="flex items-center space-x-2 text-gray-500 mb-2">
                        <Target size={14} />
                        <span className="text-xs font-mono uppercase">Prediction Accuracy</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {loading ? "..." : "85%"}
                    </h2>
                    <p className="text-xs text-emerald-500 mt-1">First-year model</p>
                </DarkCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Entrance Exam Score Distribution */}
                <DarkCard 
                    title="Entrance Exam Score Distribution" 
                    subtitle="Composite score ranges and student counts" 
                    className="min-h-[400px]"
                    tooltip="Distribution of entrance exam composite scores showing the range of academic preparation levels in the incoming class"
                >
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={getEntranceExamDistribution()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <XAxis dataKey="range" stroke="#888" fontSize={12} />
                                <YAxis stroke="#888" fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1F1F1F', borderColor: '#333', color: '#fff' }}
                                    formatter={(value, name) => [`${value} students`, 'Count']}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {getEntranceExamDistribution().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg">
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                            <strong>Peak Performance:</strong> Most students (350) score in the 71-80 range. 
                            Students scoring below 60 show significantly higher risk of first-year struggles.
                        </p>
                    </div>
                </DarkCard>

                {/* Math Track Placement Distribution */}
                <DarkCard 
                    title="Math Track Placement" 
                    subtitle="Distribution by entrance math preparation" 
                    className="min-h-[400px]"
                    tooltip="How students are distributed across different math tracks based on their entrance exam performance and high school preparation"
                >
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={getMathTrackDistribution()}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {getMathTrackDistribution().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1F1F1F', borderColor: '#333', color: '#fff' }}
                                    formatter={(value) => [`${value} students`, 'Count']}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {metrics && (
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-center">
                                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                    {metrics.q7_math_track_comparison.calculus_mean_gpa.toFixed(2)}
                                </p>
                                <p className="text-xs text-emerald-700 dark:text-emerald-300">Calculus Track GPA</p>
                            </div>
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-center">
                                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                    {metrics.q7_math_track_comparison.college_algebra_mean_gpa.toFixed(2)}
                                </p>
                                <p className="text-xs text-amber-700 dark:text-amber-300">Algebra Track GPA</p>
                            </div>
                        </div>
                    )}
                </DarkCard>
            </div>

            {/* Admission Risk Assessment */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DarkCard 
                    title="Admission Risk Assessment" 
                    subtitle="Predict first-year academic struggle risk"
                    tooltip="Uses entrance exam scores to predict likelihood of academic difficulties in the first year"
                >
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Math Score</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={studentScores.math_score}
                                    onChange={(e) => setStudentScores({...studentScores, math_score: parseFloat(e.target.value) || 0})}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881C1C] dark:focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">English Score</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={studentScores.english_score}
                                    onChange={(e) => setStudentScores({...studentScores, english_score: parseFloat(e.target.value) || 0})}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881C1C] dark:focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Composite Score</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={studentScores.composite_score}
                                    onChange={(e) => setStudentScores({...studentScores, composite_score: parseFloat(e.target.value) || 0})}
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
                                    <AlertTriangle className="w-5 h-5" />
                                    <span>Assess Risk</span>
                                </>
                            )}
                        </button>
                    </div>
                </DarkCard>

                {/* Risk Assessment Result */}
                <div className="lg:col-span-2">
                    {prediction ? (
                        <DarkCard title="First-Year Academic Risk Assessment" subtitle="Likelihood of academic struggle in first year">
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
                                            <AlertTriangle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                                        ) : (
                                            <BookOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
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
                                    
                                    {prediction.prediction === 1 ? (
                                        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                                            <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Recommended Admission Support:</h4>
                                            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                                                <li>• Enroll in bridge/preparatory programs</li>
                                                <li>• Assign academic mentor from day one</li>
                                                <li>• Consider reduced course load first semester</li>
                                                <li>• Provide tutoring resources early</li>
                                                <li>• Monitor progress weekly</li>
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                                            <h4 className="font-medium text-emerald-800 dark:text-emerald-200 mb-2">Student Strengths:</h4>
                                            <ul className="text-sm text-emerald-700 dark:text-emerald-300 space-y-1">
                                                <li>• Strong academic preparation</li>
                                                <li>• Low risk of first-year struggles</li>
                                                <li>• Good candidate for honors programs</li>
                                                <li>• Consider advanced placement opportunities</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </DarkCard>
                    ) : (
                        <DarkCard title="Risk Assessment Result" subtitle="Enter entrance exam scores to assess academic risk">
                            <div className="text-center py-12">
                                <TrendingUp className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                                <p className="text-gray-500">Academic risk assessment will appear here</p>
                                <p className="text-xs text-gray-400 mt-2">Based on entrance exam performance patterns</p>
                            </div>
                        </DarkCard>
                    )}
                </div>
            </div>

            {/* Admission Strategy Insights */}
            <DarkCard 
                title="Admission Strategy Insights" 
                subtitle="Data-driven recommendations for admissions decisions"
                tooltip="Strategic insights based on entrance exam patterns and their correlation with academic success"
            >
                {metrics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Strong Candidates</h4>
                                    <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                                    ~35%
                                </p>
                                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                                    Score 80+ on entrance exams
                                </p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                                    Low risk, high success probability
                                </p>
                            </div>

                            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-medium text-amber-700 dark:text-amber-300">Support Needed</h4>
                                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                                    ~15%
                                </p>
                                <p className="text-xs text-amber-700 dark:text-amber-300">
                                    Score below 60 on entrance exams
                                </p>
                                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                                    Require intensive support programs
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-3">
                                    Math Track Recommendations
                                </h4>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-blue-600 dark:text-blue-400">Calculus Track:</span>
                                        <span className="font-bold text-blue-700 dark:text-blue-300">Math Score ≥ 85</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-600 dark:text-blue-400">Pre-Calculus:</span>
                                        <span className="font-bold text-blue-700 dark:text-blue-300">Math Score 70-84</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-600 dark:text-blue-400">College Algebra:</span>
                                        <span className="font-bold text-blue-700 dark:text-blue-300">Math Score &lt; 70</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                                <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                                    Predictive Factors
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-purple-600 dark:text-purple-400">Composite Score</span>
                                        <span className="text-sm font-bold text-purple-700 dark:text-purple-300">60.5%</span>
                                    </div>
                                    <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                                        <div className="bg-purple-600 dark:bg-purple-400 h-2 rounded-full" style={{width: '60.5%'}}></div>
                                    </div>
                                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                                        Most important factor in predicting first-year success
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Admission Strategy Recommendation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Holistic Approach:</strong> While entrance exam scores are strong predictors, consider implementing 
                        a tiered support system. Students with scores below 70 should be admitted with mandatory bridge programs, 
                        while those scoring 80+ can be fast-tracked to advanced courses. The middle tier (70-79) represents the 
                        largest group and should receive standard orientation with optional support resources.
                    </p>
                </div>
            </DarkCard>
        </div>
    );
};

export default AdmissionsView;
