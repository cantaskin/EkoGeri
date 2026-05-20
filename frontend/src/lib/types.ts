export type Role = "SUPER_ADMIN" | "MUNICIPALITY_ADMIN" | "CITIZEN";
export type WasteType = "PLASTIC" | "PAPER" | "GLASS" | "ORGANIC" | "MIXED";
export type ContainerStatus = "ACTIVE" | "FULL" | "MAINTENANCE";
export type RewardCategory = "DISCOUNT" | "TRANSPORT" | "INTERNET" | "OTHER";

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  points: number;
  totalWasteKg: number;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  email: string;
  fullName: string;
  role: Role;
  points: number;
}

export interface Container {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  capacityKg: number;
  currentFillKg: number;
  fillPercentage: number;
  wasteType: WasteType;
  status: ContainerStatus;
  qrCode: string;
  createdAt: string;
}

export interface WasteDeposit {
  id: number;
  containerId: number;
  containerName: string;
  wasteType: WasteType;
  weightKg: number;
  pointsEarned: number;
  totalPoints?: number;
  depositedAt: string;
}

export interface Reward {
  id: number;
  name: string;
  description: string;
  pointsCost: number;
  category: RewardCategory;
  stock: number;
  isActive: boolean;
}

export interface Redemption {
  id: number;
  user: User;
  reward: Reward;
  pointsSpent: number;
  status: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  id: number;
  fullName: string;
  points: number;
  totalWasteKg: number;
}

export const WASTE_TYPE_LABELS: Record<WasteType, string> = {
  PLASTIC: "Plastik",
  PAPER: "Kağıt",
  GLASS: "Cam",
  ORGANIC: "Organik",
  MIXED: "Karışık",
};

export const WASTE_TYPE_POINTS: Record<WasteType, number> = {
  PLASTIC: 10,
  PAPER: 8,
  GLASS: 12,
  ORGANIC: 5,
  MIXED: 3,
};

export const REWARD_CATEGORY_LABELS: Record<RewardCategory, string> = {
  DISCOUNT: "İndirim",
  TRANSPORT: "Ulaşım",
  INTERNET: "İnternet",
  OTHER: "Diğer",
};

export interface ContainerReport {
  id: number;
  containerId: number;
  containerName: string;
  description: string;
  status: "OPEN" | "RESOLVED";
  createdAt: string;
}

export interface WasteCollection {
  id: number;
  containerId: number;
  containerName: string;
  collectedWeightKg: number;
  collectedAt: string;
}

export const WASTE_CO2_SAVINGS_KG: Record<WasteType, number> = {
  PLASTIC: 1.5,
  PAPER: 0.8,
  GLASS: 0.3,
  ORGANIC: 0.5,
  MIXED: 0.5,
};

export const TREE_CO2_PER_YEAR = 21;
