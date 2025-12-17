interface RiskGaugeProps {
  probability: number;
  riskLevel: 'low' | 'moderate' | 'high';
}

const RiskGauge = ({ probability, riskLevel }: RiskGaugeProps) => {
  // Calculate gauge rotation (0-180 degrees)
  const rotation = (probability / 100) * 180;
  
  // Color based on risk level
  const colors = {
    low: { bg: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-500/20' },
    moderate: { bg: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-400', ring: 'ring-yellow-500/20' },
    high: { bg: 'bg-red-500', text: 'text-red-600 dark:text-red-400', ring: 'ring-red-500/20' },
  };

  const color = colors[riskLevel];

  return (
    <div className="flex flex-col items-center">
      {/* Gauge Container */}
      <div className="relative w-64 h-32">
        {/* Background Arc */}
        <svg className="w-full h-full" viewBox="0 0 200 100" key={`gauge-${probability.toFixed(1)}`}>
          {/* Low Risk Zone (Green) */}
          <path
            d="M 20 90 A 80 80 0 0 1 60 20"
            fill="none"
            stroke="rgb(34, 197, 94)"
            strokeWidth="20"
            opacity="0.2"
          />
          {/* Moderate Risk Zone (Yellow) */}
          <path
            d="M 60 20 A 80 80 0 0 1 140 20"
            fill="none"
            stroke="rgb(234, 179, 8)"
            strokeWidth="20"
            opacity="0.2"
          />
          {/* High Risk Zone (Red) */}
          <path
            d="M 140 20 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="rgb(239, 68, 68)"
            strokeWidth="20"
            opacity="0.2"
          />
          
          {/* Needle */}
          <g 
            transform={`rotate(${rotation - 90} 100 90)`} 
            style={{ willChange: 'transform' }}
            className="transition-transform duration-1000 ease-out"
          >
            <line
              x1="100"
              y1="90"
              x2="100"
              y2="20"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="text-gray-700 dark:text-gray-300"
            />
            <circle cx="100" cy="90" r="6" fill="currentColor" className="text-gray-700 dark:text-gray-300" />
          </g>
        </svg>

        {/* Labels */}
        <div className="absolute bottom-0 left-0 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          0%
        </div>
        <div className="absolute bottom-0 right-0 text-xs text-red-600 dark:text-red-400 font-medium">
          100%
        </div>
      </div>

      {/* Probability Display */}
      <div className="mt-4 text-center">
        <div className={`text-5xl font-bold ${color.text} transition-colors duration-300`}>
          {probability.toFixed(1)}%
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Probation Risk
        </div>
      </div>

      {/* Risk Level Badge */}
      <div className={`mt-4 px-6 py-2 rounded-full ${color.bg} bg-opacity-10 dark:bg-opacity-20 ring-2 ${color.ring} transition-all duration-300`}>
        <span className={`text-sm font-bold uppercase tracking-wide ${color.text}`}>
          {riskLevel === 'low' ? '✓ Low Risk' : riskLevel === 'moderate' ? '⚠ Moderate Risk' : '⚠ High Risk'}
        </span>
      </div>
    </div>
  );
};

export default RiskGauge;
