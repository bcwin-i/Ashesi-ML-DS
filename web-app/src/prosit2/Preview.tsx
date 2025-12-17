import { useState, useEffect } from 'react';
import { MoreHorizontal, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../api/client';

interface ModelInfo {
  algorithms: string[];
  n_features: number;
  n_samples: number;
  scaler_type: string;
  pca_components: number;
  algorithm_details: any;
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

// Generate sample data for preview
const generateSampleData = (count: number) => {
  const programs = ['Computer Science', 'Business Admin', 'Engineering', 'MIS'];
  const years = [2020, 2021, 2022, 2023, 2024];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    mark: Math.floor(50 + Math.random() * 50),
    gpa: parseFloat((2.0 + Math.random() * 2.0).toFixed(2)),
    cgpa: parseFloat((2.0 + Math.random() * 2.0).toFixed(2)),
    year: years[Math.floor(Math.random() * years.length)],
    program: programs[Math.floor(Math.random() * programs.length)],
    kmeans: Math.floor(Math.random() * 5),
    hierarchical: Math.floor(Math.random() * 6),
    gmm: Math.floor(Math.random() * 6),
    dbscan: Math.random() > 0.1 ? 0 : -1, // 10% outliers
  }));
};

const Prosit2Preview = () => {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  
  // Generate sample data (in a real app, this would come from the API)
  const [sampleData] = useState(() => generateSampleData(100));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const infoData = await api.prosit2.getModelsInfo();
      setModelInfo(infoData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(sampleData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sampleData.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#881C1C] dark:text-emerald-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading data preview...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Cluster Distribution Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <DarkCard className="border-l-4 border-l-blue-500">
          <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">K</span>
            </div>
            <span className="text-xs font-semibold uppercase">K-Means</span>
          </div>
          {(() => {
            const clusters = sampleData.reduce((acc, row) => {
              acc[row.kmeans] = (acc[row.kmeans] || 0) + 1;
              return acc;
            }, {} as Record<number, number>);
            const total = sampleData.length;
            const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];
            
            let currentAngle = 0;
            const slices = Object.entries(clusters)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([cluster, count], i) => {
                const percentage = (count / total) * 100;
                const angle = (percentage / 100) * 360;
                const startAngle = currentAngle;
                currentAngle += angle;
                
                const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
                const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
                const x2 = 50 + 40 * Math.cos((startAngle + angle - 90) * Math.PI / 180);
                const y2 = 50 + 40 * Math.sin((startAngle + angle - 90) * Math.PI / 180);
                const largeArc = angle > 180 ? 1 : 0;
                
                return { cluster, count, percentage, path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`, color: colors[i % colors.length] };
              });
            
            return (
              <div className="flex items-center space-x-4">
                <svg viewBox="0 0 100 100" className="w-24 h-24">
                  {slices.map((slice, i) => (
                    <path key={i} d={slice.path} fill={slice.color} opacity="0.8" />
                  ))}
                </svg>
                <div className="flex-1 space-y-1">
                  {slices.map((slice, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: slice.color }}></div>
                        <span className="text-gray-600 dark:text-gray-400">C{slice.cluster}</span>
                      </div>
                      <span className="font-mono text-gray-700 dark:text-gray-300">{slice.percentage.toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </DarkCard>

        <DarkCard className="border-l-4 border-l-indigo-500">
          <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center">
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">H</span>
            </div>
            <span className="text-xs font-semibold uppercase">Hierarchical</span>
          </div>
          {(() => {
            const clusters = sampleData.reduce((acc, row) => {
              acc[row.hierarchical] = (acc[row.hierarchical] || 0) + 1;
              return acc;
            }, {} as Record<number, number>);
            const total = sampleData.length;
            const colors = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff', '#eef2ff'];
            
            let currentAngle = 0;
            const slices = Object.entries(clusters)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([cluster, count], i) => {
                const percentage = (count / total) * 100;
                const angle = (percentage / 100) * 360;
                const startAngle = currentAngle;
                currentAngle += angle;
                
                const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
                const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
                const x2 = 50 + 40 * Math.cos((startAngle + angle - 90) * Math.PI / 180);
                const y2 = 50 + 40 * Math.sin((startAngle + angle - 90) * Math.PI / 180);
                const largeArc = angle > 180 ? 1 : 0;
                
                return { cluster, count, percentage, path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`, color: colors[i % colors.length] };
              });
            
            return (
              <div className="flex items-center space-x-4">
                <svg viewBox="0 0 100 100" className="w-24 h-24">
                  {slices.map((slice, i) => (
                    <path key={i} d={slice.path} fill={slice.color} opacity="0.8" />
                  ))}
                </svg>
                <div className="flex-1 space-y-1">
                  {slices.map((slice, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: slice.color }}></div>
                        <span className="text-gray-600 dark:text-gray-400">C{slice.cluster}</span>
                      </div>
                      <span className="font-mono text-gray-700 dark:text-gray-300">{slice.percentage.toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </DarkCard>

        <DarkCard className="border-l-4 border-l-purple-500">
          <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">G</span>
            </div>
            <span className="text-xs font-semibold uppercase">GMM</span>
          </div>
          {(() => {
            const clusters = sampleData.reduce((acc, row) => {
              acc[row.gmm] = (acc[row.gmm] || 0) + 1;
              return acc;
            }, {} as Record<number, number>);
            const total = sampleData.length;
            const colors = ['#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff', '#f3e8ff', '#faf5ff'];
            
            let currentAngle = 0;
            const slices = Object.entries(clusters)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([cluster, count], i) => {
                const percentage = (count / total) * 100;
                const angle = (percentage / 100) * 360;
                const startAngle = currentAngle;
                currentAngle += angle;
                
                const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
                const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
                const x2 = 50 + 40 * Math.cos((startAngle + angle - 90) * Math.PI / 180);
                const y2 = 50 + 40 * Math.sin((startAngle + angle - 90) * Math.PI / 180);
                const largeArc = angle > 180 ? 1 : 0;
                
                return { cluster, count, percentage, path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`, color: colors[i % colors.length] };
              });
            
            return (
              <div className="flex items-center space-x-4">
                <svg viewBox="0 0 100 100" className="w-24 h-24">
                  {slices.map((slice, i) => (
                    <path key={i} d={slice.path} fill={slice.color} opacity="0.8" />
                  ))}
                </svg>
                <div className="flex-1 space-y-1">
                  {slices.map((slice, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: slice.color }}></div>
                        <span className="text-gray-600 dark:text-gray-400">C{slice.cluster}</span>
                      </div>
                      <span className="font-mono text-gray-700 dark:text-gray-300">{slice.percentage.toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </DarkCard>

        <DarkCard className="border-l-4 border-l-emerald-500">
          <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">D</span>
            </div>
            <span className="text-xs font-semibold uppercase">DBSCAN</span>
          </div>
          {(() => {
            const coreCount = sampleData.filter(row => row.dbscan !== -1).length;
            const outlierCount = sampleData.filter(row => row.dbscan === -1).length;
            const total = sampleData.length;
            const corePercentage = (coreCount / total) * 100;
            const outlierPercentage = (outlierCount / total) * 100;
            
            const coreAngle = (corePercentage / 100) * 360;
            const x1 = 50 + 40 * Math.cos(-90 * Math.PI / 180);
            const y1 = 50 + 40 * Math.sin(-90 * Math.PI / 180);
            const x2 = 50 + 40 * Math.cos((coreAngle - 90) * Math.PI / 180);
            const y2 = 50 + 40 * Math.sin((coreAngle - 90) * Math.PI / 180);
            const largeArc = coreAngle > 180 ? 1 : 0;
            
            const corePath = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
            const outlierPath = `M 50 50 L ${x2} ${y2} A 40 40 0 ${1 - largeArc} 1 ${x1} ${y1} Z`;
            
            return (
              <div className="flex items-center space-x-4">
                <svg viewBox="0 0 100 100" className="w-24 h-24">
                  <path d={corePath} fill="#10b981" opacity="0.8" />
                  <path d={outlierPath} fill="#f43f5e" opacity="0.8" />
                </svg>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-gray-600 dark:text-gray-400">Core</span>
                    </div>
                    <span className="font-mono text-gray-700 dark:text-gray-300">{corePercentage.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                      <span className="text-gray-600 dark:text-gray-400">Outliers</span>
                    </div>
                    <span className="font-mono text-gray-700 dark:text-gray-300">{outlierPercentage.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </DarkCard>
      </div>

      <DarkCard title="Dataset Overview" subtitle={`Showing ${startIndex + 1}-${Math.min(endIndex, sampleData.length)} of ${sampleData.length} records`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-[#262626]">
              <th className="text-left p-3 text-gray-500 font-medium">#</th>
              <th className="text-left p-3 text-gray-500 font-medium">Mark</th>
              <th className="text-left p-3 text-gray-500 font-medium">GPA</th>
              <th className="text-left p-3 text-gray-500 font-medium">CGPA</th>
              <th className="text-left p-3 text-gray-500 font-medium">Year</th>
              <th className="text-left p-3 text-gray-500 font-medium">Program</th>
              <th className="text-left p-3 text-gray-500 font-medium">K-Means</th>
              <th className="text-left p-3 text-gray-500 font-medium">Hierarchical</th>
              <th className="text-left p-3 text-gray-500 font-medium">GMM</th>
              <th className="text-left p-3 text-gray-500 font-medium">DBSCAN</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 dark:border-[#1F1F1F] hover:bg-gray-50 dark:hover:bg-[#1A1A1A] transition-colors">
                <td className="p-3 text-gray-900 dark:text-white font-mono text-xs">#{row.id}</td>
                <td className="p-3 text-gray-900 dark:text-white">{row.mark}</td>
                <td className="p-3 text-gray-900 dark:text-white">{row.gpa}</td>
                <td className="p-3 text-gray-900 dark:text-white">{row.cgpa}</td>
                <td className="p-3 text-gray-900 dark:text-white">{row.year}</td>
                <td className="p-3 text-gray-700 dark:text-gray-300 text-xs">{row.program}</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
                    C{row.kmeans}
                  </span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                    C{row.hierarchical}
                  </span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold">
                    C{row.gmm}
                  </span>
                </td>
                <td className="p-3">
                  {row.dbscan === -1 ? (
                    <span className="px-2 py-1 rounded bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold">
                      Outlier
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                      Core
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-[#1F1F1F] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#262626] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          
          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-[#881C1C] dark:bg-emerald-500 text-white'
                      : 'bg-gray-100 dark:bg-[#1F1F1F] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#262626]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-[#1F1F1F] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#262626] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </DarkCard>
    </>
  );
};

export default Prosit2Preview;
