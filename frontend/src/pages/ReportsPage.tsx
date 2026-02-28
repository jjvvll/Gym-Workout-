import VolumeChart from "../components/VolumeChart";
import MuscleHeatmap from "../components/Muscleheatmap";
import { useState, useEffect } from "react";
import { getMuscleVolume } from "../services/workoutLogsService";
import type { MuscleVolumeData } from "../services/workoutLogsService";
import type { VolumeLog } from "../services/workoutLogsService";
import { getVolumeOverTime } from "../services/workoutLogsService";
import toast from "react-hot-toast";
import LoadingPopup from "../components/LoadingPopup";
import { useNavigate } from "react-router-dom";

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

const ReportsPage = () => {
  const navigate = useNavigate();
  const now = new Date();
  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);
  const [muscleData, setMuscleData] = useState<MuscleVolumeData[]>([]);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const [data, setData] = useState<VolumeLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string | undefined>();

  useEffect(() => {
    const fetch = async () => {
      const response = await getMuscleVolume(year, month);
      if (response.success) {
        setMuscleData(response.data);
      }
    };
    fetch();
  }, [year, month]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setMessage("Loading");

      try {
        const response = await getVolumeOverTime(year, month);
        if (response.success) {
          setData(response.data);
        }
      } catch {
        toast.error("Failed to load volume data.");
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [year, month]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-2">
        <div className="flex items-center gap-3">
          {/* Home button */}
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors"
            aria-label="Go to home"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7m-9 5v6h4v-6m-4 0H9m6 0h-2"
              />
            </svg>
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Progress Reports
          </h1>
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

        <VolumeChart
          year={year}
          month={month}
          loading={loading}
          error={error}
          data={data}
        />
        <MuscleHeatmap data={muscleData} />
        <LoadingPopup isOpen={loading} message={message} />
      </div>
    </div>
  );
};

export default ReportsPage;
