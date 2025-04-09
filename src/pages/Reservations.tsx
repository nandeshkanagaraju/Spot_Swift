
import { useEffect } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Reservations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to home if not authenticated
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Indian context data for reservations - in a real app, this would come from your backend
  const reservations = [
    {
      id: "res-001",
      facilityName: "Connaught Place Parking Complex",
      spotNumber: "A23",
      date: "2025-04-15",
      startTime: "09:00 AM",
      endTime: "05:00 PM",
      status: "upcoming",
      price: "₹480.00",
      location: "New Delhi"
    },
    {
      id: "res-002",
      facilityName: "MG Road Parking Zone",
      spotNumber: "B12",
      date: "2025-04-12",
      startTime: "10:00 AM",
      endTime: "03:00 PM",
      status: "active",
      price: "₹250.00",
      location: "Bangalore"
    },
    {
      id: "res-003",
      facilityName: "Marine Drive Parking",
      spotNumber: "C45",
      date: "2025-04-05",
      startTime: "08:00 AM",
      endTime: "06:00 PM",
      status: "completed",
      price: "₹700.00",
      location: "Mumbai"
    },
    {
      id: "res-004",
      facilityName: "Salt Lake Parking Area",
      spotNumber: "A15",
      date: "2025-03-28",
      startTime: "02:00 PM",
      endTime: "06:00 PM",
      status: "completed",
      price: "₹180.00",
      location: "Kolkata"
    },
    {
      id: "res-005",
      facilityName: "Phoenix Mall Parking",
      spotNumber: "D22",
      date: "2025-04-20",
      startTime: "11:00 AM",
      endTime: "04:00 PM",
      status: "upcoming",
      price: "₹320.00",
      location: "Chennai"
    },
    {
      id: "res-006",
      facilityName: "Lulu Mall Parking",
      spotNumber: "E08",
      date: "2025-04-18",
      startTime: "02:00 PM",
      endTime: "07:00 PM",
      status: "upcoming",
      price: "₹350.00",
      location: "Kochi"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-500">Upcoming</Badge>;
      case "completed":
        return <Badge variant="outline" className="text-muted-foreground">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onLoginClick={() => {}} />

      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Reservations</h1>
            <p className="text-muted-foreground">
              View and manage your parking reservations across India.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/calendar">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
            </Link>
            <Badge className="bg-green-500">Active</Badge>
            <Badge className="bg-blue-500">Upcoming</Badge>
            <Badge variant="outline" className="text-muted-foreground">Completed</Badge>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">All Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Facility</TableHead>
                    <TableHead>Spot</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate('/calendar')}>
                      <TableCell className="font-medium">
                        <div>
                          {reservation.facilityName}
                          <div className="text-xs text-muted-foreground flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {reservation.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{reservation.spotNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {reservation.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          {reservation.startTime} - {reservation.endTime}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                      <TableCell className="text-right">{reservation.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Reservations;
