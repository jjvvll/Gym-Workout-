import type { WorkoutSet } from "../services/workoutService";

type WorkoutSetCardProps = {
  workoutSet: WorkoutSet;
  onClick?: () => void | Promise<void>;
};

export default function WorkoutSetCard({
  workoutSet,
  onClick,
}: WorkoutSetCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer group overflow-hidden rounded-xl"
      style={{
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
        boxShadow:
          "0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Diagonal slash accent */}
      <div
        className="absolute top-0 right-0 w-24 h-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"
        style={{
          background: "linear-gradient(135deg, transparent 40%, #e94560 100%)",
        }}
      />

      {/* Top red corner slash */}
      <div
        className="absolute top-0 right-0 w-16 h-16"
        style={{
          background: "linear-gradient(225deg, #e94560 0%, transparent 60%)",
          opacity: 0.8,
        }}
      />

      <div className="relative p-4 sm:p-5">
        {/* Workout name */}
        <h2
          className="text-lg font-black text-white uppercase tracking-widest leading-tight mb-1"
          style={{
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            letterSpacing: "0.12em",
          }}
        >
          {workoutSet.name}
        </h2>

        {/* Description */}
        {workoutSet.description && (
          <p
            className="text-xs mb-3 line-clamp-1"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            {workoutSet.description}
          </p>
        )}

        {/* Divider */}
        <div className="w-8 h-0.5 mb-3" style={{ background: "#e94560" }} />

        {/* Exercise tags */}
        <div className="flex flex-wrap gap-1.5">
          {workoutSet.exercises.map((exercise) => (
            <span
              key={exercise.id}
              className="px-2 py-0.5 text-xs font-bold uppercase tracking-wide rounded"
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.1)",
                letterSpacing: "0.08em",
              }}
            >
              {exercise.name}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between mt-4 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <span
            className="text-xs font-black uppercase tracking-widest"
            style={{ color: "#e94560" }}
          >
            {workoutSet.exercises.length} Exercise
            {workoutSet.exercises.length !== 1 ? "s" : ""}
          </span>

          {/* Arrow */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
            style={{
              background: "rgba(233,69,96,0.15)",
              border: "1px solid rgba(233,69,96,0.3)",
            }}
          >
            <svg
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200"
              style={{ color: "#e94560" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
