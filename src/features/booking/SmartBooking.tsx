interface SmartBookingFeatures {
  flexibleTiming: {
    earlyBirdDiscount: number;
    peakHourPricing: number;
    lastMinuteAvailability: boolean;
  };
  subscriptionPlans: {
    daily: PlanDetails;
    weekly: PlanDetails;
    monthly: PlanDetails;
  };
}

const SmartBookingSystem = () => {
  return (
    <div>
      {/* Flexible booking options */}
      <RecurringBookings />
      <GroupBookings />
      <CorporateBookings />
      <EventParking />
    </div>
  );
}; 