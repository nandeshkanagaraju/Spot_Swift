import { useParkingSystem } from '@/contexts/ParkingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/utils/pricing';

const UserProfile = () => {
  const { state } = useParkingSystem();
  const { userStats, reservations } = state;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Total Spent</h4>
              <p className="text-2xl font-bold">{formatPrice(userStats.totalSpent)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Total Reservations</h4>
              <p className="text-2xl font-bold">{userStats.reservationsCount}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Favorite Location</h4>
              <p className="text-lg">{userStats.favoriteLocation.name}</p>
              <p className="text-sm text-muted-foreground">
                {userStats.favoriteLocation.visits} visits
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reservations
              .slice(0, 5)
              .map(reservation => (
                <div
                  key={reservation.id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{reservation.facilityName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(reservation.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(reservation.price)}</p>
                    <p className="text-sm text-muted-foreground">
                      {reservation.status}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile; 