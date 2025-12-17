import { useState, useEffect } from 'react';
import { Loader2, TrendingUp, Brain, Info, MoreHorizontal } from 'lucide-react';
import { api } from '../api/client';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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

// ... rest of the component (interfaces, constants) ...
interface ModelPrediction {
  model: string;
  probation_risk: number;
  probability: number;
  confidence: string;
}

const MODEL_INFO = {
  baseline_logistic: { name: 'Baseline Logistic', color: '#3B82F6', description: 'Standard logistic regression' },
  lasso_logistic: { name: 'Lasso', color: '#A855F7', description: 'L1 regularization' },
  ridge_logistic: { name: 'Ridge', color: '#EC4899', description: 'L2 regularization' },
  elastic_net_logistic: { name: 'Elastic Net', color: '#6366F1', description: 'L1 + L2 regularization' },
};

const ModelComparison = () => {
    const [metrics, setMetrics] = useState<any[]>([]);
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
    const [predictions, setPredictions] = useState<ModelPrediction[]>([]);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await api.prosit3.getMetrics();
                // Ensure the keys match what Recharts expects
                // const chartData = data.map((m: any) => ({
                //     subject: m.model.replace('_logistic', '').replace('_', ' '),
                //     A: m.accuracy * 100,
                //     B: m.precision * 100,
                //     fullMark: 100,
                // }));
                setMetrics(data);
            } catch (error) {
                console.error("Failed to fetch metrics", error);
            }
        };
        fetchMetrics();
    }, []);

    const handleRunAnalysis = async () => {
        setAnalyzing(true);
        // Simulate analysis for now as endpoint logic is same as before
        // Ideally we would fetch predictions
         // Calculate cluster
         const avgGPA = (studentData.gpa_y + studentData.cgpa_y) / 2;
         let cluster: number;
         if (avgGPA >= 3.5) cluster = 0;
         else if (avgGPA >= 3.0) cluster = 1;
         else if (avgGPA >= 2.5) cluster = 2;
         else if (avgGPA >= 2.0) cluster = 3;
         else cluster = 4;
   
         const fullData = {
           ...studentData,
           semester_year_y: 4,
           academic_year_y: 6,
           admission_year: 5,
           academic_year_x: 5,
           semester_year_x: 3,
           grade: 2,
           course_offering_plan_name: 1,
           grade_system: 0,
           offer_type: 0,
           offer_course_name: 5,
           extra_question_type_of_exam: 1,
           program: 1,
           kmeans_cluster: cluster,
           hierarchical_cluster: cluster,
           gmm_cluster: cluster,
         };
   
         try {
             // Get predictions from all models
             const modelNames = Object.keys(MODEL_INFO);
             const modelPredictions: ModelPrediction[] = [];
       
             for (const modelName of modelNames) {
               const result = await api.prosit3.predict(modelName, fullData);
               modelPredictions.push({
                 model: modelName,
                 ...result,
               });
             }
             setPredictions(modelPredictions);
         } catch (e) {
             console.error(e);
             alert("Analysis failed");
         } finally {
             setAnalyzing(false);
         }
    }


    const radarData = metrics.map((m: any) => ({
        subject: m.model.replace('_logistic', '').replace(/_/g, ' '),
        Accuracy: (m.accuracy * 100).toFixed(1),
        Precision: (m.precision * 100).toFixed(1),
        Recall: (m.recall * 100).toFixed(1),
        F1: (m.f1 * 100).toFixed(1),
        AUC: (m.roc_auc * 100).toFixed(1),
    }));

  return (
    <div className="grid grid-cols-12 gap-6">
        {/* Left Col: Setup & Controls */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
            <DarkCard title="Analysis Setup" subtitle="Review model performance on current student">
                <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                         <label className="text-xs text-gray-500 block mb-1">GPA</label>
                         <input 
                            type="number" 
                            step="0.01"
                            value={studentData.gpa_y}
                            onChange={(e) => setStudentData({...studentData, gpa_y: parseFloat(e.target.value)})}
                            className="w-full bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
                         />
                        </div>
                        <div>
                         <label className="text-xs text-gray-500 block mb-1">CGPA</label>
                         <input 
                            type="number" 
                            step="0.01"
                            value={studentData.cgpa_y}
                            onChange={(e) => setStudentData({...studentData, cgpa_y: parseFloat(e.target.value)})}
                            className="w-full bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
                         />
                        </div>
                     </div>
                     <button 
                        onClick={handleRunAnalysis}
                        disabled={analyzing}
                        className="w-full bg-[#881C1C] dark:bg-emerald-600 text-white rounded-lg py-3 font-medium flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
                     >
                        {analyzing ? <Loader2 className="animate-spin w-4 h-4"/> : <Brain className="w-4 h-4"/>}
                        <span>Run Model Comparison</span>
                     </button>
                     
                     <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg text-xs text-blue-800 dark:text-blue-300">
                        <Info className="w-4 h-4 inline mr-1 mb-0.5"/>
                        Comparing 6 models on Accuracy, Precision, Recall, F1, and AUC.
                     </div>
                </div>
            </DarkCard>

            {predictions.length > 0 && (
                 <DarkCard title="Prediction Agreement" subtitle="Consensus analysis">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                            {((predictions.filter(p => p.probation_risk === 1).length / predictions.length)*100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">
                            of models predict <br/> <strong className="text-red-500">Probation Risk</strong>
                        </div>
                    </div>
                 </DarkCard>
            )}
        </div>

        {/* Right Col: Radar Chart & Details */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
            <DarkCard title="Metric Comparison Radar" subtitle="Performance across key metrics">
                 <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="#374151" strokeOpacity={0.5} />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 11 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 10}} />
                            
                            <Radar name="Accuracy" dataKey="Accuracy" stroke="#8884d8" fill="#8884d8" fillOpacity={0.1} />
                            <Radar name="Recall" dataKey="Recall" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.1} />
                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                 </div>
            </DarkCard>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {predictions.map((pred, i) => (
                    <div key={i} className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] p-4 rounded-xl flex justify-between items-center">
                        <div>
                            <p className="text-xs text-gray-500">{MODEL_INFO[pred.model as keyof typeof MODEL_INFO]?.name}</p>
                            <p className={`font-bold ${pred.probation_risk ? 'text-red-500' : 'text-emerald-500'}`}>
                                {pred.probation_risk ? 'At Risk' : 'Safe'}
                            </p>
                        </div>
                        <div className="text-right">
                             <p className="text-xs text-gray-500">Conf.</p>
                             <p className="font-mono font-medium text-gray-900 dark:text-white">{(pred.probability * 100).toFixed(0)}%</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default ModelComparison;
