import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface DashboardData {
  totalProjects: number;
  totalContracts: number;
  availableApartments: number;
  notAvailableApartments: number;
  contractsPerMonth: {
    month: string;
    count: number;
  }[];
  recentPayments: {
    id: number;
    paymentDate: string;
    amount: number;
    clientId: number;
    clientFullName: string;
    clientPhoneNumber: string;
    clientEmail: string;
    apartmentId: number;
    apartmentMainName: {
      arabic: string;
      english: string;
    };
  }[];
}

export interface DashboardResponse {
  code: number;
  message: {
    arabic: string;
    english: string;
  };
  data: DashboardData;
}

export function useDashboardStats() {
  return useQuery<DashboardResponse>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get('/statics/dashboard');
      return response.data;
    },
  });
}
