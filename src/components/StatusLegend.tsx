import { Badge } from "@/components/ui/badge";

const StatusLegend = () => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-green-500"></div>
        <span className="text-sm text-gray-600">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-red-500"></div>
        <span className="text-sm text-gray-600">Occupied</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
        <span className="text-sm text-gray-600">Reserved</span>
      </div>
    </div>
  );
};

export default StatusLegend; 