import { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Reservation {
  id: string;
  userId: string;
  facilityId: string;
  facilityName: string;
  spotNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  type: 'standard' | 'compact' | 'accessible' | 'electric';
}

interface UserStats {
  totalSpent: number;
  reservationsCount: number;
  favoriteLocation: {
    name: string;
    visits: number;
  };
  lastBooking: string;
}

interface FacilityOccupancy {
  facilityId: string;
  morning: number;
  afternoon: number;
  evening: number;
  date: string;
}

interface ParkingState {
  reservations: Reservation[];
  userStats: UserStats;
  occupancyData: FacilityOccupancy[];
  loading: boolean;
  error: string | null;
}

type ParkingAction =
  | { type: 'ADD_RESERVATION'; payload: Reservation }
  | { type: 'UPDATE_RESERVATION'; payload: Reservation }
  | { type: 'CANCEL_RESERVATION'; payload: string }
  | { type: 'UPDATE_USER_STATS'; payload: Partial<UserStats> }
  | { type: 'UPDATE_OCCUPANCY'; payload: FacilityOccupancy }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };

const initialState: ParkingState = {
  reservations: [],
  userStats: {
    totalSpent: 0,
    reservationsCount: 0,
    favoriteLocation: {
      name: '',
      visits: 0,
    },
    lastBooking: '',
  },
  occupancyData: [],
  loading: false,
  error: null,
};

const ParkingContext = createContext<{
  state: ParkingState;
  dispatch: React.Dispatch<ParkingAction>;
  makeReservation: (reservationData: Omit<Reservation, 'id' | 'userId' | 'status'>) => Promise<void>;
  cancelReservation: (reservationId: string) => Promise<void>;
  getOccupancyData: (facilityId: string, date: string) => Promise<FacilityOccupancy>;
} | undefined>(undefined);

const parkingReducer = (state: ParkingState, action: ParkingAction): ParkingState => {
  switch (action.type) {
    case 'ADD_RESERVATION':
      return {
        ...state,
        reservations: [...state.reservations, action.payload],
        userStats: {
          ...state.userStats,
          totalSpent: state.userStats.totalSpent + action.payload.price,
          reservationsCount: state.userStats.reservationsCount + 1,
          lastBooking: action.payload.date,
        },
      };

    case 'UPDATE_RESERVATION':
      return {
        ...state,
        reservations: state.reservations.map(res =>
          res.id === action.payload.id ? action.payload : res
        ),
      };

    case 'CANCEL_RESERVATION':
      return {
        ...state,
        reservations: state.reservations.map(res =>
          res.id === action.payload ? { ...res, status: 'cancelled' } : res
        ),
      };

    case 'UPDATE_USER_STATS':
      return {
        ...state,
        userStats: { ...state.userStats, ...action.payload },
      };

    case 'UPDATE_OCCUPANCY':
      return {
        ...state,
        occupancyData: [
          ...state.occupancyData.filter(occ => 
            occ.facilityId !== action.payload.facilityId || 
            occ.date !== action.payload.date
          ),
          action.payload,
        ],
      };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

export const ParkingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(parkingReducer, initialState);
  const { user } = useAuth();

  // Load user's data when authenticated
  useEffect(() => {
    if (user) {
      loadUserData(user.id);
    }
  }, [user]);

  const loadUserData = async (userId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // In a real app, these would be API calls
      const userReservations = await fetchUserReservations(userId);
      const userStats = await fetchUserStats(userId);
      
      userReservations.forEach(reservation => {
        dispatch({ type: 'ADD_RESERVATION', payload: reservation });
      });
      
      dispatch({ type: 'UPDATE_USER_STATS', payload: userStats });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const makeReservation = async (reservationData: Omit<Reservation, 'id' | 'userId' | 'status'>) => {
    if (!user) throw new Error('User not authenticated');
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // In a real app, this would be an API call
      const newReservation: Reservation = {
        ...reservationData,
        id: `res-${Date.now()}`,
        userId: user.id,
        status: 'upcoming',
      };

      // Update facility occupancy
      const occupancyUpdate = calculateOccupancyUpdate(newReservation);
      dispatch({ type: 'UPDATE_OCCUPANCY', payload: occupancyUpdate });

      // Add reservation
      dispatch({ type: 'ADD_RESERVATION', payload: newReservation });

      // Update user stats
      updateUserStats(newReservation);

      return newReservation;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to make reservation' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const cancelReservation = async (reservationId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // In a real app, this would be an API call
      await simulateApiCall();
      dispatch({ type: 'CANCEL_RESERVATION', payload: reservationId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to cancel reservation' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getOccupancyData = async (facilityId: string, date: string) => {
    const existing = state.occupancyData.find(
      occ => occ.facilityId === facilityId && occ.date === date
    );
    if (existing) return existing;

    // In a real app, this would be an API call
    const occupancy = await fetchFacilityOccupancy(facilityId, date);
    dispatch({ type: 'UPDATE_OCCUPANCY', payload: occupancy });
    return occupancy;
  };

  return (
    <ParkingContext.Provider value={{ 
      state, 
      dispatch, 
      makeReservation, 
      cancelReservation,
      getOccupancyData,
    }}>
      {children}
    </ParkingContext.Provider>
  );
};

export const useParkingSystem = () => {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error('useParkingSystem must be used within a ParkingProvider');
  }
  return context;
};

// Helper functions (in a real app, these would be API calls)
const simulateApiCall = () => new Promise(resolve => setTimeout(resolve, 1000));

const fetchUserReservations = async (userId: string): Promise<Reservation[]> => {
  await simulateApiCall();
  return []; // Mock data
};

const fetchUserStats = async (userId: string): Promise<UserStats> => {
  await simulateApiCall();
  return initialState.userStats; // Mock data
};

const fetchFacilityOccupancy = async (facilityId: string, date: string): Promise<FacilityOccupancy> => {
  await simulateApiCall();
  return {
    facilityId,
    date,
    morning: Math.random() * 100,
    afternoon: Math.random() * 100,
    evening: Math.random() * 100,
  };
};

const calculateOccupancyUpdate = (reservation: Reservation): FacilityOccupancy => {
  // Logic to calculate how this reservation affects facility occupancy
  return {
    facilityId: reservation.facilityId,
    date: reservation.date,
    morning: Math.random() * 100,
    afternoon: Math.random() * 100,
    evening: Math.random() * 100,
  };
};

const updateUserStats = (reservation: Reservation) => {
  // Logic to update user statistics based on new reservation
}; 