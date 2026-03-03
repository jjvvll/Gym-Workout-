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
      className="relative cursor-pointer group overflow-hidden rounded-xl bg-white border border-gray-100"
      style={{
        boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400" />

      {/* Corner diagonal highlight */}
      <div
        className="absolute top-1 right-0 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
        style={{
          background: "linear-gradient(225deg, #2563eb 0%, transparent 70%)",
        }}
      />

      <div className="relative p-4 sm:p-5">
        {/* Workout name */}
        <h2
          className="text-base font-black text-gray-900 uppercase leading-tight mb-1"
          style={{ letterSpacing: "0.1em" }}
        >
          {workoutSet.name}
        </h2>

        {/* Description */}
        {workoutSet.description && (
          <p className="text-xs text-gray-400 mb-3 line-clamp-1">
            {workoutSet.description}
          </p>
        )}

        {/* Divider */}
        <div className="w-8 h-0.5 mb-3 bg-blue-500 rounded-full" />

        {/* Exercise tags */}
        <div className="flex flex-wrap gap-1.5">
          {workoutSet.exercises.map((exercise) => (
            <span
              key={exercise.id}
              className="px-2 py-0.5 text-xs font-bold uppercase tracking-wide rounded bg-gray-100 text-gray-500 border border-gray-200"
              style={{ letterSpacing: "0.06em" }}
            >
              {exercise.name}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <span className="text-xs font-black uppercase tracking-widest text-blue-500">
            {workoutSet.exercises.length} Exercise
            {workoutSet.exercises.length !== 1 ? "s" : ""}
          </span>

          {/* Arrow */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
            style={{
              background: "rgba(37,99,235,0.08)",
              border: "1px solid rgba(37,99,235,0.2)",
            }}
          >
            <svg
              className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-0.5 transition-transform duration-200"
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
