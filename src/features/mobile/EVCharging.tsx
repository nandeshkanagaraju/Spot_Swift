interface EVMobileFeatures {
  // Remote monitoring
  chargeStatus: 'connecting' | 'charging' | 'complete' | 'error';
  batteryLevel: number;
  
  // Notifications
  pushNotifications: boolean;
  notifyAt: number; // battery percentage
  
  // Payment
  autoPayment: boolean;
  paymentMethod: string;
  
  // History
  chargingSessions: ChargingSession[];
  totalEnergySaved: number;
  carbonOffset: number;
} 