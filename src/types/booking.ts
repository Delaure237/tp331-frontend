export type PaymentMethod = 'onsite' | 'mobile' | 'card';

export interface Service {
  id: string;
  name: string;
}

export interface Operation {
  id: string;
  name: string;
  serviceId: string;
  price?: number;
}

export interface Doctor {
  id: string;
  name: string;
  serviceId: string;
  specialty?: string;
}

// Interface pour le récapitulatif final
export interface BookingSummary {
  bookingNumber: string;
  clinicName: string;
  clinicAddress: string;
  doctorName: string;
  serviceName: string;
  dateTime: string;
}