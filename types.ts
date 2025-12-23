

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER'
}

export enum PaperSize {
  A3 = 'A3',
  A4 = 'A4',
  A5 = 'A5',
  A6 = 'A6'
}

export enum CampaignType {
  NORMAL = 'NORMAL',
  OFFER = 'OFFER',
  CLEARANCE = 'CLEARANCE'
}

// Added VisionFormat enum to support RexCart Vision module templates
export enum VisionFormat {
  FEED = 'FEED',
  STORY = 'STORY',
  A4 = 'A4'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  validUntil: string; // ISO Date
  cpf?: string;
  address?: string;
  phone?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'PENDING';
  usage?: number;
  createdAt?: string;
  password?: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  oldPrice?: number;
  unit: string; // un, kg, lt
  description?: string;
  category?: string;
  image?: string;
  createdAt?: string;
}

export interface Template {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: string;
}

export interface PosterLayoutConfig {
  productName?: { x: number; y: number; scale: number };
  price?: { x: number; y: number; scale: number };
  description?: { x: number; y: number; scale: number };
}

export interface PosterConfig {
  id: string;
  productId: string;
  productName: string;
  price: number;
  oldPrice?: number;
  unit: string;
  description: string;
  campaign: CampaignType;
  size: PaperSize;
  layout?: PosterLayoutConfig;
  createdAt: string;
}

export interface PrintQueueItem extends PosterConfig {
  quantity: number;
}

export interface PlanDetails {
  name: string;
  price: number;
  limit: number;
  active: boolean;
}

export interface SystemConfig {
  theme: {
    preset: string;
    primaryColor: string;
    secondaryColor: string;
    mode: 'dark' | 'light';
    font: string;
  };
  plans: {
    free: PlanDetails;
    pro: PlanDetails;
    enterprise: PlanDetails;
  };
  site: {
    name: string;
    description: string;
    logoMain: string | null;
    logoSmall: string | null;
    whatsapp: string;
    email: string;
  };
}

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', code: '5229999', name: 'Arroz Anceli 5 KG', price: 25.90, unit: 'UN', category: 'Alimentos', createdAt: '2025-12-06', description: 'Arroz branco tipo 1' },
  { id: '2', code: '002', name: 'Feijão Carioca', price: 8.50, unit: 'kg', category: 'Alimentos', createdAt: '2025-12-05' },
  { id: '3', code: '003', name: 'Óleo de Soja', price: 5.99, unit: 'un', category: 'Óleos', createdAt: '2025-12-04', description: '900ml' },
  { id: '4', code: '004', name: 'Leite Integral', price: 4.29, unit: 'lt', category: 'Laticínios', createdAt: '2025-12-03' },
  { id: '5', code: '005', name: 'Café Torrado', price: 18.90, unit: '500g', category: 'Bebidas', createdAt: '2025-12-02' },
];

export const CAMPAIGN_STYLES = {
  [CampaignType.NORMAL]: { bg: 'bg-white', text: 'text-slate-900', border: 'border-slate-200', label: 'Preço Normal', accent: 'bg-blue-600' },
  [CampaignType.OFFER]: { bg: 'bg-yellow-400', text: 'text-red-700', border: 'border-yellow-500', label: 'APROVEITE', accent: 'bg-red-600' },
  [CampaignType.CLEARANCE]: { bg: 'bg-red-600', text: 'text-white', border: 'border-red-700', label: 'SALDÃO', accent: 'bg-yellow-400' }
};

export const PAPER_DIMENSIONS = {
  [PaperSize.A3]: { w: 297, h: 420, label: 'A3', dim: '297 x 420 mm' },
  [PaperSize.A4]: { w: 210, h: 297, label: 'A4', dim: '210 x 297 mm' },
  [PaperSize.A5]: { w: 148, h: 210, label: 'A5', dim: '148 x 210 mm' },
  [PaperSize.A6]: { w: 105, h: 148, label: 'A6', dim: '105 x 148 mm' },
};
