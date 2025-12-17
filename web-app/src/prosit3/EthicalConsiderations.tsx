import { Scale, AlertTriangle, Users, Shield, Heart, Eye, MoreHorizontal } from 'lucide-react';

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

const EthicalConsiderations = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Scale className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Responsible AI Deployment</h2>
        </div>
        <p className="text-white/90 text-lg">
          Ensuring fairness, transparency, and positive impact in academic risk prediction
        </p>
      </div>

      {/* Ethical Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DarkCard title="Human-in-the-Loop" subtitle="Autonomy">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
                Never auto-act on predictions. All interventions require human review and approval.
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
          </ul>
        </DarkCard>

        <DarkCard title="Transparency" subtitle="Explainability">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg">
              <Eye className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
                Explain why a student was flagged and what factors contributed to the prediction.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-500 mt-1">•</span>
              <span>Feature importance shown for each prediction</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-500 mt-1">•</span>
              <span>Model performance metrics publicly available</span>
            </li>
          </ul>
        </DarkCard>

        <DarkCard title="Positive Framing" subtitle="Beneficence">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-500/10 dark:bg-orange-500/20 rounded-lg">
              <Heart className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
                Frame predictions as opportunities for support, not labels of failure.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start space-x-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>"Eligible for support" not "at-risk"</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>Focus on growth and improvement</span>
            </li>
          </ul>
        </DarkCard>

        <DarkCard title="Regular Audits" subtitle="Justice">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-500/10 dark:bg-purple-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
                Monitor for bias, drift, and unintended consequences over time.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start space-x-2">
              <span className="text-purple-500 mt-1">•</span>
              <span>Quarterly fairness analysis across demographics</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-purple-500 mt-1">•</span>
              <span>Model retraining with updated data</span>
            </li>
          </ul>
        </DarkCard>
      </div>

      {/* Fairness Considerations */}
      <DarkCard title="Fairness Analysis" subtitle="Algorithmic audit">
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Protected Attributes</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              The model does NOT use the following protected attributes as features:
            </p>
            <div className="flex flex-wrap gap-2">
              {['Gender', 'Nationality', 'Family Background', 'Socioeconomic Status'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                    {tag}
                  </span>
              ))}
            </div>
          </div>
        </div>
      </DarkCard>

      {/* Limitations */}
      <DarkCard title="Known Limitations" subtitle="Model constraints">
        <ul className="space-y-3">
          <li className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Historical Bias</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Model trained on historical data may reflect past institutional biases
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Individual Circumstances</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cannot account for personal challenges, health issues, or family emergencies
              </p>
            </div>
          </li>
        </ul>
      </DarkCard>
    </div>
  );
};

export default EthicalConsiderations;
