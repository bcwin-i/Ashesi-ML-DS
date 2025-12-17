import { useState } from 'react';
import { Loader2, AlertCircle, CheckCircle2, Info, MoreHorizontal, AlertTriangle } from 'lucide-react';
import { api } from '../api/client';
import RiskGauge from './RiskGauge';

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

interface PredictionResult {
  probation_risk: number;
  probability: number;
  model_used: string;
  confidence: string;
}

const PredictRisk = () => {
  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [studentData, setStudentData] = useState({
    mark: 75,
    gpa_y: 3.0,
    cgpa_y: 3.0,
    grade_point: 3.0,
    cgpa_x: 3.0,
    yeargroup: 2024,
    gpa_x: 3.0,
    subject_credit: 3.0,
  });

  const handlePredict = async () => {
    try {
      setPredicting(true);
      setResult(null);

      // 1. Calculate cluster assignment logic
      // This duplicates logic in Python but is needed for the API call structure
      const avgGPA = (studentData.gpa_y + studentData.cgpa_y) / 2;
      let cluster: number;
      if (avgGPA >= 3.5) cluster = 0;
      else if (avgGPA >= 3.0) cluster = 1;
      else if (avgGPA >= 2.5) cluster = 2;
      else if (avgGPA >= 2.0) cluster = 3;
      else cluster = 4;

      // 2. Prepare FULL feature vector matching backend model requirements
      // Default values are used for less important features to prevent 422 errors
      const fullData = {
        ...studentData,
        semester_year_y: 4,      // Default semester
        academic_year_y: 6,      // Default academic year
        admission_year: 5,       // Default
        academic_year_x: 5,      
        semester_year_x: 3,
        grade: 2,                // E.g., 'B'
        course_offering_plan_name: 1, 
        grade_system: 0,
        offer_type: 0,
        offer_course_name: 5,
        extra_question_type_of_exam: 1,
        program: 1,              // CS
        kmeans_cluster: cluster,
        hierarchical_cluster: cluster,
        gmm_cluster: cluster,
      };

      const prediction = await api.prosit3.predictEnsemble(fullData);
      setResult(prediction);
    } catch (err: any) {
      console.error('Prediction error:', err);
      // More helpful error message
      alert(`Prediction failed: ${err.message || "Unknown error"}. Check console for details.`);
    } finally {
      setPredicting(false);
    }
  };

  const getRiskLevel = (probability: number): 'low' | 'moderate' | 'high' => {
    if (probability < 30) return 'low';
    if (probability < 70) return 'moderate';
    return 'high';
  };

  const getRecommendations = (riskLevel: 'low' | 'moderate' | 'high') => {
    const recommendations = {
      low: [
        'Keep up the excellent work!',
        'Continue maintaining your current study habits',
        'Consider mentoring other students',
        'Explore advanced courses in your field',
      ],
      moderate: [
        'Schedule regular meetings with your academic advisor',
        'Consider joining study groups for challenging courses',
        'Utilize tutoring services for subjects where you struggle',
        'Develop a structured study schedule',
        'Attend office hours regularly',
      ],
      high: [
        '🚨 Immediate academic support recommended',
        'Meet with your academic advisor this week',
        'Enroll in academic success workshops',
        'Consider reducing course load if possible',
        'Seek counseling services for stress management',
        'Join peer tutoring programs',
        'Create a detailed academic recovery plan',
      ],
    };
    return recommendations[riskLevel];
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Input Form */}
      <div className="col-span-12 lg:col-span-5">
        <DarkCard title="Student Academic Data" subtitle="Enter details for risk assessment">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year Group</label>
                <input
                  type="number"
                  value={studentData.yeargroup}
                  onChange={(e) => setStudentData({ ...studentData, yeargroup: parseInt(e.target.value) || 2024 })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881C1C] dark:focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={handlePredict}
              disabled={predicting}
              className="w-full px-6 py-3 bg-[#881C1C] dark:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-50 font-medium flex items-center justify-center space-x-2 hover:opacity-90"
            >
              {predicting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing Risk...</span>
                </>
              ) : (
                <span>Assess Probation Risk</span>
              )}
            </button>

            {/* Info Box */}
            <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  <p className="font-medium mb-1">Ensemble Prediction</p>
                  <p className="text-xs">
                    Uses majority voting from 6 models (Logistic Regression, Random Forest, etc.) for robust assessment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DarkCard>
      </div>

      {/* Results */}
      <div className="col-span-12 lg:col-span-7">
        {result ? (
          <div className="space-y-6">
            <DarkCard title="Assessment Result" subtitle="Probation risk probability">
              <div className="flex flex-col items-center">
                <RiskGauge 
                  probability={result.probability * 100} 
                  riskLevel={getRiskLevel(result.probability * 100)}
                />
                
                <div className="mt-6 flex items-center space-x-4">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
                    <span className="ml-2 font-bold text-gray-900 dark:text-white">{result.confidence}</span>
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Model:</span>
                    <span className="ml-2 font-bold text-gray-900 dark:text-white">Ensemble</span>
                  </span>
                </div>
              </div>
            </DarkCard>

            <DarkCard title="Recommendations" subtitle="Actionable steps based on risk profile">
               <ul className="space-y-3">
                {getRecommendations(getRiskLevel(result.probability * 100)).map((rec, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-gray-700 dark:text-gray-300">
                     {getRiskLevel(result.probability * 100) === 'low' ? (
                       <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                     ) : (
                       <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                     )}
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </DarkCard>
          </div>
        ) : (
          <DarkCard title="Assessment Result" subtitle="Waiting for input...">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                No Assessment Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Enter student data and click "Assess Probation Risk" to see results
              </p>
            </div>
          </DarkCard>
        )}
      </div>
    </div>
  );
};

export default PredictRisk;
