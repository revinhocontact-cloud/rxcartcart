
import { PosterConfig, PrintQueueItem, Product, User, UserRole, Template, SystemConfig, MOCK_PRODUCTS, Ticket, TicketMessage, TicketStatus, TicketPriority } from '../types';

// URL do Backend
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

// Chaves para persistência local
const LOCAL_PRODUCTS_KEY = 'rexcart_products_v1';
const LOCAL_QUEUE_KEY = 'rexcart_queue_v1';
const LOCAL_CONFIG_KEY = 'rexcart_config_v1';
const LOCAL_TICKETS_KEY = 'rexcart_tickets_v1';
const LOCAL_MESSAGES_KEY = 'rexcart_messages_v1';

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

const MOCK_SUPPORT: User = {
  id: '3',
  name: 'Suporte Técnico',
  email: 'suporte@rexcart.com',
  role: UserRole.SUPPORT,
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

// --- TICKET HELPERS ---
const getLocalTickets = (): Ticket[] => {
    const stored = localStorage.getItem(LOCAL_TICKETS_KEY);
    return stored ? JSON.parse(stored) : [];
};

const saveLocalTickets = (tickets: Ticket[]) => {
    localStorage.setItem(LOCAL_TICKETS_KEY, JSON.stringify(tickets));
};

const getLocalMessages = (): TicketMessage[] => {
    const stored = localStorage.getItem(LOCAL_MESSAGES_KEY);
    return stored ? JSON.parse(stored) : [];
};

const saveLocalMessages = (msgs: TicketMessage[]) => {
    localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(msgs));
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
      if (email === 'suporte@rexcart.com' && password === 'suporte') return MOCK_SUPPORT;
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
        return [MOCK_USER, MOCK_ADMIN, MOCK_SUPPORT];
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
  },

  // --- TICKETS (SUPPORT) ---
  
  getTickets: async (userId: string, role: UserRole): Promise<Ticket[]> => {
      const tickets = getLocalTickets();
      // Admin e Support podem ver todos os tickets
      if (role === UserRole.ADMIN || role === UserRole.SUPPORT) {
          return tickets; 
      }
      return tickets.filter(t => t.userId === userId);
  },

  getTicketMessages: async (ticketId: string): Promise<TicketMessage[]> => {
      const msgs = getLocalMessages();
      return msgs.filter(m => m.ticketId === ticketId).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  createTicket: async (ticket: Partial<Ticket>, initialMessage: string, sender: User): Promise<Ticket> => {
      const tickets = getLocalTickets();
      const messages = getLocalMessages();
      
      const newTicket: Ticket = {
          id: Math.random().toString(36).substr(2, 9),
          userId: sender.id,
          userName: sender.name,
          subject: ticket.subject!,
          priority: ticket.priority!,
          status: TicketStatus.OPEN,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastMessage: initialMessage
      };

      const newMessage: TicketMessage = {
          id: Math.random().toString(36).substr(2, 9),
          ticketId: newTicket.id,
          senderId: sender.id,
          senderName: sender.name,
          senderRole: sender.role,
          message: initialMessage,
          createdAt: new Date().toISOString(),
          isAdmin: sender.role === UserRole.ADMIN || sender.role === UserRole.SUPPORT
      };

      saveLocalTickets([newTicket, ...tickets]);
      saveLocalMessages([...messages, newMessage]);

      return newTicket;
  },

  sendTicketMessage: async (ticketId: string, message: string, sender: User): Promise<TicketMessage> => {
      const messages = getLocalMessages();
      const tickets = getLocalTickets();

      const isStaff = sender.role === UserRole.ADMIN || sender.role === UserRole.SUPPORT;

      const newMessage: TicketMessage = {
          id: Math.random().toString(36).substr(2, 9),
          ticketId: ticketId,
          senderId: sender.id,
          senderName: sender.name,
          senderRole: sender.role,
          message: message,
          createdAt: new Date().toISOString(),
          isAdmin: isStaff
      };

      // Update ticket status if admin/support replies
      const updatedTickets = tickets.map(t => {
          if (t.id === ticketId) {
              return {
                  ...t,
                  updatedAt: new Date().toISOString(),
                  lastMessage: message,
                  // If staff sends message, set to ANSWERED, if user sends, set back to OPEN
                  status: isStaff ? TicketStatus.ANSWERED : TicketStatus.OPEN
              };
          }
          return t;
      });

      saveLocalMessages([...messages, newMessage]);
      saveLocalTickets(updatedTickets);

      return newMessage;
  },

  updateTicketStatus: async (ticketId: string, status: TicketStatus): Promise<void> => {
      const tickets = getLocalTickets();
      const updatedTickets = tickets.map(t => t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t);
      saveLocalTickets(updatedTickets);
  }
};
