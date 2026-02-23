import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getVolumeOverTime } from "../services/workoutLogsService";
import type { VolumeLog } from "../services/workoutLogsService";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const VolumeChart = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [data, setData] = useState<VolumeLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate year options (last 5 years)
  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getVolumeOverTime(year, month);
        if (response.success) {
          setData(response.data);
        }
      } catch {
        setError("Failed to load volume data.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [year, month]);

  // Format date for X axis e.g. "Feb 1"
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Format tooltip value
  const formatVolume = (value: number) => `${value.toLocaleString()} kg`;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Total Volume Over Time
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Daily total tonnage lifted (sets × reps × weight)
          </p>
        </div>

        {/* Filters - full width on mobile */}
        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="flex items-center justify-center h-48 sm:h-64 text-gray-400 text-sm">
          Loading...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-48 sm:h-64 text-red-400 text-sm">
          {error}
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-gray-400">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 mb-3 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-sm">No workout data for this period.</p>
          <p className="text-xs mt-1">
            Complete a workout to see your progress.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="performed_on"
              tickFormatter={formatDate}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              formatter={(value: any) => [formatVolume(value), "Volume"]}
              labelFormatter={(label) => formatDate(label)}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                fontSize: "13px",
              }}
            />
            <Line
              type="monotone"
              dataKey="total_volume"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Summary */}
      {data.length > 0 && (
        <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm text-gray-500">
          <span>
            {data.length} training day{data.length !== 1 ? "s" : ""} this month
          </span>
          <span className="font-semibold text-gray-700">
            Total:{" "}
            {data
              .reduce((sum, d) => sum + Number(d.total_volume), 0)
              .toLocaleString()}{" "}
            kg
          </span>
        </div>
      )}
    </div>
  );
};

export default VolumeChart;
