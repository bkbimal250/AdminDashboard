import React from 'react';
import { Card } from '../ui';
import { TrendingUp, TrendingDown } from 'lucide-react';

const ReportCard = ({ title, value, icon: Icon, color, trend, trendLabel }) => {
  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
        iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
        text: 'text-blue-600',
        border: 'border-blue-500',
        shadow: 'shadow-blue-500/20'
      },
      green: {
        bg: 'bg-gradient-to-br from-green-50 to-green-100',
        iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
        text: 'text-green-600',
        border: 'border-green-500',
        shadow: 'shadow-green-500/20'
      },
      purple: {
        bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
        iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
        text: 'text-purple-600',
        border: 'border-purple-500',
        shadow: 'shadow-purple-500/20'
      },
      orange: {
        bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
        iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
        text: 'text-orange-600',
        border: 'border-orange-500',
        shadow: 'shadow-orange-500/20'
      },
      red: {
        bg: 'bg-gradient-to-br from-red-50 to-red-100',
        iconBg: 'bg-gradient-to-br from-red-500 to-red-600',
        text: 'text-red-600',
        border: 'border-red-500',
        shadow: 'shadow-red-500/20'
      },
      gray: {
        bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
        iconBg: 'bg-gradient-to-br from-gray-500 to-gray-600',
        text: 'text-gray-600',
        border: 'border-gray-500',
        shadow: 'shadow-gray-500/20'
      }
    };
    return colorMap[color] || colorMap.gray;
  };

  const colorClasses = getColorClasses(color);
  const isPositiveTrend = trend >= 0;

  return (
    <Card className={`relative overflow-hidden border-0 shadow-lg ${colorClasses.shadow} hover:shadow-xl hover:scale-105 transition-all duration-300 group`} hover>
      <div className={`absolute inset-0 ${colorClasses.bg} opacity-30`}></div>
      <div className={`absolute top-0 left-0 w-1 h-full ${colorClasses.iconBg}`}></div>
      
      <Card.Body className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
              {value}
            </p>
            
            {trend !== undefined && (
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                  isPositiveTrend ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {isPositiveTrend ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span className="text-xs font-semibold">
                    {isPositiveTrend ? '+' : ''}{trend}
                  </span>
                </div>
                {trendLabel && (
                  <span className="text-xs text-gray-500 font-medium">{trendLabel}</span>
                )}
              </div>
            )}
          </div>
          
          <div className={`p-3 rounded-xl ${colorClasses.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReportCard;
