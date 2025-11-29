import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Line, Text as SvgText } from 'react-native-svg';
import { Activity } from 'lucide-react-native';
import { MoodEntry, MOOD_COLORS } from '@/app/types';

interface MoodChartProps {
  entries: MoodEntry[];
}

export default function MoodChart({ entries = [] }: MoodChartProps) {
  const chartData = useMemo(() => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const days: { label: string; mood: number | null; date: Date }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - i * dayMs);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const dayEnd = dayStart + dayMs;

      const dayEntries = entries.filter(
        e => e.timestamp >= dayStart && e.timestamp < dayEnd
      );

      const avgMood = dayEntries.length > 0
        ? dayEntries.reduce((sum, e) => sum + e.mood, 0) / dayEntries.length
        : null;

      days.push({
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        mood: avgMood,
        date,
      });
    }

    return days;
  }, [entries]);

  const width = 320;
  const height = 150;
  const padding = { top: 20, right: 20, bottom: 30, left: 20 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = chartData
    .map((d, i) => {
      if (d.mood === null) return null;
      const x = padding.left + (i / 6) * chartWidth;
      const y = padding.top + chartHeight - ((d.mood - 1) / 4) * chartHeight;
      return { x, y, mood: d.mood };
    })
    .filter(Boolean) as { x: number; y: number; mood: number }[];

  const pathD = useMemo(() => {
    if (points.length < 2) return '';
    
    let d = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    
    return d;
  }, [points]);

  const areaD = useMemo(() => {
    if (points.length < 2) return '';
    const baseline = padding.top + chartHeight;
    return `${pathD} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`;
  }, [pathD, points, chartHeight]);

  // Show placeholder if not enough data
  if (entries.length < 2) {
    return (
      <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <View className="flex-row items-center gap-2 mb-4">
          <Activity size={16} color="#6366f1" />
          <Text className="text-sm font-semibold text-slate-600">7-Day Mood Trend</Text>
        </View>
        <View className="h-36 items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <Text className="text-slate-400 text-sm">Add more entries to see your trend line.</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <View className="flex-row items-center gap-2 mb-4">
        <Activity size={16} color="#6366f1" />
        <Text className="text-sm font-semibold text-slate-600">7-Day Mood Trend</Text>
      </View>
      
      <View className="relative">
        {/* Grid lines background */}
        <View className="absolute inset-0 flex-col justify-between py-5">
          <View className="border-b border-dashed border-slate-100 w-full h-px" />
          <View className="border-b border-dashed border-slate-100 w-full h-px" />
          <View className="border-b border-dashed border-slate-100 w-full h-px" />
        </View>

        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
              <Stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* Area fill */}
          {areaD && <Path d={areaD} fill="url(#areaGradient)" />}

          {/* Line */}
          {pathD && (
            <Path
              d={pathD}
              stroke="#6366f1"
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data points */}
          {points.map((point, i) => (
            <Circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={4}
              fill="#fff"
              stroke="#6366f1"
              strokeWidth={2}
            />
          ))}

          {/* X-axis labels */}
          {chartData.map((d, i) => {
            const x = padding.left + (i / 6) * chartWidth;
            return (
              <SvgText
                key={i}
                x={x}
                y={height - 8}
                fontSize={10}
                fill="#94a3b8"
                textAnchor="middle"
              >
                {d.label}
              </SvgText>
            );
          })}
        </Svg>
      </View>
    </View>
  );
}
