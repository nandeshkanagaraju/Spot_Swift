import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface SpotType {
  id: string;
  name: string;
  icon: string;
  rate: number;
  description: string;
  color: string;
}

const SpotStatusGuide = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const spotTypes: SpotType[] = [
    {
      id: 'standard',
      name: 'Standard',
      icon: '🚗',
      rate: 50,
      description: 'Regular parking spot suitable for most vehicles',
      color: 'bg-blue-500'
    },
    {
      id: 'compact',
      name: 'Compact',
      icon: '🚙',
      rate: 40,
      description: 'Smaller spots ideal for hatchbacks and compact cars',
      color: 'bg-green-500'
    },
    {
      id: 'accessible',
      name: 'Accessible',
      icon: '♿',
      rate: 45,
      description: 'Wheelchair accessible spots with extra space',
      color: 'bg-purple-500'
    },
    {
      id: 'ev',
      name: 'EV Charging',
      icon: '⚡',
      rate: 60,
      description: 'Spots equipped with EV charging stations',
      color: 'bg-yellow-500'
    }
  ];

  const spotStatuses = [
    {
      id: 'available',
      name: 'Available',
      color: 'bg-green-500',
      description: 'Ready to be booked'
    },
    {
      id: 'occupied',
      name: 'Occupied',
      color: 'bg-red-500',
      description: 'Currently in use'
    },
    {
      id: 'reserved',
      name: 'Reserved',
      color: 'bg-yellow-500',
      description: 'Booked for later'
    }
  ];

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Spot Types */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Spot Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {spotTypes.map((type) => (
              <motion.div
                key={type.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
                className={`
                  relative p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${selectedType === type.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <div className="text-center space-y-2">
                  <span className="text-3xl">{type.icon}</span>
                  <div>
                    <div className="font-medium">{type.name}</div>
                    <div className="text-sm text-muted-foreground">₹{type.rate}/hr</div>
                  </div>
                </div>
                
                {/* Info overlay on selection */}
                {selectedType === type.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-background/95 p-4 rounded-lg"
                  >
                    <div className="h-full flex items-center justify-center text-center">
                      <div>
                        <Info className="h-5 w-5 mx-auto mb-2 text-primary" />
                        <p className="text-sm">{type.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Spot Status */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Spot Status</h3>
          <div className="grid grid-cols-3 gap-4">
            {spotStatuses.map((status) => (
              <motion.div
                key={status.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-lg bg-gray-50 border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${status.color}`} />
                  <div>
                    <div className="font-medium">{status.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {status.description}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interactive Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-700">Booking Tips</h4>
              <ul className="mt-2 space-y-1 text-sm text-blue-600">
                <li>• Click on any spot type above to learn more</li>
                <li>• Rates vary based on spot type and duration</li>
                <li>• Accessible spots require valid permits</li>
                <li>• EV spots include charging station access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SpotStatusGuide; 