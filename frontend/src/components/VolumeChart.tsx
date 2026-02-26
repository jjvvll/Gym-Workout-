import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { generateAnalysis } from "../services/workoutService";
import toast from "react-hot-toast";
import type { VolumeLog } from "../services/workoutLogsService";

interface ReportsPageProps {
  year: number;
  month: number;
  loading: boolean;
  error: boolean;
  data: VolumeLog[];
}

const VolumeChart = ({
  year,
  month,
  loading,
  error,
  data,
}: ReportsPageProps) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analyzingLoading, setAnalyzingLoading] = useState(false);

  const handleGenerateAnalysis = async () => {
    setAnalyzingLoading(true);
    setAnalysis(null);
    try {
      const response = await generateAnalysis(year, month);
      if (response.success) {
        setAnalysis(response.message);
      } else {
        toast.error(response.message);
      }
    } catch {
      toast.error("Failed to generate analysis.");
    } finally {
      setAnalyzingLoading(false);
    }
  };

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
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={handleGenerateAnalysis}
            disabled={analyzingLoading}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {analyzingLoading ? "Analyzing..." : "✨ Generate AI Analysis"}
          </button>

          {analysis && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-gray-700 leading-relaxed">
              <p className="font-semibold text-blue-600 mb-1">AI Analysis</p>
              <p>{analysis}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VolumeChart;
