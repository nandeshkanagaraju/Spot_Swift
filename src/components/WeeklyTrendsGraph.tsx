import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, TrendingUp, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DayData {
  day: string;
  fullDate: Date;
  morning: number;
  afternoon: number;
  evening: number;
  revenue: number;
  totalCars: number;
}

const WeeklyTrendsGraph = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generate week data based on current week
  const generateWeekData = (startDate: Date): DayData[] => {
    const data: DayData[] = [];
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() - currentDate.getDay()); // Start from Monday

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      
      // Generate more realistic data with patterns
      const isWeekend = i >= 5;
      const baseOccupancy = isWeekend ? 50 : 70;
      const randomVariation = () => Math.floor(Math.random() * 20) - 10;

      data.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: date,
        morning: Math.min(100, Math.max(0, baseOccupancy - 10 + randomVariation())),
        afternoon: Math.min(100, Math.max(0, baseOccupancy + 10 + randomVariation())),
        evening: Math.min(100, Math.max(0, baseOccupancy + 20 + randomVariation())),
        revenue: Math.floor(Math.random() * 10000) + 5000, // Random revenue between 5000-15000
        totalCars: Math.floor(Math.random() * 200) + 100, // Random number of cars between 100-300
      });
    }
    return data;
  };

  const [weekData, setWeekData] = useState<DayData[]>(generateWeekData(currentWeek));

  // Update data when week changes
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setWeekData(generateWeekData(currentWeek));
      setIsLoading(false);
    }, 500);
  }, [currentWeek]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const getBarColor = (value: number, type: 'morning' | 'afternoon' | 'evening') => {
    const baseColors = {
      morning: ['#93c5fd', '#2563eb'],    // Light blue to blue
      afternoon: ['#c084fc', '#7c3aed'],   // Light purple to purple
      evening: ['#818cf8', '#4f46e5'],     // Light indigo to indigo
    };

    return value >= 80 ? baseColors[type][1] : baseColors[type][0];
  };

  const maxHeight = 150;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-4">
          <CardTitle className="text-lg">Parking Analytics</CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateWeek('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {currentWeek.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateWeek('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click on bars to see detailed statistics</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>

      <CardContent>
        <div className={`space-y-6 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
          {/* Graph Legend */}
          <div className="flex justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded mr-1"></div>
              <span>Morning (6AM-12PM)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded mr-1"></div>
              <span>Afternoon (12PM-6PM)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded mr-1"></div>
              <span>Evening (6PM-12AM)</span>
            </div>
          </div>

          {/* Graph */}
          <div className="relative h-[200px]">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-muted-foreground">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            {/* Bars */}
            <div className="ml-8 h-full flex items-end justify-between">
              {weekData.map((day, index) => (
                <div key={index} className="flex flex-col items-center group">
                  {/* Bars Container */}
                  <div 
                    className="flex space-x-1 mb-2 cursor-pointer"
                    onClick={() => setSelectedDay(day)}
                  >
                    {/* Morning Bar */}
                    <div
                      className="w-4 rounded-t transition-all duration-300 hover:opacity-80 relative group"
                      style={{ 
                        height: `${(day.morning / 100) * maxHeight}px`,
                        background: `linear-gradient(to bottom, ${getBarColor(day.morning, 'morning')}, ${getBarColor(day.morning, 'morning')}88)`,
                      }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                        {day.morning}% Full
                      </div>
                    </div>
                    {/* Afternoon Bar */}
                    <div
                      className="w-4 rounded-t transition-all duration-300 hover:opacity-80 relative group"
                      style={{ 
                        height: `${(day.afternoon / 100) * maxHeight}px`,
                        background: `linear-gradient(to bottom, ${getBarColor(day.afternoon, 'afternoon')}, ${getBarColor(day.afternoon, 'afternoon')}88)`,
                      }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                        {day.afternoon}% Full
                      </div>
                    </div>
                    {/* Evening Bar */}
                    <div
                      className="w-4 rounded-t transition-all duration-300 hover:opacity-80 relative group"
                      style={{ 
                        height: `${(day.evening / 100) * maxHeight}px`,
                        background: `linear-gradient(to bottom, ${getBarColor(day.evening, 'evening')}, ${getBarColor(day.evening, 'evening')}88)`,
                      }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                        {day.evening}% Full
                      </div>
                    </div>
                  </div>
                  {/* Day Label */}
                  <span className={`text-sm font-medium ${
                    selectedDay?.day === day.day ? 'text-primary' : ''
                  }`}>
                    {day.day}
                  </span>
                </div>
              ))}
            </div>

            {/* Horizontal grid lines */}
            <div className="absolute left-8 right-0 top-0 bottom-0 flex flex-col justify-between -z-10">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="border-t border-dashed border-gray-200 w-full"
                ></div>
              ))}
            </div>
          </div>

          {/* Selected Day Details */}
          {selectedDay && (
            <div className="pt-4 border-t">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    {selectedDay.fullDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-blue-500" />
                      <span>{selectedDay.totalCars} vehicles</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span>₹{selectedDay.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className={
                  selectedDay.evening >= 80 ? "bg-red-100 text-red-800" :
                  selectedDay.evening >= 60 ? "bg-yellow-100 text-yellow-800" :
                  "bg-green-100 text-green-800"
                }>
                  {selectedDay.evening >= 80 ? "High Traffic" :
                   selectedDay.evening >= 60 ? "Moderate Traffic" :
                   "Low Traffic"}
                </Badge>
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Weekly Insights:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                <span>
                  Peak occupancy: {Math.max(...weekData.map(d => Math.max(d.morning, d.afternoon, d.evening)))}%
                  on {weekData.reduce((max, day) => 
                    Math.max(day.morning, day.afternoon, day.evening) > 
                    Math.max(max.morning, max.afternoon, max.evening) ? day : max
                  ).day}
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                <span>
                  Best availability: {Math.min(...weekData.map(d => Math.min(d.morning, d.afternoon, d.evening)))}%
                  on {weekData.reduce((min, day) => 
                    Math.min(day.morning, day.afternoon, day.evening) < 
                    Math.min(min.morning, min.afternoon, min.evening) ? day : min
                  ).day}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyTrendsGraph; 