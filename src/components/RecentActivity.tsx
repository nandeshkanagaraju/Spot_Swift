import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Car } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "check-in" | "check-out" | "reservation" | "payment";
  location: string;
  time: string;
  date: string;
  amount?: string;
  status: "completed" | "upcoming" | "in-progress";
}

const RecentActivity = () => {
  // Indian context data for recent activities
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "check-out",
      location: "Connaught Place Parking Complex",
      time: "9:30 AM",
      date: "Today",
      amount: "₹180.00",
      status: "completed",
    },
    {
      id: "2",
      type: "reservation",
      location: "MG Road Multilevel Parking",
      time: "2:00 PM",
      date: "Today",
      amount: "₹250.00",
      status: "upcoming",
    },
    {
      id: "3",
      type: "check-in",
      location: "Select Citywalk Mall Parking",
      time: "10:15 AM",
      date: "Yesterday",
      amount: "₹120.00",
      status: "completed",
    },
  ];

  const getStatusBadge = (status: ActivityItem["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="text-xs bg-green-50 text-green-600">
            Completed
          </Badge>
        );
      case "upcoming":
        return (
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600">
            Upcoming
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-600">
            In Progress
          </Badge>
        );
      default:
        return null;
    }
  };

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "check-in":
        return <Car className="h-4 w-4 text-green-500" />;
      case "check-out":
        return <Car className="h-4 w-4 text-red-500" />;
      case "reservation":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case "payment":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between p-3 border-b last:border-b-0 border-border hover:bg-muted/30 rounded-md cursor-pointer transition-colors"
          >
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-3">
                {getActivityIcon(activity.type)}
              </div>
              <div>
                <div className="flex items-center">
                  <h4 className="font-medium">
                    {activity.type === "check-in"
                      ? "Checked In"
                      : activity.type === "check-out"
                      ? "Checked Out"
                      : activity.type === "reservation"
                      ? "Reserved Spot"
                      : "Payment"}
                  </h4>
                  <div className="ml-2">{getStatusBadge(activity.status)}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {activity.location}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{activity.time}</div>
              <div className="text-xs text-muted-foreground">{activity.date}</div>
              {activity.amount && (
                <div className="text-xs font-medium text-parkblue-700 mt-1">
                  {activity.amount}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
