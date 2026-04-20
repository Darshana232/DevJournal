import {
  LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { moodToScore, getMoodLabel, getMoodColor } from '../../utils/moodUtils';
import { getLastNDays, isSameCalendarDay } from '../../utils/dateHelpers';

/** Custom tooltip for the mood chart */
function MoodTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { date, score, mood } = payload[0].payload;
  return (
    <div className="bg-elevated border border-border rounded px-3 py-2 text-xs font-mono">
      <p className="text-text-secondary">{format(parseISO(date), 'MMM d')}</p>
      <p className="text-text-primary">{getMoodLabel(mood)} · {score}/5</p>
    </div>
  );
}

/**
 * 30-day mood line chart.
 * @param {Array<{mood: string, date: string}>} entries
 */
export function MoodChart({ entries }) {
  const days = getLastNDays(30);

  const data = days.map((day) => {
    const dayEntries = entries.filter((e) =>
      isSameCalendarDay(new Date(e.date || e.createdAt), day)
    );
    if (!dayEntries.length) return null;
    const avg = dayEntries.reduce((sum, e) => sum + moodToScore(e.mood), 0) / dayEntries.length;
    const dominant = dayEntries[0].mood;
    return {
      date:  day.toISOString(),
      score: Math.round(avg * 10) / 10,
      mood:  dominant,
    };
  }).filter(Boolean);

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-text-secondary font-mono">
        Not enough data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2e2e35" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => format(parseISO(d), 'M/d')}
          tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
          interval={4}
        />
        <YAxis
          domain={[1, 5]}
          ticks={[1, 2, 3, 4, 5]}
          tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
        />
        <RechartsTooltip content={<MoodTooltip />} cursor={{ stroke: '#2e2e35' }} />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#6366f1"
          strokeWidth={1.5}
          dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }}
          activeDot={{ r: 4, fill: '#818cf8' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
