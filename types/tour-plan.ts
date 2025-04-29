export interface TourPlan {
  id: string;
  startLocation: string;
  endLocation: string;
  startDate: string;
  endDate: string;
  vehicle: string;
  numOfMembers: number;
  travelType: string;
  description?: string;
  createdAt: string;
  clientId?: string;
}
