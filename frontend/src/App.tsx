import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage";
import WorkoutDetailPage from "./pages/WorkoutDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
    </Routes>
  );
}

export default App;
