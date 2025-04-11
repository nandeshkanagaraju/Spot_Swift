interface EVChargingStation {
  id: string;
  type: 'DC' | 'AC';
  power: number;
  status: 'available' | 'charging' | 'maintenance' | 'error';
  currentSession?: {
    startTime: Date;
    estimatedEndTime: Date;
    currentPower: number;
    energyDelivered: number;
  };
  errorCode?: string;
  lastMaintenance?: Date;
} 