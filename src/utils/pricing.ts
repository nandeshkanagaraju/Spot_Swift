export const PRICING = {
  BASE_RATES: {
    standard: 50, // ₹50 per hour
    compact: 40,  // ₹40 per hour
    accessible: 45, // ₹45 per hour
    electric: 60,  // ₹60 per hour
  },
  
  TIME_MULTIPLIERS: {
    peak: 1.5,    // 50% more during peak hours
    normal: 1.0,
    offPeak: 0.8, // 20% discount during off-peak
  },
  
  DURATION_DISCOUNTS: {
    above12Hours: 0.8,  // 20% discount for >12 hours
    above6Hours: 0.9,   // 10% discount for >6 hours
    regular: 1.0
  },

  // Peak hours definition (24-hour format)
  PEAK_HOURS: {
    morning: { start: 8, end: 10 },
    evening: { start: 17, end: 19 }
  }
};

export const formatPrice = (amount: number): string => {
  return `₹${amount.toFixed(0)}`;
};

export const calculateParkingPrice = (
  baseRate: number,
  startTime: string,
  endTime: string,
  type: keyof typeof PRICING.BASE_RATES
): {
  basePrice: number;
  finalPrice: number;
  duration: number;
  discount: number;
  timeMultiplier: number;
} => {
  // Convert times to Date objects for calculation
  const start = new Date(`2000-01-01T${startTime}`);
  let end = new Date(`2000-01-01T${endTime}`);
  
  // If end time is before start time, assume it's for the next day
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }
  
  // Calculate duration in hours
  const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  
  // Get base price for the spot type
  const basePrice = PRICING.BASE_RATES[type];
  
  // Calculate time multiplier based on peak hours
  const startHour = start.getHours();
  let timeMultiplier = PRICING.TIME_MULTIPLIERS.normal;
  
  if ((startHour >= PRICING.PEAK_HOURS.morning.start && startHour <= PRICING.PEAK_HOURS.morning.end) ||
      (startHour >= PRICING.PEAK_HOURS.evening.start && startHour <= PRICING.PEAK_HOURS.evening.end)) {
    timeMultiplier = PRICING.TIME_MULTIPLIERS.peak;
  } else if (startHour < 6 || startHour > 22) {
    timeMultiplier = PRICING.TIME_MULTIPLIERS.offPeak;
  }
  
  // Calculate duration discount
  let durationDiscount = PRICING.DURATION_DISCOUNTS.regular;
  if (duration > 12) {
    durationDiscount = PRICING.DURATION_DISCOUNTS.above12Hours;
  } else if (duration > 6) {
    durationDiscount = PRICING.DURATION_DISCOUNTS.above6Hours;
  }
  
  // Calculate final price
  const finalPrice = Math.round(basePrice * duration * timeMultiplier * durationDiscount);
  const discount = (1 - (durationDiscount * timeMultiplier)) * 100;
  
  return {
    basePrice,
    finalPrice,
    duration,
    discount,
    timeMultiplier
  };
};

export const getPriceBreakdown = (
  type: keyof typeof PRICING.BASE_RATES,
  startTime: string,
  endTime: string
) => {
  const calculation = calculateParkingPrice(
    PRICING.BASE_RATES[type],
    startTime,
    endTime,
    type
  );
  
  return {
    baseRate: formatPrice(PRICING.BASE_RATES[type]),
    duration: `${Math.floor(calculation.duration)}h ${Math.round((calculation.duration % 1) * 60)}m`,
    subtotal: formatPrice(PRICING.BASE_RATES[type] * calculation.duration),
    timeMultiplier: calculation.timeMultiplier === PRICING.TIME_MULTIPLIERS.peak ? 'Peak Hours (+50%)' :
                    calculation.timeMultiplier === PRICING.TIME_MULTIPLIERS.offPeak ? 'Off-Peak (-20%)' : 'Standard Rate',
    discount: calculation.discount > 0 ? `${calculation.discount.toFixed(0)}% Off` : 'No Discount',
    finalPrice: formatPrice(calculation.finalPrice)
  };
}; 