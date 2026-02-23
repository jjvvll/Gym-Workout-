import VolumeChart from "../components/VolumeChart";

const ReportsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Progress Reports
        </h1>
        <VolumeChart />
      </div>
    </div>
  );
};

export default ReportsPage;
