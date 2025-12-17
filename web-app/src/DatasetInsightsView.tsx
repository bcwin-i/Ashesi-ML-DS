import { useEffect, useState } from 'react';
import { Database, FileText, Users, AlertCircle, BarChart3, PieChart } from 'lucide-react';

interface Dataset {
  name: string;
  filename: string;
  description: string;
  rows: number;
  columns: number;
  size_mb: number;
  importance: string;
  usage: string;
  key_features: string[];
  region?: string;
  distribution?: {
    misconduct_types?: Record<string, number>;
    unique_students?: number;
  };
}

interface DatasetInsights {
  datasets: Dataset[];
  summary: {
    total_datasets: number;
    total_size_mb: number;
    total_students_main: number;
    total_students_admissions: number;
    students_with_ajc_cases: number;
    dataset_categories: Record<string, number>;
    exam_systems: string[];
    research_questions_coverage: Record<string, string>;
  };
  importance_levels: Record<string, string>;
}

const DatasetInsightsView = () => {
  const [insights, setInsights] = useState<DatasetInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDatasetInsights();
  }, []);

  const fetchDatasetInsights = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/prosit5/datasets/insights');
      if (!response.ok) throw new Error('Failed to fetch dataset insights');
      const data = await response.json();
      setInsights(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'critical':
        return <AlertCircle className="w-4 h-4" />;
      case 'high':
        return <BarChart3 className="w-4 h-4" />;
      case 'medium':
        return <PieChart className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#881C1C] dark:border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dataset insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="font-bold text-red-900 dark:text-red-300">Error Loading Data</h3>
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-[#262626]">
          <div className="flex items-center justify-between mb-4">
            <Database className="w-8 h-8 text-[#881C1C] dark:text-emerald-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {insights.summary.total_datasets}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Datasets</h3>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {insights.summary.total_size_mb} MB total
          </p>
        </div>

        <div className="bg-white dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-[#262626]">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-[#881C1C] dark:text-emerald-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {insights.summary.total_students_main.toLocaleString()}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</h3>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Main academic records</p>
        </div>

        <div className="bg-white dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-[#262626]">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-[#881C1C] dark:text-emerald-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {insights.summary.total_students_admissions.toLocaleString()}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Admissions Records</h3>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {insights.summary.exam_systems.length} exam systems
          </p>
        </div>

        <div className="bg-white dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-[#262626]">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-8 h-8 text-[#881C1C] dark:text-emerald-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {insights.summary.students_with_ajc_cases}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">AJC Cases</h3>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Conduct violations</p>
        </div>
      </div>

      {/* Importance Legend */}
      <div className="bg-white dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-[#262626]">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Dataset Importance Levels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(insights.importance_levels).map(([level, description]) => (
            <div key={level} className="flex items-start space-x-3">
              <div className={`px-3 py-1 rounded-lg border text-xs font-medium capitalize flex items-center space-x-1 ${getImportanceColor(level)}`}>
                {getImportanceIcon(level)}
                <span>{level}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 flex-1">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Research Questions Coverage */}
      <div className="bg-white dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-[#262626]">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Research Questions Coverage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(insights.summary.research_questions_coverage).map(([question, description]) => (
            <div key={question} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-[#1F1F1F] rounded-lg">
              <span className="font-bold text-[#881C1C] dark:text-emerald-500 text-sm">{question}:</span>
              <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dataset Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Dataset Details</h2>
        
        {insights.datasets.map((dataset, index) => (
          <div
            key={index}
            className="bg-white dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-[#262626] hover:border-[#881C1C] dark:hover:border-emerald-500 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{dataset.name}</h3>
                  <span className={`px-3 py-1 rounded-lg border text-xs font-medium capitalize flex items-center space-x-1 ${getImportanceColor(dataset.importance)}`}>
                    {getImportanceIcon(dataset.importance)}
                    <span>{dataset.importance}</span>
                  </span>
                  {dataset.region && (
                    <span className="px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-medium">
                      {dataset.region}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{dataset.description}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">{dataset.usage}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 dark:bg-[#1F1F1F] rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Filename</p>
                <p className="text-sm font-mono text-gray-900 dark:text-white truncate">{dataset.filename}</p>
              </div>
              <div className="bg-gray-50 dark:bg-[#1F1F1F] rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Rows</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{dataset.rows.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 dark:bg-[#1F1F1F] rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Columns</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{dataset.columns}</p>
              </div>
              <div className="bg-gray-50 dark:bg-[#1F1F1F] rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Size</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{dataset.size_mb} MB</p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-[#262626] pt-4">
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">Key Features</p>
              <div className="flex flex-wrap gap-2">
                {dataset.key_features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-[#881C1C]/10 dark:bg-emerald-500/10 text-[#881C1C] dark:text-emerald-500 rounded text-xs font-mono"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Distribution for AJC dataset */}
            {dataset.distribution && dataset.distribution.misconduct_types && (
              <div className="border-t border-gray-200 dark:border-[#262626] pt-4 mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">Misconduct Distribution</p>
                <div className="space-y-2">
                  {Object.entries(dataset.distribution.misconduct_types).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 dark:bg-[#262626] rounded-full h-2">
                          <div
                            className="bg-[#881C1C] dark:bg-emerald-500 h-2 rounded-full"
                            style={{
                              width: `${(count / dataset.rows) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white w-12 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                  Unique students: {dataset.distribution.unique_students}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatasetInsightsView;
