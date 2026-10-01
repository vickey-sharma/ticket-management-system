export default function StatsCard({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md w-full">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <h1 className="text-2xl font-bold mt-2">{value}</h1>
    </div>
  );
}