const PriceCard = ({ type, basePrice, available }: { 
  type: string; 
  basePrice: number; 
  available: boolean;
}) => (
  <div className="p-4 border rounded-lg">
    <h3 className="text-lg font-semibold capitalize">{type}</h3>
    <div className="mt-2 space-y-2">
      <p className="text-2xl font-bold">₹{basePrice}/hr</p>
      <p className={`text-sm ${available ? 'text-green-500' : 'text-red-500'}`}>
        {available ? 'Available' : 'Currently Full'}
      </p>
    </div>
  </div>
); 