import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addDays, startOfWeek, endOfWeek, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Settings, Info, Car, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Mock data for parking facilities in India
const parkingFacilities = [
  { id: "1", name: "Connaught Place Parking Complex", city: "New Delhi", rate: "₹60/hour" },
  { id: "2", name: "MG Road Parking Zone", city: "Bangalore", rate: "₹50/hour" },
  { id: "3", name: "Marine Drive Parking", city: "Mumbai", rate: "₹70/hour" },
  { id: "4", name: "Salt Lake Parking Area", city: "Kolkata", rate: "₹40/hour" },
];

// Initial mock events based on Indian context
const initialMockEvents = [
  {
    id: 1,
    title: "Connaught Place Parking",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    tag: "parking",
    facility: "Connaught Place Parking Complex",
    spotNumber: "A12",
    price: "₹120",
    dates: [
      new Date(2025, 3, 10)
    ]
  },
  {
    id: 2,
    title: "MG Road Parking",
    startTime: "2:30 PM",
    endTime: "4:30 PM",
    tag: "parking",
    facility: "MG Road Parking Zone",
    spotNumber: "B05",
    price: "₹100",
    dates: [new Date(2025, 3, 12)]
  },
  {
    id: 3,
    title: "Marine Drive Parking",
    startTime: "5:00 PM",
    endTime: "7:00 PM",
    tag: "parking",
    facility: "Marine Drive Parking",
    spotNumber: "C22",
    price: "₹140",
    dates: [new Date(2025, 3, 15)]
  }
];

interface ParkingEvent {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  tag: string;
  facility: string;
  spotNumber: string;
  price: string;
  dates: Date[];
}

const Calendar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<ParkingEvent[]>(initialMockEvents);
  const [isNewReservationOpen, setIsNewReservationOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(parkingFacilities[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("10:00 AM - 12:00 PM");
  const [spotNumber, setSpotNumber] = useState("A01");

  useEffect(() => {
    if (!user) {
      navigate("/");
      toast({
        title: "Access Denied",
        description: "Please log in to view your calendar",
        variant: "destructive",
      });
    } else {
      // In a real app, fetch user's reservations from Supabase here
      console.log("Fetching reservations for user:", user.id);
      // This would be replaced with actual API call to get reservations
    }
  }, [user, navigate, toast]);

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextWeek = () => {
    setCurrentWeek(addDays(currentWeek, 7));
  };

  const prevWeek = () => {
    setCurrentWeek(addDays(currentWeek, -7));
  };

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleAddReservation = () => {
    setIsNewReservationOpen(true);
  };

  const confirmReservation = () => {
    // Generate mock data for new reservation
    const newEvent = {
      id: Date.now(),
      title: selectedFacility.name.split(' ')[0] + " Parking",
      startTime: selectedTimeSlot.split(' - ')[0],
      endTime: selectedTimeSlot.split(' - ')[1],
      tag: "parking",
      facility: selectedFacility.name,
      spotNumber,
      price: calculatePrice(selectedTimeSlot, selectedFacility.id),
      dates: [selectedDate]
    };

    setEvents([...events, newEvent]);
    setIsNewReservationOpen(false);

    toast({
      title: "Reservation Added",
      description: `Parking spot ${spotNumber} reserved at ${selectedFacility.name}`,
    });
  };

  const calculatePrice = (timeSlot: string, facilityId: string) => {
    const startTime = timeSlot.split(' - ')[0];
    const endTime = timeSlot.split(' - ')[1];
    
    // Simple price calculation based on time difference (in a real app, this would be more sophisticated)
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    const hours = endHour - startHour;
    
    const ratePerHour = parseInt(parkingFacilities.find(f => f.id === facilityId)?.rate.replace('₹', '').split('/')[0] || "50");
    
    return `₹${hours * ratePerHour}`;
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day, i) => (
          <div
            key={i}
            className="text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = day;
        
        // Check if there are events on this day
        const hasEvents = events.some(event => 
          event.dates.some(eventDate => isSameDay(eventDate, cloneDay))
        );

        days.push(
          <div
            key={day.toString()}
            className={`relative p-2 text-center cursor-pointer border border-border hover:bg-accent ${
              !isSameMonth(day, monthStart) 
                ? "text-muted-foreground" 
                : isToday(day) 
                ? "bg-primary/10" 
                : ""
            } ${
              isSameDay(day, selectedDate) ? "bg-primary/20" : ""
            }`}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className={`${isToday(day) ? "font-bold" : ""}`}>
              {formattedDate}
            </span>
            {hasEvents && (
              <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                <span className="h-1 w-1 rounded-full bg-primary"></span>
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="mt-2">{rows}</div>;
  };

  const getDayEvents = (date: Date) => {
    return events.filter(event => 
      event.dates.some(eventDate => isSameDay(eventDate, date))
    );
  };

  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const timeSlots = Array.from({ length: 14 }, (_, i) => i + 6);

  const availableSpots = ["A01", "A02", "A03", "B01", "B02", "C01", "C02", "D01"];
  const timeSlotOptions = [
    "08:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
    "06:00 PM - 08:00 PM"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with navigation */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Parking Calendar</h1>
              <p className="text-muted-foreground">Manage your parking reservations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of your calendar content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Parking Calendar</h1>
          <div className="flex items-center gap-2">
            <Button onClick={() => setSelectedDate(new Date())}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Today
            </Button>
            <Button variant="outline" onClick={handleAddReservation}>
              <Plus className="mr-2 h-4 w-4" />
              Add Reservation
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-3">
            <Card>
              <CardContent className="p-4">
                {renderHeader()}
                {renderDays()}
                {renderCells()}
              </CardContent>
            </Card>
            <div className="mt-4">
              <h3 className="font-medium mb-2">My calendars</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span>Parking Reservations</span>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span>Personal</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-9">
            <Card className="mb-4">
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={prevWeek}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-lg font-semibold">
                    Week of {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
                  </h2>
                  <Button variant="outline" size="sm" onClick={nextWeek}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center bg-secondary rounded-md p-1">
                    <Button variant="ghost" size="sm" className="rounded-r-none">
                      Day
                    </Button>
                    <Button variant="secondary" size="sm" className="rounded-none">
                      Week
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-l-none">
                      Month
                    </Button>
                  </div>
                </div>
              </div>
              <CardContent className="p-0">
                <div className="grid grid-cols-8 border-b">
                  <div className="p-2 border-r"></div>
                  {weekDays.map((day, i) => (
                    <div key={i} className="p-2 text-center border-r">
                      <div className="font-medium">{format(day, "EEE")}</div>
                      <div className={`text-lg ${isToday(day) ? "bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto" : ""}`}>
                        {format(day, "d")}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="relative">
                  {timeSlots.map((hour) => (
                    <div key={hour} className="grid grid-cols-8 border-b">
                      <div className="p-2 border-r text-xs text-right pr-3">
                        {hour % 12 || 12} {hour >= 12 ? 'PM' : 'AM'}
                      </div>
                      {weekDays.map((day, i) => (
                        <div key={i} className="p-1 border-r h-12 relative">
                          {getDayEvents(day)
                            .filter(event => {
                              const startHour = parseInt(event.startTime.split(':')[0]);
                              const amPm = event.startTime.includes('PM');
                              const convertedHour = amPm && startHour !== 12 ? startHour + 12 : startHour;
                              return convertedHour === hour;
                            })
                            .map(event => (
                              <div 
                                key={event.id} 
                                className="absolute p-1 rounded text-xs w-[95%] overflow-hidden bg-blue-100 text-blue-800 border-l-4 border-blue-500"
                                style={{
                                  top: '0px',
                                  height: '100%'
                                }}
                              >
                                <div className="font-medium">{event.title}</div>
                                <div>{event.spotNumber} · {event.price}</div>
                              </div>
                            ))
                          }
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  {format(selectedDate, "MMMM d, yyyy")}
                  {isToday(selectedDate) && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Today</span>
                  )}
                </h3>
                
                <div className="mt-4">
                  {getDayEvents(selectedDate).length > 0 ? (
                    <div className="space-y-2">
                      {getDayEvents(selectedDate).map(event => (
                        <div key={event.id} className="flex justify-between items-center p-3 border rounded hover:bg-accent/50">
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-100 p-2 rounded">
                              <Car className="h-5 w-5 text-blue-800" />
                            </div>
                            <div>
                              <div className="font-medium">{event.title}</div>
                              <div className="text-sm text-muted-foreground">{event.startTime} - {event.endTime}</div>
                              <div className="text-sm text-muted-foreground">{event.facility}</div>
                              <div className="text-sm font-medium">Spot: {event.spotNumber}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-2">{event.price}</Badge>
                            <Button variant="outline" size="sm" className="block ml-auto">View</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground py-8">
                      <Info className="h-12 w-12 mb-2 opacity-20" />
                      <p>No reservations for this day</p>
                      <Button variant="outline" className="mt-4" onClick={handleAddReservation}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add reservation
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={isNewReservationOpen} onOpenChange={setIsNewReservationOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Parking Reservation</DialogTitle>
              <DialogDescription>
                Create a new parking reservation for {format(selectedDate, "MMMM d, yyyy")}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="facility" className="text-right">Parking Facility</label>
                <select 
                  id="facility" 
                  className="col-span-3 p-2 border rounded" 
                  value={selectedFacility.id}
                  onChange={(e) => setSelectedFacility(parkingFacilities.find(f => f.id === e.target.value) || parkingFacilities[0])}
                >
                  {parkingFacilities.map(facility => (
                    <option key={facility.id} value={facility.id}>
                      {facility.name}, {facility.city} ({facility.rate})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="time-slot" className="text-right">Time Slot</label>
                <select 
                  id="time-slot" 
                  className="col-span-3 p-2 border rounded"
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                >
                  {timeSlotOptions.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="spot" className="text-right">Parking Spot</label>
                <select 
                  id="spot" 
                  className="col-span-3 p-2 border rounded"
                  value={spotNumber}
                  onChange={(e) => setSpotNumber(e.target.value)}
                >
                  {availableSpots.map(spot => (
                    <option key={spot} value={spot}>{spot}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right">Price</label>
                <div className="col-span-3 font-medium">
                  {calculatePrice(selectedTimeSlot, selectedFacility.id)}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewReservationOpen(false)}>Cancel</Button>
              <Button onClick={confirmReservation}>Confirm Reservation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Calendar;
