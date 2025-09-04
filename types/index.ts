export interface User {
  id: string;
  email: string;
  name: string;
  reputationScore: number;
  vehicleInfo?: VehicleInfo;
}

export interface VehicleInfo {
  model: string;
  batteryCapacity: number;
  maxRange: number;
  efficiency: number;
}

export interface ChargingStation {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  stationType: 'AC' | 'DC';
  connectors: Connector[];
  amenities: string[];
  confidenceScore: number;
  lastVerified: Date;
  isOperational: boolean;
}

export interface Connector {
  type: string;
  power: number;
  status: 'available' | 'occupied' | 'outOfService';
  bayNumber: number;
}

export interface StationReport {
  id: string;
  stationId: string;
  userId: string;
  reportType: 'operational' | 'outOfService' | 'busy';
  description: string;
  timestamp: Date;
  verified: boolean;
}