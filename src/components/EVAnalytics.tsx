interface EVAnalytics {
  usage: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  revenue: {
    perStation: number;
    total: number;
  };
  environmental: {
    carbonSaved: number;
    greenEnergy: number;
  };
  maintenance: {
    uptime: number;
    nextService: Date;
    issues: MaintenanceIssue[];
  };
} 