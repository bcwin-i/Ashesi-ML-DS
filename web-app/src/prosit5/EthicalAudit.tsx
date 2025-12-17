import { useState, useEffect } from 'react';
import { Scale, AlertTriangle, Users, Shield, Heart, Eye, MoreHorizontal, CheckCircle, XCircle, FileText, BarChart3, TrendingUp, Activity } from 'lucide-react';

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

const EthicalAudit = () => {
  const [metricsData, setMetricsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Q6-9 metrics from API
    fetch('http://localhost:8000/prosit5/results/metrics')
      .then(res => res.json())
      .then(data => {
        setMetricsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching metrics:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#881C1C] to-red-700 dark:from-emerald-500 dark:to-teal-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Scale className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Prosit 5: Ethical Audit & Responsible AI</h2>
        </div>
        <p className="text-white/90 text-lg">
          Comprehensive ethical framework for student journey analytics, admissions prediction, and conduct risk assessment
        </p>
        <div className="mt-4 flex items-center space-x-2 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Fairness Analysis Complete • Disparate Impact Ratio: 0.88 (Passing)</span>
        </div>
      </div>

      {/* Feature Selection Ethics */}
      <DarkCard title="Ethical Feature Selection" subtitle="Protected attributes excluded">
        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span>Excluded Features (To Prevent Bias)</span>
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              The following attributes were intentionally excluded from all predictive models to avoid encoding systemic biases:
            </p>
            <div className="flex flex-wrap gap-2">
              {['Nationality', 'Gender', 'Financial Aid Status', 'High School Location', 'Socioeconomic Indicators', 'Family Background'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
                    ✗ {tag}
                  </span>
              ))}
            </div>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Included Features (Academically Relevant)</span>
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Only academically relevant features used for predictions:
            </p>
            <div className="flex flex-wrap gap-2">
              {['Standardized Math Score', 'Standardized English Score', 'Composite Score', 'First-Year GPA', 'Year 2 GPA', 'Failed Courses Count'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium">
                    ✓ {tag}
                  </span>
              ))}
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Exception: Fairness Analysis Only</span>
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Nationality was used exclusively in Section 6 fairness analysis to detect disparate impact. It was NOT used as a predictive feature in any model.
            </p>
          </div>
        </div>
      </DarkCard>

      {/* Fairness Analysis Results */}
      <DarkCard title="Fairness Analysis: AJC Prediction" subtitle="Disparate Impact Testing">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-[#1F1F1F] rounded-lg border border-gray-200 dark:border-[#262626]">
              <p className="text-xs text-gray-500 mb-1">Method</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">Disparate Impact Ratio</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-[#1F1F1F] rounded-lg border border-gray-200 dark:border-[#262626]">
              <p className="text-xs text-gray-500 mb-1">Threshold (80% Rule)</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">≥ 0.80</p>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <p className="text-xs text-gray-500 mb-1">Result</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">0.88 ✓ Passing</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-[#1F1F1F] rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Formula</h4>
            <code className="text-sm text-gray-700 dark:text-gray-300 font-mono">
              Disparate Impact = min(predicted_rate_by_group) / max(predicted_rate_by_group)
            </code>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span>Limitation Acknowledged</span>
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Only analyzed nationality. Future audits should also check gender, socioeconomic status, and intersectional demographics.
            </p>
          </div>
        </div>
      </DarkCard>

      {/* Ethical Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DarkCard title="Human-in-the-Loop" subtitle="Autonomy & Agency">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
                All predictions require human review. No automated decisions.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Academic advisors review all flagged students</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Predictions are recommendations, not decisions</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Students can appeal or provide context</span>
            </li>
          </ul>
        </DarkCard>

        <DarkCard title="Transparency" subtitle="Explainability & Interpretability">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg">
              <Eye className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
                All models documented with feature importance and performance metrics.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-500 mt-1">•</span>
              <span>Feature importance reported for all models</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-500 mt-1">•</span>
              <span>Confusion matrices provided for classification</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-500 mt-1">•</span>
              <span>All preprocessing steps fully documented</span>
            </li>
          </ul>
        </DarkCard>

        <DarkCard title="Positive Framing" subtitle="Beneficence & Support">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-500/10 dark:bg-orange-500/20 rounded-lg">
              <Heart className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
                Predictions trigger support interventions, never exclusionary actions.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start space-x-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>"Eligible for support" not "at-risk"</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>Focus on growth and improvement opportunities</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>Resource allocation, not opportunity denial</span>
            </li>
          </ul>
        </DarkCard>

        <DarkCard title="Regular Audits" subtitle="Justice & Accountability">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-500/10 dark:bg-purple-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
                Continuous monitoring for bias, drift, and unintended consequences.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start space-x-2">
              <span className="text-purple-500 mt-1">•</span>
              <span>Annual fairness reviews across demographics</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-purple-500 mt-1">•</span>
              <span>Model retraining with updated data</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-purple-500 mt-1">•</span>
              <span>Performance monitoring for degradation</span>
            </li>
          </ul>
        </DarkCard>
      </div>

      {/* Use Case Appropriateness */}
      <DarkCard title="Appropriate Use Cases" subtitle="Ethical deployment guidelines">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Appropriate Uses ✓</span>
            </h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500">✓</span>
                <span>Early warning systems for academic support</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500">✓</span>
                <span>Resource allocation for tutoring programs</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500">✓</span>
                <span>Curriculum design decisions (math track analysis)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500">✓</span>
                <span>Identifying students who may benefit from mentorship</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span>Inappropriate Uses ✗</span>
            </h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start space-x-2">
                <span className="text-red-500">✗</span>
                <span>Automated admissions decisions</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500">✗</span>
                <span>Punitive measures based on predictions</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500">✗</span>
                <span>Denying opportunities to predicted "high-risk" students</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500">✗</span>
                <span>Labeling or stigmatizing students</span>
              </li>
            </ul>
          </div>
        </div>
      </DarkCard>

      {/* Model-Specific Ethical Decisions */}
      <DarkCard title="Model-Specific Ethical Decisions" subtitle="Rationale for each research question">
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-[#1F1F1F] rounded-lg border border-gray-200 dark:border-[#262626]">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Q2: AJC Involvement Prediction</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Model Choice:</strong> Logistic Regression (not Random Forest)
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Rationale:</strong> AJC predictions have serious consequences. Chose Logistic Regression for maximum interpretability, transparency, and auditability. Coefficients show exact contribution of each feature, making the model more defensible in fairness audits.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-[#1F1F1F] rounded-lg border border-gray-200 dark:border-[#262626]">
            <div className="flex items-start space-x-3">
              <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Q7-Q8: Math Track Analysis</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Approach:</strong> Statistical comparison (ANOVA/T-test), not predictive modeling
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Rationale:</strong> Descriptive analysis more appropriate for policy questions. Findings revealed potential equity issue: zero College Algebra students in Computer Science, suggesting structural barriers to STEM access.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-[#1F1F1F] rounded-lg border border-gray-200 dark:border-[#262626]">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">AJC Case Representation</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Decision:</strong> Binary flag (has_ajc_case) instead of case count
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Rationale:</strong> Avoids bias against students with multiple cases. A student with 3 cases is not "3x worse" than a student with 1 case. Binary representation treats all students with misconduct history equally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DarkCard>

      {/* Limitations */}
      <DarkCard title="Known Limitations & Constraints" subtitle="Transparency in model weaknesses">
        <ul className="space-y-3">
          <li className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Historical Bias</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Models trained on historical data may reflect past institutional biases. Requires ongoing monitoring and retraining.
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Class Imbalance</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Severe imbalance in AJC prediction (2.8% positive class) and delayed graduation (98.8% positive class) limits model performance on minority classes.
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Individual Circumstances</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cannot account for personal challenges, health issues, family emergencies, motivation, or support systems.
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Correlation vs Causation</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All models are correlational, not causal. Cannot determine if admissions scores cause academic outcomes.
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Grade Standardization Assumptions</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Assumes linear equivalence between exam systems (WASSCE, IB, O&A Level), which may not reflect true difficulty or preparedness.
              </p>
            </div>
          </li>
        </ul>
      </DarkCard>

      {/* Q6-9 Statistical Findings */}
      {!loading && metricsData && (metricsData.q6_admissions_impact || metricsData.q7_program_success || metricsData.q8_major_change || metricsData.q9_ajc_impact) && (
        <DarkCard title="Additional Statistical Analyses (Q6-9)" subtitle="Correlation studies and comparative analyses">
          <div className="space-y-6">
            {/* Q6: Admissions Score Impact */}
            {metricsData.q6_admissions_impact && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Q6: Admissions Score Impact on Academic Success</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Correlation analysis between entrance exam scores and final CGPA (n={metricsData.q6_admissions_impact.n_samples} students)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {Object.entries(metricsData.q6_admissions_impact.correlations).map(([scoreType, data]: [string, any]) => (
                        <div key={scoreType} className="p-3 bg-white dark:bg-[#1F1F1F] rounded-lg border border-gray-200 dark:border-[#262626]">
                          <p className="text-xs text-gray-500 mb-1">{scoreType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">r = {data.correlation.toFixed(3)}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">p = {data.p_value.toFixed(4)}</p>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                            data.significant 
                              ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }`}>
                            {data.significant ? '✓ Significant' : '○ Not significant'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Q7: Program Success */}
            {metricsData.q7_program_success && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-start space-x-3 mb-4">
                  <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Q7: Program-Specific Success Patterns</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Success rate comparison across academic programs (n={metricsData.q7_program_success.n_samples} students)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-white dark:bg-[#1F1F1F] rounded-lg border border-gray-200 dark:border-[#262626]">
                        <p className="text-xs text-gray-500 mb-1">Programs Analyzed</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{metricsData.q7_program_success.programs_analyzed}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">≥10 students each</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-[#1F1F1F] rounded-lg border border-gray-200 dark:border-[#262626]">
                        <p className="text-xs text-gray-500 mb-1">Top Performing Program</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{metricsData.q7_program_success.top_program}</p>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                          {(metricsData.q7_program_success.top_success_rate * 100).toFixed(1)}% success rate
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Q8: Major Change Impact */}
            {metricsData.q8_major_change && (
              <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-start space-x-3 mb-4">
                  <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Q8: Major Change Patterns and Impact</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      T-test comparison of academic performance between students who changed majors vs. those who didn't
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 bg-white dark:bg-[#1F1F1F] rounded-lg border border-gray-200 dark:border-[#262626]">
                        <p className="text-xs text-gray-500 mb-1">Major Change Rate</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {(metricsData.q8_major_change.change_rate * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="p-3 bg-white dark:bg-[#1F1F1F] rounded-lg border border-gray-200 dark:border-[#262626]">
                        <p className="text-xs text-gray-500 mb-1">Changed Major (Mean CGPA)</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {metricsData.q8_major_change.changed_mean_cgpa.toFixed(3)}
                        </p>
                      </div>
                      <div className="p-3 bg-white dark:bg-[#1F1F1F] rounded-lg border border-gray-200 dark:border-[#262626]">
                        <p className="text-xs text-gray-500 mb-1">No Change (Mean CGPA)</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {metricsData.q8_major_change.not_changed_mean_cgpa.toFixed(3)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-white dark:bg-[#1F1F1F] rounded text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        metricsData.q8_major_change.significant
                          ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        {metricsData.q8_major_change.significant ? '✓ Significant difference' : '○ No significant difference'} (p={metricsData.q8_major_change.p_value.toFixed(4)})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Q9: AJC Impact */}
            {metricsData.q9_ajc_impact && (
              <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-start space-x-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Q9: AJC Impact on Academic Performance</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      T-test comparison of CGPA between students with and without AJC cases
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 bg-white dark:bg-[#1F1F1F] rounded-lg border border-gray-200 dark:border-[#262626]">
                        <p className="text-xs text-gray-500 mb-1">Students with AJC Cases</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {metricsData.q9_ajc_impact.ajc_cases}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          ({metricsData.q9_ajc_impact.ajc_percentage.toFixed(1)}%)
                        </p>
                      </div>
                      <div className="p-3 bg-white dark:bg-[#1F1F1F] rounded-lg border border-gray-200 dark:border-[#262626]">
                        <p className="text-xs text-gray-500 mb-1">With AJC (Mean CGPA)</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {metricsData.q9_ajc_impact.ajc_mean_cgpa.toFixed(3)}
                        </p>
                      </div>
                      <div className="p-3 bg-white dark:bg-[#1F1F1F] rounded-lg border border-gray-200 dark:border-[#262626]">
                        <p className="text-xs text-gray-500 mb-1">Without AJC (Mean CGPA)</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {metricsData.q9_ajc_impact.no_ajc_mean_cgpa.toFixed(3)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-white dark:bg-[#1F1F1F] rounded text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        metricsData.q9_ajc_impact.significant
                          ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        {metricsData.q9_ajc_impact.significant ? '✓ Significant impact' : '○ No significant impact'} (p={metricsData.q9_ajc_impact.p_value.toFixed(4)})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DarkCard>
      )}

      {/* Ethical Imperative */}
      <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl text-white">
        <div className="flex items-start space-x-4">
          <Scale className="w-8 h-8 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-2">Ethical Imperative</h3>
            <p className="text-white/90 text-lg mb-4">
              All models must be used for <strong>support and intervention</strong>, never for <strong>exclusion or punishment</strong>.
            </p>
            <p className="text-white/80 text-sm">
              Predictions should trigger resource allocation, tutoring programs, and mentorship opportunities—not opportunity denial or stigmatization. Every student deserves the chance to succeed with appropriate support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EthicalAudit;
