import { useMemo, useState } from "react";

interface MuscleData {
  target_area: string;
  total_volume: number;
}

interface MuscleHeatmapProps {
  data: MuscleData[];
}

const MUSCLE_LABELS: Record<string, string> = {
  upper_chest: "Upper Chest",
  middle_chest: "Mid Chest",
  lower_chest: "Lower Chest",
  front_deltoid: "Front Deltoid",
  side_deltoid: "Side Deltoid",
  rear_deltoid: "Rear Deltoid",
  upper_back: "Upper Back",
  mid_back: "Mid Back",
  lower_back: "Lower Back",
  lats: "Lats",
  biceps: "Biceps",
  triceps: "Triceps",
  forearms: "Forearms",
  quadriceps: "Quadriceps",
  hamstrings: "Hamstrings",
  glutes: "Glutes",
  calves: "Calves",
};

const getColor = (intensity: number): string => {
  if (intensity === 0) return "#e5e7eb";
  if (intensity < 0.25) return "#bfdbfe";
  if (intensity < 0.5) return "#60a5fa";
  if (intensity < 0.75) return "#f97316";
  return "#ef4444";
};

const getStroke = (intensity: number): string => {
  if (intensity === 0) return "#9ca3af";
  if (intensity < 0.25) return "#3b82f6";
  if (intensity < 0.5) return "#2563eb";
  if (intensity < 0.75) return "#ea580c";
  return "#dc2626";
};

export const MuscleHeatmap = ({ data }: MuscleHeatmapProps) => {
  const [tooltip, setTooltip] = useState<{
    area: string;
    volume: number;
  } | null>(null);

  const { muscleColors, muscleIntensities, volumeMap } = useMemo(() => {
    const vm: Record<string, number> = {};
    data.forEach((d) => {
      vm[d.target_area] = (vm[d.target_area] ?? 0) + Number(d.total_volume);
    });
    const maxVolume = Math.max(...Object.values(vm), 1);
    const colors: Record<string, string> = {};
    const intensities: Record<string, number> = {};
    Object.entries(vm).forEach(([area, volume]) => {
      const intensity = volume / maxVolume;
      colors[area] = getColor(intensity);
      intensities[area] = intensity;
    });
    return {
      muscleColors: colors,
      muscleIntensities: intensities,
      volumeMap: vm,
    };
  }, [data]);

  const c = (area: string) => muscleColors[area] ?? "#e5e7eb";
  const s = (area: string) => getStroke(muscleIntensities[area] ?? 0);

  const handleMouseEnter = (area: string) => {
    setTooltip({ area, volume: volumeMap[area] ?? 0 });
  };
  const handleMouseLeave = () => setTooltip(null);

  const MuscleGroup = ({
    area,
    children,
  }: {
    area: string;
    children: React.ReactNode;
  }) => (
    <g
      fill={c(area)}
      stroke={s(area)}
      strokeWidth="1"
      style={{ cursor: "pointer", transition: "fill 0.3s ease" }}
      onMouseEnter={() => handleMouseEnter(area)}
      onMouseLeave={handleMouseLeave}
      opacity={muscleIntensities[area] ? 1 : 0.6}
    >
      {children}
    </g>
  );

  const trainedMuscles = useMemo(
    () => Object.entries(volumeMap).sort((a, b) => b[1] - a[1]),
    [volumeMap],
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          Muscle Activity Map
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Hover over muscles to see volume. Color = training intensity.
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mb-4 text-xs text-gray-500 flex-wrap">
        <span className="font-medium">Intensity:</span>
        {[
          { color: "#e5e7eb", label: "None" },
          { color: "#bfdbfe", label: "Low" },
          { color: "#60a5fa", label: "Moderate" },
          { color: "#f97316", label: "High" },
          { color: "#ef4444", label: "Max" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div
              className="w-4 h-4 rounded-sm border border-gray-200"
              style={{ backgroundColor: color }}
            />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="mb-3 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg inline-block">
          <span className="font-semibold">
            {MUSCLE_LABELS[tooltip.area] ?? tooltip.area}
          </span>
          {tooltip.volume > 0 && (
            <span className="ml-2 text-gray-300">
              {tooltip.volume.toLocaleString()} kg volume
            </span>
          )}
        </div>
      )}

      {/* SVG Bodies */}
      <div className="flex justify-center gap-4 sm:gap-8 overflow-x-auto pb-2">
        {/* FRONT VIEW */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Front
          </span>
          <svg
            viewBox="0 0 160 340"
            className="w-32 sm:w-40 h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Head */}
            <ellipse
              cx="80"
              cy="22"
              rx="18"
              ry="20"
              fill="#fde68a"
              stroke="#d97706"
              strokeWidth="1"
            />

            {/* Neck */}
            <rect
              x="73"
              y="40"
              width="14"
              height="14"
              rx="4"
              fill="#fde68a"
              stroke="#d97706"
              strokeWidth="1"
            />

            {/* Torso base */}
            <path
              d="M45 54 Q80 50 115 54 L112 130 Q80 135 48 130 Z"
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth="0.5"
            />

            {/* Upper Chest */}
            <MuscleGroup area="upper_chest">
              <path d="M54 54 Q80 51 106 54 L104 68 Q80 65 56 68 Z" />
            </MuscleGroup>

            {/* Middle Chest */}
            <MuscleGroup area="middle_chest">
              <path d="M56 68 Q80 65 104 68 L102 80 Q80 78 58 80 Z" />
            </MuscleGroup>

            {/* Lower Chest */}
            <MuscleGroup area="lower_chest">
              <path d="M58 80 Q80 78 102 80 L100 90 Q80 89 60 90 Z" />
            </MuscleGroup>

            {/* Abs */}
            <rect
              x="60"
              y="90"
              width="40"
              height="40"
              rx="3"
              fill="#f9fafb"
              stroke="#e5e7eb"
              strokeWidth="0.8"
            />
            <line
              x1="80"
              y1="90"
              x2="80"
              y2="130"
              stroke="#e5e7eb"
              strokeWidth="0.8"
            />
            <line
              x1="60"
              y1="103"
              x2="100"
              y2="103"
              stroke="#e5e7eb"
              strokeWidth="0.8"
            />
            <line
              x1="60"
              y1="117"
              x2="100"
              y2="117"
              stroke="#e5e7eb"
              strokeWidth="0.8"
            />

            {/* Front Deltoid Left */}
            <MuscleGroup area="front_deltoid">
              <ellipse cx="40" cy="60" rx="11" ry="13" />
            </MuscleGroup>

            {/* Front Deltoid Right */}
            <MuscleGroup area="front_deltoid">
              <ellipse cx="120" cy="60" rx="11" ry="13" />
            </MuscleGroup>

            {/* Side Deltoid Left */}
            <MuscleGroup area="side_deltoid">
              <ellipse cx="29" cy="76" rx="9" ry="10" />
            </MuscleGroup>

            {/* Side Deltoid Right */}
            <MuscleGroup area="side_deltoid">
              <ellipse cx="131" cy="76" rx="9" ry="10" />
            </MuscleGroup>

            {/* Biceps Left */}
            <MuscleGroup area="biceps">
              <rect x="20" y="87" width="14" height="34" rx="7" />
            </MuscleGroup>

            {/* Biceps Right */}
            <MuscleGroup area="biceps">
              <rect x="126" y="87" width="14" height="34" rx="7" />
            </MuscleGroup>

            {/* Forearms Left */}
            <MuscleGroup area="forearms">
              <rect x="18" y="124" width="13" height="36" rx="6" />
            </MuscleGroup>

            {/* Forearms Right */}
            <MuscleGroup area="forearms">
              <rect x="129" y="124" width="13" height="36" rx="6" />
            </MuscleGroup>

            {/* Hands */}
            <ellipse
              cx="24"
              cy="168"
              rx="8"
              ry="6"
              fill="#fde68a"
              stroke="#d97706"
              strokeWidth="0.8"
            />
            <ellipse
              cx="136"
              cy="168"
              rx="8"
              ry="6"
              fill="#fde68a"
              stroke="#d97706"
              strokeWidth="0.8"
            />

            {/* Hip */}
            <path
              d="M48 130 Q80 135 112 130 L114 148 Q80 152 46 148 Z"
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth="0.8"
            />

            {/* Quadriceps Left */}
            <MuscleGroup area="quadriceps">
              <rect x="50" y="148" width="26" height="64" rx="10" />
            </MuscleGroup>

            {/* Quadriceps Right */}
            <MuscleGroup area="quadriceps">
              <rect x="84" y="148" width="26" height="64" rx="10" />
            </MuscleGroup>

            {/* Knee caps */}
            <ellipse
              cx="63"
              cy="218"
              rx="10"
              ry="7"
              fill="#e5e7eb"
              stroke="#9ca3af"
              strokeWidth="0.8"
            />
            <ellipse
              cx="97"
              cy="218"
              rx="10"
              ry="7"
              fill="#e5e7eb"
              stroke="#9ca3af"
              strokeWidth="0.8"
            />

            {/* Calves Left */}
            <MuscleGroup area="calves">
              <rect x="52" y="226" width="22" height="52" rx="9" />
            </MuscleGroup>

            {/* Calves Right */}
            <MuscleGroup area="calves">
              <rect x="86" y="226" width="22" height="52" rx="9" />
            </MuscleGroup>

            {/* Feet */}
            <ellipse
              cx="63"
              cy="284"
              rx="13"
              ry="6"
              fill="#fde68a"
              stroke="#d97706"
              strokeWidth="0.8"
            />
            <ellipse
              cx="97"
              cy="284"
              rx="13"
              ry="6"
              fill="#fde68a"
              stroke="#d97706"
              strokeWidth="0.8"
            />
          </svg>
        </div>

        {/* BACK VIEW */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Back
          </span>
          <svg
            viewBox="0 0 160 340"
            className="w-32 sm:w-40 h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Head */}
            <ellipse
              cx="80"
              cy="22"
              rx="18"
              ry="20"
              fill="#fde68a"
              stroke="#d97706"
              strokeWidth="1"
            />

            {/* Neck */}
            <rect
              x="73"
              y="40"
              width="14"
              height="14"
              rx="4"
              fill="#fde68a"
              stroke="#d97706"
              strokeWidth="1"
            />

            {/* Torso base */}
            <path
              d="M45 54 Q80 50 115 54 L112 130 Q80 135 48 130 Z"
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth="0.5"
            />

            {/* Rear Deltoid Left */}
            <MuscleGroup area="rear_deltoid">
              <ellipse cx="40" cy="60" rx="11" ry="13" />
            </MuscleGroup>

            {/* Rear Deltoid Right */}
            <MuscleGroup area="rear_deltoid">
              <ellipse cx="120" cy="60" rx="11" ry="13" />
            </MuscleGroup>

            {/* Upper Back */}
            <MuscleGroup area="upper_back">
              <path d="M52 54 Q80 51 108 54 L105 74 Q80 71 55 74 Z" />
            </MuscleGroup>

            {/* Lats Left */}
            <MuscleGroup area="lats">
              <path d="M46 68 L56 72 L54 108 L44 100 Z" />
            </MuscleGroup>

            {/* Lats Right */}
            <MuscleGroup area="lats">
              <path d="M114 68 L104 72 L106 108 L116 100 Z" />
            </MuscleGroup>

            {/* Mid Back */}
            <MuscleGroup area="mid_back">
              <path d="M56 74 Q80 71 104 74 L102 100 Q80 98 58 100 Z" />
            </MuscleGroup>

            {/* Lower Back */}
            <MuscleGroup area="lower_back">
              <path d="M58 100 Q80 98 102 100 L100 118 Q80 117 60 118 Z" />
            </MuscleGroup>

            {/* Spine line */}
            <line
              x1="80"
              y1="54"
              x2="80"
              y2="130"
              stroke="#d1d5db"
              strokeWidth="1.5"
              strokeDasharray="3 2"
            />

            {/* Triceps Left */}
            <MuscleGroup area="triceps">
              <rect x="20" y="82" width="14" height="36" rx="7" />
            </MuscleGroup>

            {/* Triceps Right */}
            <MuscleGroup area="triceps">
              <rect x="126" y="82" width="14" height="36" rx="7" />
            </MuscleGroup>

            {/* Forearms Left */}
            <MuscleGroup area="forearms">
              <rect x="18" y="122" width="13" height="36" rx="6" />
            </MuscleGroup>

            {/* Forearms Right */}
            <MuscleGroup area="forearms">
              <rect x="129" y="122" width="13" height="36" rx="6" />
            </MuscleGroup>

            {/* Hands */}
            <ellipse
              cx="24"
              cy="166"
              rx="8"
              ry="6"
              fill="#fde68a"
              stroke="#d97706"
              strokeWidth="0.8"
            />
            <ellipse
              cx="136"
              cy="166"
              rx="8"
              ry="6"
              fill="#fde68a"
              stroke="#d97706"
              strokeWidth="0.8"
            />

            {/* Glutes */}
            <MuscleGroup area="glutes">
              <path d="M48 130 Q80 135 112 130 L110 158 Q80 163 50 158 Z" />
            </MuscleGroup>

            {/* Hamstrings Left */}
            <MuscleGroup area="hamstrings">
              <rect x="50" y="158" width="26" height="58" rx="10" />
            </MuscleGroup>

            {/* Hamstrings Right */}
            <MuscleGroup area="hamstrings">
              <rect x="84" y="158" width="26" height="58" rx="10" />
            </MuscleGroup>

            {/* Back of knee */}
            <ellipse
              cx="63"
              cy="220"
              rx="10"
              ry="6"
              fill="#e5e7eb"
              stroke="#9ca3af"
              strokeWidth="0.8"
            />
            <ellipse
              cx="97"
              cy="220"
              rx="10"
              ry="6"
              fill="#e5e7eb"
              stroke="#9ca3af"
              strokeWidth="0.8"
            />

            {/* Calves Left */}
            <MuscleGroup area="calves">
              <rect x="52" y="228" width="22" height="50" rx="9" />
            </MuscleGroup>

            {/* Calves Right */}
            <MuscleGroup area="calves">
              <rect x="86" y="228" width="22" height="50" rx="9" />
            </MuscleGroup>

            {/* Feet */}
            <ellipse
              cx="63"
              cy="284"
              rx="13"
              ry="6"
              fill="#fde68a"
              stroke="#d97706"
              strokeWidth="0.8"
            />
            <ellipse
              cx="97"
              cy="284"
              rx="13"
              ry="6"
              fill="#fde68a"
              stroke="#d97706"
              strokeWidth="0.8"
            />
          </svg>
        </div>
      </div>

      {/* Trained muscles list */}
      {trainedMuscles.length > 0 && (
        <div className="mt-5 pt-4 border-t">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Muscles Trained
          </p>
          <div className="flex flex-wrap gap-2">
            {trainedMuscles.map(([area, volume]) => (
              <div
                key={area}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
                style={{
                  backgroundColor: muscleColors[area] + "33",
                  borderColor: muscleColors[area],
                  color: "#374151",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: muscleColors[area] }}
                />
                {MUSCLE_LABELS[area]}
                <span className="text-gray-400 font-normal">
                  {volume.toLocaleString()} kg
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {trainedMuscles.length === 0 && (
        <div className="mt-4 text-center text-sm text-gray-400 py-4">
          No muscle data for this period. Complete a workout to see your
          activity map.
        </div>
      )}
    </div>
  );
};

export default MuscleHeatmap;
