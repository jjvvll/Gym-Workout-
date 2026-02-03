import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage";
import WorkoutDetailPage from "./pages/WorkoutDetailPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
      </Routes>
    </>
  );
}

export default App;
