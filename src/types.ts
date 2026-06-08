export interface UserReview {
  id: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
}

export interface App {
  id: string;
  name: string;
  slug: string;
  version: string;
  category: string;
  size: string;
  rating: number;
  downloads: number;
  shortDescription: string;
  description: string;
  developer: string;
  lastUpdated: string;
  compatibility: string;
  features: string[];
  permissions: string[];
  whatsNew: string;
  apkUrl: string;
  iconUrl: string;
  screenshots: string[];
  isFeatured?: boolean;
  releaseDate: string;
  reviews?: UserReview[];
}

export interface UpdateTimeline {
  id: string;
  appId: string;
  appName: string;
  appIcon?: string;
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch';
  changes: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export interface StorageConfig {
  provider: 'firebase' | 'supabase' | 'cloudinary' | 's3' | 'local';
  apiKeys: {
    [key: string]: string;
  };
  isActive: boolean;
}

export interface AuthUser {
  email: string;
  role: 'admin' | 'user';
  name: string;
}

