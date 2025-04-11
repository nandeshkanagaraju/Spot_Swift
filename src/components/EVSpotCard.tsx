interface EVSpotDetails {
  spotId: string;
  chargerType: 'DC' | 'AC';
  power: number;
  status: 'available' | 'charging' | 'reserved' | 'maintenance';
  estimatedWaitTime?: number;
  pricing: {
    base: number;
    peakHourRate: number;
    chargingRate: number;
  };
  features: {
    hasCanopy: boolean;
    hasSmartPayment: boolean;
    supportedStandards: string[];
  };
} 