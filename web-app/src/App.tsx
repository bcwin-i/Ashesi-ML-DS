import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  ShieldAlert, 
  LayoutDashboard,
  Settings,
  FileText,
  ChevronDown,
  Sun,
  Moon,
  Check,
  TrendingUp,
  Database,
  BarChart2,
  Scale
} from 'lucide-react';

import ExecutiveDashboard from './ExecutiveDashboard';
import AdmissionsView from './AdmissionsView';
import AcademicView from './AcademicView';
import ConductView from './ConductView';
import DatasetInsightsView from './DatasetInsightsView';
import Prosit2Dashboard from './prosit2/Dashboard';
import Prosit2Preview from './prosit2/Preview';
import Prosit2Predict from './prosit2/Predict';
import Prosit3Dashboard from './prosit3/Dashboard';
import Prosit3Predict from './prosit3/PredictRisk';
import Prosit3Compare from './prosit3/ModelComparison';
import Prosit3Ethics from './prosit3/EthicalConsiderations';
import Prosit5EthicalAudit from './prosit5/EthicalAudit';

// --- Sidebar Component ---

const Sidebar = ({ 
  theme, 
  selectedProsit, 
  setSelectedProsit 
}: { 
  theme: 'light' | 'dark',
  selectedProsit: number,
  setSelectedProsit: (p: number) => void
}) => {
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProjectDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const prosits = [
    { id: 2, name: 'PROSIT 2', description: 'Clustering Analysis' },
    { id: 3, name: 'PROSIT 3', description: 'Probation Risk' },
    { id: 5, name: 'PROSIT 5', description: 'Student Success' },
  ];

  const currentProsit = prosits.find(p => p.id === selectedProsit) || prosits[2];

  // Define navigation items based on selected Prosit
  const getNavItems = () => {
    if (selectedProsit === 2) {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, path: '/prosit2/dashboard' },
        { id: 'preview', label: 'Data Preview', icon: Database, path: '/prosit2/preview' },
        { id: 'predict', label: 'Cluster Assignment', icon: Users, path: '/prosit2/predict' },
      ];
    } else if (selectedProsit === 3) {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/prosit3/dashboard' },
        { id: 'predict', label: 'Probation Risk', icon: ShieldAlert, path: '/prosit3/predict' },
        { id: 'compare', label: 'Model Comparison', icon: TrendingUp, path: '/prosit3/compare' },
        { id: 'ethics', label: 'Ethics', icon: FileText, path: '/prosit3/ethics' },
      ];
    } else {
      return [
        { id: 'exec', label: 'Dashboard', icon: LayoutDashboard, path: '/prosit5/dashboard' },
        { id: 'insights', label: 'Dataset Insights', icon: BarChart2, path: '/prosit5/insights' },
        { id: 'adm', label: 'Admissions', icon: Users, path: '/prosit5/admissions' },
        { id: 'acad', label: 'Academic Files', icon: FileText, path: '/prosit5/academic' },
        { id: 'ajc', label: 'Conduct Risks', icon: ShieldAlert, path: '/prosit5/conduct' },
        { id: 'ethics', label: 'Ethical Audit', icon: Scale, path: '/prosit5/ethics' },
      ];
    }
  };

  const navItems = getNavItems();

  return (
  <div className="w-72 bg-white dark:bg-[#141414] text-gray-500 dark:text-gray-400 flex flex-col h-screen fixed left-0 top-0 border-r border-gray-200 dark:border-[#262626] z-50 transition-colors duration-300">
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-8">
        <img 
            src={theme === 'dark' ? '/logo_dark.png' : '/logo_light.webp'} 
            alt="Ashesi Logo" 
            className="h-10 w-auto object-contain transition-opacity duration-300"
        />
        <span className="font-semibold text-gray-900 dark:text-white text-lg tracking-tight">Ashesi Intelligence</span>
      </div>

      {/* Project Selector Dropdown */}
      <div className="relative mb-8" ref={dropdownRef}>
        <div 
          onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
          className="bg-gray-50 dark:bg-[#1F1F1F] rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors border border-gray-200 dark:border-[#262626]"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-[#881C1C] dark:bg-gradient-to-br dark:from-emerald-500 dark:to-emerald-700 flex items-center justify-center transition-colors duration-300">
               <LayoutDashboard size={14} className="text-white"/>
            </div>
            <div>
              <p className="text-xs text-gray-400">Project</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{currentProsit.name}</p>
            </div>
          </div>
          <ChevronDown size={16} className={`transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} />
        </div>

        {/* Dropdown Menu */}
        {isProjectDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1F1F1F] rounded-xl border border-gray-200 dark:border-[#262626] shadow-lg z-50 overflow-hidden">
            {prosits.map((prosit) => (
              <div
                key={prosit.id}
                onClick={() => {
                  setSelectedProsit(prosit.id);
                  setIsProjectDropdownOpen(false);
                  // Navigate to default route for selected prosit
                  window.location.href = prosit.id === 2 ? '/prosit2/dashboard' : 
                                        prosit.id === 3 ? '/prosit3/dashboard' : '/prosit5/dashboard';
                }}
                className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                  selectedProsit === prosit.id
                    ? 'bg-gray-100 dark:bg-[#262626]'
                    : 'hover:bg-gray-50 dark:hover:bg-[#1A1A1A]'
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{prosit.name}</p>
                  <p className="text-xs text-gray-500">{prosit.description}</p>
                </div>
                {selectedProsit === prosit.id && (
                  <Check size={16} className="text-[#881C1C] dark:text-emerald-500" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs font-bold text-gray-600 uppercase mb-4 pl-2">Analytics</p>
      
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = window.location.pathname === item.path;
          return (
            <a
              key={item.id}
              href={item.path}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? 'bg-gray-100 dark:bg-[#262626] text-[#881C1C] dark:text-white border border-gray-200 dark:border-[#333]' 
                  : 'hover:bg-gray-50 dark:hover:bg-[#1F1F1F] hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon size={18} className={isActive ? "text-[#881C1C] dark:text-emerald-500" : ""} />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      <div className="mt-8">
         <a href={selectedProsit === 5 ? '/prosit5/ethics' : selectedProsit === 3 ? '/prosit3/ethics' : '#'} className="block">
         <div className="bg-[#881C1C]/5 dark:bg-[#1F1F1F] rounded-2xl p-4 border border-[#881C1C]/10 dark:border-[#262626] relative overflow-hidden group transition-all duration-300 hover:border-[#881C1C]/30 dark:hover:border-emerald-500/30 cursor-pointer">
            <div className="relative z-10">
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">1/4 Steps</p>
              <h4 className="text-gray-900 dark:text-white font-bold mb-4">Complete the<br/>Ethical Audit</h4>
              <div className="flex space-x-1 items-end h-8">
                <div className="w-2 bg-[#881C1C]/30 dark:bg-emerald-600/30 h-4 rounded-t transition-colors duration-300"></div>
                <div className="w-2 bg-[#881C1C]/60 dark:bg-emerald-600/60 h-6 rounded-t transition-colors duration-300"></div>
                <div className="w-2 bg-[#881C1C] dark:bg-emerald-500 h-8 rounded-t dark:shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-colors duration-300"></div>
              </div>
            </div>
            {/* Background Glow */}
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#881C1C]/10 dark:bg-emerald-500/10 rounded-full blur-xl group-hover:bg-[#881C1C]/20 dark:group-hover:bg-emerald-500/20 transition-all"></div>
         </div>
         </a>
         <div className="flex items-center space-x-2 mt-4 text-xs text-gray-500 px-2 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">
            <Settings size={14}/> <span>Docs & Settings</span>
         </div>
      </div>
    </div>
  </div>
  );
};


const App = () => {
  const [selectedProsit, setSelectedProsit] = useState(() => {
    // Determine prosit from URL
    const path = window.location.pathname;
    if (path.startsWith('/prosit2')) return 2;
    if (path.startsWith('/prosit3')) return 3;
    if (path.startsWith('/prosit5')) return 5;
    return 5; // Default
  });
  
  // Initialize theme from localStorage or system preference, default to dark
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('theme');
        if (stored) return stored as 'dark' | 'light';
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark'; // Default to dark if unknown
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
    } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Get page title based on route
  const getPageTitle = () => {
    const path = window.location.pathname;
    if (path.includes('/dashboard')) return `Prosit ${selectedProsit} - Dashboard`;
    if (path.includes('/preview')) return `Prosit ${selectedProsit} - Data Preview`;
    if (path.includes('/predict')) return `Prosit ${selectedProsit} - Cluster Assignment`;
    if (path.includes('/insights')) return `Prosit ${selectedProsit} - Dataset Insights`;
    if (path.includes('/admissions')) return `Prosit ${selectedProsit} - Admissions Analytics`;
    if (path.includes('/academic')) return `Prosit ${selectedProsit} - Academic Records`;
    if (path.includes('/conduct')) return `Prosit ${selectedProsit} - Conduct & Ethics`;
    return `Prosit ${selectedProsit} - Dashboard`;
  };

  return (
    <Router>
      <div className={`flex min-h-screen font-sans transition-colors duration-300 selection:bg-[#881C1C]/30 dark:selection:bg-emerald-500/30 ${theme === 'dark' ? 'bg-[#0A0A0A]' : 'bg-gray-50' }`}>
        <Sidebar 
          theme={theme} 
          selectedProsit={selectedProsit}
          setSelectedProsit={setSelectedProsit}
        />
        
        <main className="ml-72 flex-1 p-8">
          {/* Header */}
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                {getPageTitle()}
              </h1>
              <p className="text-gray-500 text-sm mt-1">Last updated: Today, 14:30</p>
            </div>
            
            <div className="flex items-center space-x-6">
               <div className="hidden md:block text-right">
                  <p className="text-xs text-gray-500">Credits: 5000</p>
                  <p className="text-sm font-bold text-[#881C1C] dark:text-emerald-500">Pro Plan</p>
               </div>
               
               {/* Theme Toggle */}
               <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] hover:bg-gray-100 dark:hover:bg-[#262626] text-gray-600 dark:text-gray-400 transition-all"
                  title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
               >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
               </button>

               <div className="flex items-center space-x-3 bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] rounded-full p-1 pr-4 transition-colors duration-300">
                  <div className="w-8 h-8 rounded-full bg-[#881C1C] dark:bg-gradient-to-r dark:from-emerald-500 dark:to-teal-400 p-[1px]">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="rounded-full bg-white dark:bg-black" />
                  </div>
                  <div className="text-xs">
                      <p className="text-gray-900 dark:text-white font-bold">Dr. Korsah</p>
                      <p className="text-gray-500">Admin</p>
                  </div>
                  <ChevronDown size={14} className="text-gray-500"/>
               </div>
            </div>
          </header>

          {/* Routes */}
          <Routes>
            {/* Prosit 2 Routes */}
            <Route path="/prosit2/dashboard" element={<Prosit2Dashboard />} />
            <Route path="/prosit2/preview" element={<Prosit2Preview />} />
            <Route path="/prosit2/predict" element={<Prosit2Predict />} />
            
            {/* Prosit 3 Routes */}
            <Route path="/prosit3/dashboard" element={<Prosit3Dashboard />} />
            <Route path="/prosit3/predict" element={<Prosit3Predict />} />
            <Route path="/prosit3/compare" element={<Prosit3Compare />} />
            <Route path="/prosit3/ethics" element={<Prosit3Ethics />} />
            
            {/* Prosit 5 Routes */}
            <Route path="/prosit5/dashboard" element={<ExecutiveDashboard isDark={theme === 'dark'} />} />
            <Route path="/prosit5/insights" element={<DatasetInsightsView />} />
            <Route path="/prosit5/admissions" element={<AdmissionsView />} />
            <Route path="/prosit5/academic" element={<AcademicView />} />
            <Route path="/prosit5/conduct" element={<ConductView />} />
            <Route path="/prosit5/ethics" element={<Prosit5EthicalAudit />} />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/prosit5/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/prosit5/dashboard" replace />} />
          </Routes>

        </main>
      </div>
    </Router>
  );
};

export default App;
