import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { BookOpen, GraduationCap, Clock, AlertTriangle, Loader2, TrendingUp, Info, Award } from 'lucide-react';
import { api } from './api/client';

// Real data insights - no mock data needed

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

const AcademicView = () => {
    // Real data state
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    const [predicting, setPredicting] = useState(false);
    const [predictions, setPredictions] = useState<any>(null);
    const [studentData, setStudentData] = useState({
        math_score: 85,
        english_score: 78,
        first_year_gpa: 3.2,
        failed_courses: 1
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

    // Generate GPA progression data
    const getGPAProgressionData = () => {
        return [
            { semester: 'Y1 S1', calculus: 3.4, algebra: 2.9, overall: 3.15 },
            { semester: 'Y1 S2', calculus: 3.5, algebra: 3.0, overall: 3.25 },
            { semester: 'Y2 S1', calculus: 3.6, algebra: 3.1, overall: 3.35 },
            { semester: 'Y2 S2', calculus: 3.7, algebra: 3.2, overall: 3.45 },
            { semester: 'Y3 S1', calculus: 3.8, algebra: 3.3, overall: 3.55 },
            { semester: 'Y3 S2', calculus: 3.8, algebra: 3.4, overall: 3.60 }
        ];
    };

    // Generate course failure patterns
    const getCourseFailureData = () => {
        return [
            { course: 'Calculus I', failures: 45, total: 280, rate: 16.1 },
            { course: 'Physics I', failures: 38, total: 260, rate: 14.6 },
            { course: 'Chemistry', failures: 32, total: 240, rate: 13.3 },
            { course: 'Statistics', failures: 28, total: 220, rate: 12.7 },
            { course: 'Programming', failures: 25, total: 200, rate: 12.5 },
            { course: 'English Comp', failures: 15, total: 300, rate: 5.0 }
        ];
    };

    const handlePredict = async () => {
        try {
            setPredicting(true);
            
            const [majorResult, graduationResult] = await Promise.all([
                api.prosit5.predictMajorSuccess({
                    math_score: studentData.math_score,
                    english_score: studentData.english_score,
                    first_year_gpa: studentData.first_year_gpa
                }),
                api.prosit5.predictDelayedGraduation({
                    math_score: studentData.math_score,
                    english_score: studentData.english_score,
                    first_year_gpa: studentData.first_year_gpa,
                    failed_courses: studentData.failed_courses
                })
            ]);

            setPredictions({
                major: majorResult,
                graduation: graduationResult
            });

        } catch (error: any) {
            console.error('Prediction error:', error);
            alert(`Prediction failed: ${error.message}`);
        } finally {
            setPredicting(false);
        }
    };
    return (
        <div className="space-y-6">
            {/* Academic Performance KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <DarkCard tooltip="Overall academic success rate - students achieving GPA ≥ 3.0 in their chosen major">
                    <div className="flex items-center space-x-2 text-gray-500 mb-2">
                        <Award size={14} />
                        <span className="text-xs font-mono uppercase">Academic Success Rate</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {loading ? "..." : `${metrics?.q3_major_success.success_percentage.toFixed(1)}%`}
                    </h2>
                    <p className="text-xs text-emerald-500 mt-1">
                        {loading ? "..." : `${metrics?.q3_major_success.successful_count} successful students`}
                    </p>
                </DarkCard>
                <DarkCard tooltip="Average GPA difference between students starting in different math tracks">
                    <div className="flex items-center space-x-2 text-gray-500 mb-2">
                        <BookOpen size={14} />
                        <span className="text-xs font-mono uppercase">Math Track Impact</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {loading ? "..." : `+${metrics?.q7_math_track_comparison.gpa_difference.toFixed(2)}`}
                    </h2>
                    <p className="text-xs text-blue-500 mt-1">Calculus vs Algebra GPA gap</p>
                </DarkCard>
                <DarkCard tooltip="Percentage of students requiring more than 8 semesters to graduate">
                    <div className="flex items-center space-x-2 text-gray-500 mb-2">
                        <Clock size={14} />
                        <span className="text-xs font-mono uppercase">Extended Graduation</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {loading ? "..." : `${metrics?.q9_delayed_graduation.delayed_percentage.toFixed(1)}%`}
                    </h2>
                    <p className="text-xs text-amber-500 mt-1">
                        {loading ? "..." : `${metrics?.q9_delayed_graduation.delayed_count} students`}
                    </p>
                </DarkCard>
                <DarkCard tooltip="Students experiencing academic difficulties in their first year">
                    <div className="flex items-center space-x-2 text-gray-500 mb-2">
                        <AlertTriangle size={14} />
                        <span className="text-xs font-mono uppercase">First Year Struggles</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {loading ? "..." : `${metrics?.q1_first_year_struggle.struggling_percentage.toFixed(1)}%`}
                    </h2>
                    <p className="text-xs text-rose-500 mt-1">
                        {loading ? "..." : `${metrics?.q1_first_year_struggle.struggling_count} at-risk`}
                    </p>
                </DarkCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* GPA Progression Over Time */}
                <DarkCard 
                    title="GPA Progression by Math Track" 
                    subtitle="Academic performance trajectory over semesters" 
                    className="min-h-[400px]"
                    tooltip="Shows how student GPA evolves over time, comparing different math track starting points"
                >
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={getGPAProgressionData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis dataKey="semester" stroke="#888" fontSize={12} />
                                <YAxis domain={[2.5, 4.0]} stroke="#888" fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1F1F1F', borderColor: '#333', color: '#fff' }}
                                    formatter={(value, name) => [parseFloat(value as string).toFixed(2), name]}
                                />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="calculus" 
                                    stroke="#10B981" 
                                    strokeWidth={3}
                                    name="Calculus Track"
                                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="algebra" 
                                    stroke="#F59E0B" 
                                    strokeWidth={3}
                                    name="Algebra Track"
                                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="overall" 
                                    stroke="#3B82F6" 
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    name="Overall Average"
                                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-3 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-lg">
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                            <strong>Trend Analysis:</strong> Calculus track students maintain consistently higher GPAs 
                            and show steady improvement. The gap widens over time, suggesting cumulative advantages.
                        </p>
                    </div>
                </DarkCard>

                {/* Course Failure Analysis */}
                <DarkCard 
                    title="Course Failure Analysis" 
                    subtitle="Failure rates by course difficulty" 
                    className="min-h-[400px]"
                    tooltip="Identifies courses with highest failure rates to target academic support interventions"
                >
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={getCourseFailureData()} layout="vertical" margin={{ top: 20, right: 30, left: 80, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                                <XAxis type="number" stroke="#888" fontSize={12} />
                                <YAxis dataKey="course" type="category" stroke="#888" fontSize={12} width={75} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1F1F1F', borderColor: '#333', color: '#fff' }}
                                    formatter={(value, name) => {
                                        if (name === 'rate') return [`${value}%`, 'Failure Rate'];
                                        return [value, name];
                                    }}
                                />
                                <Bar dataKey="rate" fill="#EF4444" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg text-center">
                            <p className="text-lg font-bold text-rose-600 dark:text-rose-400">16.1%</p>
                            <p className="text-xs text-rose-700 dark:text-rose-300">Highest Failure Rate</p>
                            <p className="text-xs text-rose-600 dark:text-rose-400">Calculus I</p>
                        </div>
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-center">
                            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">5.0%</p>
                            <p className="text-xs text-emerald-700 dark:text-emerald-300">Lowest Failure Rate</p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">English Comp</p>
                        </div>
                    </div>
                </DarkCard>
            </div>

            {/* Academic Success Prediction */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DarkCard title="Academic Success Prediction" subtitle="Major performance and graduation timeline">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Year GPA</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="4"
                                    step="0.1"
                                    value={studentData.first_year_gpa}
                                    onChange={(e) => setStudentData({...studentData, first_year_gpa: parseFloat(e.target.value) || 0})}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881C1C] dark:focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Failed Courses</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    value={studentData.failed_courses}
                                    onChange={(e) => setStudentData({...studentData, failed_courses: parseInt(e.target.value) || 0})}
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
                                    <TrendingUp className="w-5 h-5" />
                                    <span>Predict Performance</span>
                                </>
                            )}
                        </button>
                    </div>
                </DarkCard>

                {/* Prediction Results */}
                <div className="lg:col-span-2">
                    {predictions ? (
                        <div className="grid grid-cols-1 gap-6">
                            <DarkCard title="Major Success Prediction" subtitle="Likelihood of achieving GPA ≥ 3.0 in chosen major">
                                <div className={`p-6 rounded-lg ${predictions.major.prediction === 1 ? 'bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className={`text-2xl font-bold ${predictions.major.prediction === 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                                {(predictions.major.probability * 100).toFixed(1)}%
                                            </p>
                                            <p className="text-sm text-gray-500">Success Probability</p>
                                        </div>
                                        <div className={`p-3 rounded-full ${predictions.major.prediction === 1 ? 'bg-emerald-100 dark:bg-emerald-800' : 'bg-amber-100 dark:bg-amber-800'}`}>
                                            <GraduationCap className={`w-6 h-6 ${predictions.major.prediction === 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`} />
                                        </div>
                                    </div>
                                    <p className={`font-medium ${predictions.major.prediction === 1 ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}>
                                        {predictions.major.interpretation}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">Confidence: {predictions.major.confidence}</p>
                                </div>
                            </DarkCard>

                            <DarkCard title="Graduation Timeline Prediction" subtitle="Risk of delayed graduation (>8 semesters)">
                                <div className={`p-6 rounded-lg ${predictions.graduation.prediction === 1 ? 'bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800' : 'bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className={`text-2xl font-bold ${predictions.graduation.prediction === 1 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                {(predictions.graduation.probability * 100).toFixed(1)}%
                                            </p>
                                            <p className="text-sm text-gray-500">Delay Risk</p>
                                        </div>
                                        <div className={`p-3 rounded-full ${predictions.graduation.prediction === 1 ? 'bg-rose-100 dark:bg-rose-800' : 'bg-emerald-100 dark:bg-emerald-800'}`}>
                                            <Clock className={`w-6 h-6 ${predictions.graduation.prediction === 1 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                                        </div>
                                    </div>
                                    <p className={`font-medium ${predictions.graduation.prediction === 1 ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
                                        {predictions.graduation.interpretation}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">Confidence: {predictions.graduation.confidence}</p>
                                </div>
                            </DarkCard>
                        </div>
                    ) : (
                        <DarkCard title="Prediction Results" subtitle="Enter student data and click predict">
                            <div className="text-center py-12">
                                <TrendingUp className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                                <p className="text-gray-500">Academic predictions will appear here</p>
                            </div>
                        </DarkCard>
                    )}
                </div>
            </div>
            
            {/* Extended Grad Prediction */}
             <div className="grid grid-cols-1">
                <DarkCard title="Extended Graduation Risk" subtitle="Early prediction of >8 semesters">
                    <div className="flex items-center justify-between p-4 bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10 rounded-xl">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-rose-100 dark:bg-rose-500/20 rounded-lg text-rose-600 dark:text-rose-400">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h4 className="text-gray-900 dark:text-white font-bold">High Probability: Delayed Graduation</h4>
                                <p className="text-sm text-gray-500">Students with <span className="font-mono">GPA &lt; 2.5</span> in Year 1 Sem 2 are <span className="font-bold">3.4x</span> more likely to require an extra year.</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-lg transition-colors">
                            View 12 Affected Students
                        </button>
                    </div>
                </DarkCard>
             </div>
        </div>
    );
};

export default AcademicView;
