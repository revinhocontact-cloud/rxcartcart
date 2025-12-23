
import { PosterConfig, PrintQueueItem, Product, User, UserRole, Template, SystemConfig, MOCK_PRODUCTS } from '../types';

// URL do Backend (Localhost para desenvolvimento)
const API_URL = 'http://localhost:3000';

// Chaves para persistência local
const LOCAL_PRODUCTS_KEY = 'rexcart_products_v1';
const LOCAL_QUEUE_KEY = 'rexcart_queue_v1';
const LOCAL_CONFIG_KEY = 'rexcart_config_v1';

// Mock Users for Fallback
const MOCK_USER: User = {
  id: '1',
  name: 'Usuário Demo',
  email: 'demo@rexcart.com',
  role: UserRole.CUSTOMER,
  plan: 'PRO',
  validUntil: '2025-12-31',
  status: 'ACTIVE',
  createdAt: new Date().toISOString()
};

const MOCK_ADMIN: User = {
  id: '2',
  name: 'Admin User',
  email: 'admin@rexcart.com',
  role: UserRole.ADMIN,
  plan: 'ENTERPRISE',
  validUntil: '2099-12-31',
  status: 'ACTIVE',
  createdAt: new Date().toISOString()
};

// Default System Config
const DEFAULT_CONFIG: SystemConfig = {
  theme: { preset: 'standard', primaryColor: '#7C3AED', secondaryColor: '#1E293B', mode: 'dark', font: 'Inter' },
  plans: { free: { name: 'Básico', price: 49, limit: 100, active: true }, pro: { name: 'Pro', price: 99, limit: 9999, active: true }, enterprise: { name: 'Enterprise', price: 199, limit: 9999, active: true } },
  site: { name: 'RexCart', description: 'Sistema de cartazes', logoMain: null, logoSmall: null, whatsapp: '', email: '' }
};

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Authorization': token ? `Bearer ${token}` : ''
  };
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Erro na requisição: ${res.status}`);
  }
  return res.json();
};

const getLocalProducts = (): Product[] => {
    const stored = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    return stored ? JSON.parse(stored) : MOCK_PRODUCTS;
};

const saveLocalProducts = (products: Product[]) => {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
};

const getLocalQueue = (): PrintQueueItem[] => {
    const stored = localStorage.getItem(LOCAL_QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
};

const saveLocalQueue = (queue: PrintQueueItem[]) => {
    localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(queue));
};

export const MockService = {
  // --- AUTH ---
  login: async (email: string, password: string): Promise<User> => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await handleResponse(res);
      if (data.token) localStorage.setItem('token', data.token);
      return data.user;
    } catch (error: any) {
      if (email === 'demo@rexcart.com' && password === 'demo') return MOCK_USER;
      if (email === 'admin@rexcart.com' && password === 'admin') return MOCK_ADMIN;
      throw error;
    }
  },

  register: async (user: User, password: string): Promise<User> => {
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name, email: user.email, password: password, role: user.role })
        });
        const data = await handleResponse(res);
        if (data.token) localStorage.setItem('token', data.token);
        return data.user;
    } catch (error: any) {
        return { ...user, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString(), status: 'ACTIVE' };
    }
  },

  // --- USERS ---
  getUsers: async (): Promise<User[]> => {
    try {
        const res = await fetch(`${API_URL}/users`, { headers: getHeaders() });
        if (!res.ok) return [MOCK_USER];
        return await res.json();
    } catch {
        return [MOCK_USER, MOCK_ADMIN];
    }
  },

  createUser: async (user: User) => {
    return MockService.register(user, user.password || '123456');
  },

  updateUser: async (user: User): Promise<User> => {
      try {
        const res = await fetch(`${API_URL}/users/${user.id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(user)
        });
        return await handleResponse(res);
      } catch (e) {
          return user;
      }
  },

  deleteUser: async (id: string) => {
     try {
        await fetch(`${API_URL}/users/${id}`, { method: 'DELETE', headers: getHeaders() });
     } catch (e) {}
  },

  // --- SYSTEM CONFIG ---
  getSystemConfig: async (): Promise<SystemConfig> => {
      try {
        const res = await fetch(`${API_URL}/data?type=config`, { headers: getHeaders() });
        if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) return data[0] as SystemConfig;
        }
      } catch (e) {}

      // Fallback para LocalStorage
      const stored = localStorage.getItem(LOCAL_CONFIG_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_CONFIG;
  },

  saveSystemConfig: async (config: SystemConfig) => {
      // Salvar localmente primeiro para resposta instantânea
      localStorage.setItem(LOCAL_CONFIG_KEY, JSON.stringify(config));

      try {
        await fetch(`${API_URL}/data`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ type: 'config', ...config })
        });
      } catch (e) {}
  },

  // --- PRODUCTS ---
  getProducts: async (): Promise<Product[]> => {
      try {
        const res = await fetch(`${API_URL}/data?type=product`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Offline');
        const data = await res.json();
        return data.length ? data : getLocalProducts();
      } catch (error) {
        return getLocalProducts();
      }
  },

  addProduct: async (product: Product) => {
      if (!product.id) product.id = Math.random().toString(36).substr(2, 9);
      try {
        const res = await fetch(`${API_URL}/data`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ type: 'product', ...product }) });
        return handleResponse(res);
      } catch (e) {
          const current = getLocalProducts();
          saveLocalProducts([product, ...current]);
          return product;
      }
  },

  updateProduct: async (product: Product) => {
    try {
        const res = await fetch(`${API_URL}/data/${product.id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ type: 'product', ...product }) });
        return handleResponse(res);
    } catch (e) {
        const current = getLocalProducts();
        saveLocalProducts(current.map(p => p.id === product.id ? product : p));
        return product;
    }
  },

  deleteProduct: async (id: string) => {
      try {
        await fetch(`${API_URL}/data/${id}`, { method: 'DELETE', headers: getHeaders() });
      } catch (e) {
          const current = getLocalProducts();
          saveLocalProducts(current.filter(p => p.id !== id));
      }
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const products = await MockService.getProducts();
    if (!query) return products;
    const lower = query.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(lower) || p.code.includes(lower));
  },

  // --- TEMPLATES ---
  getTemplates: async (): Promise<Template[]> => {
      try {
        const res = await fetch(`${API_URL}/data?type=template`, { headers: getHeaders() });
        if (!res.ok) return [];
        return await res.json();
      } catch { return []; }
  },

  addTemplate: async (template: Template) => {
      try {
        const res = await fetch(`${API_URL}/data`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ type: 'template', ...template }) });
        return handleResponse(res);
      } catch (e) { return template; }
  },

  // --- HISTORY ---
  getHistory: async (): Promise<PosterConfig[]> => {
      try {
        const res = await fetch(`${API_URL}/data?type=history`, { headers: getHeaders() });
        return await res.json();
      } catch { return getLocalQueue(); }
  },

  // --- QUEUE ---
  getQueue: async (): Promise<PrintQueueItem[]> => {
    try {
        const res = await fetch(`${API_URL}/data?type=queue`, { headers: getHeaders() });
        return await res.json();
    } catch { return getLocalQueue(); }
  },

  addToQueue: async (item: PosterConfig) => {
    const queueItem = { ...item, id: item.id || Math.random().toString(36).substr(2, 9), quantity: 1 };
    try {
        await fetch(`${API_URL}/data`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ type: 'queue', ...queueItem }) });
    } catch (e) {
        const current = getLocalQueue();
        saveLocalQueue([...current, queueItem as PrintQueueItem]);
    }
  },

  removeFromQueue: async (id: string) => { 
    try {
        await fetch(`${API_URL}/data/${id}`, { method: 'DELETE', headers: getHeaders() });
    } catch (e) {
        const current = getLocalQueue();
        saveLocalQueue(current.filter(i => i.id !== id));
    }
  },

  clearQueue: async () => {
    try {
        const queue = await MockService.getQueue();
        await Promise.all(queue.map(item => MockService.removeFromQueue(item.id)));
    } catch (e) { saveLocalQueue([]); }
  },
  
  uploadImage: async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append('image', file);
      try {
          const res = await fetch(`${API_URL}/upload/image`, { method: 'POST', headers: getHeaders(true), body: formData });
          const data = await handleResponse(res);
          return data.imageUrl;
      } catch (error) {
          return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
          });
      }
  }
};
