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
    <div onClick={onClick}>
      <h2 className="text-xl font-bold">{workoutSet.name}</h2>
      <p className="text-gray-600">{workoutSet.description}</p>
    </div>
  );
}
