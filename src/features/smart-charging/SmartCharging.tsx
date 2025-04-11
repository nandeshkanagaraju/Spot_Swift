interface SmartChargingFeatures {
  // Queue management
  queuePosition: number;
  estimatedWaitTime: number;
  
  // Load balancing
  currentLoad: number;
  maxCapacity: number;
  
  // Notifications
  chargingComplete: boolean;
  timeRemaining: number;
  
  // Energy management
  currentPower: number;
  energyDelivered: number;
  cost: number;
} 