import { Nomination, Status, AuditLog, AdminUser, NominationStats } from '../types';
import { SEED_NOMINATIONS, MOCK_ADMIN } from '../constants';

const STORAGE_KEYS = {
  NOMINATIONS: 'goias_nominations',
  AUDIT: 'goias_audit',
  USER_SESSION: 'goias_admin_session',
  IP_LOG: 'goias_ip_log' // { ip: timestamp }
};

// Initialize Data if empty
if (!localStorage.getItem(STORAGE_KEYS.NOMINATIONS)) {
  localStorage.setItem(STORAGE_KEYS.NOMINATIONS, JSON.stringify(SEED_NOMINATIONS));
}

// Helpers
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const getIP = () => '192.168.1.' + Math.floor(Math.random() * 255); // Mock IP

export const DataService = {
  // Public Actions
  submitNomination: async (data: Omit<Nomination, 'id' | 'status' | 'ip' | 'userAgent' | 'createdAt'>): Promise<{ success: boolean; message: string }> => {
    await delay(600);
    const ip = getIP();
    
    // Check Rate Limit (1 per 24h)
    const ipLog = JSON.parse(localStorage.getItem(STORAGE_KEYS.IP_LOG) || '{}');
    const lastVote = ipLog[ip];
    const now = Date.now();
    
    // For demo purposes, we will relax this constraint slightly if it's a "fresh" browser session often, 
    // but implement the logic logic.
    if (lastVote && now - lastVote < 24 * 60 * 60 * 1000) {
      // In a real app we'd block, but for demo testing we might allow rapid entry if needed.
      // Uncomment below to enforce strictly:
      // return { success: false, message: 'Você já realizou uma indicação nas últimas 24 horas.' };
    }

    const newNomination: Nomination = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: Status.PENDING,
      ip,
      userAgent: navigator.userAgent,
      createdAt: new Date().toISOString()
    };

    const nominations = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOMINATIONS) || '[]');
    nominations.push(newNomination);
    localStorage.setItem(STORAGE_KEYS.NOMINATIONS, JSON.stringify(nominations));

    // Update IP log
    ipLog[ip] = now;
    localStorage.setItem(STORAGE_KEYS.IP_LOG, JSON.stringify(ipLog));

    return { success: true, message: 'Indicação enviada com sucesso! Aguarde a moderação.' };
  },

  getPublicResults: async (): Promise<Nomination[]> => {
    await delay(400);
    const nominations: Nomination[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOMINATIONS) || '[]');
    return nominations.filter(n => n.status === Status.APPROVED);
  },

  // Admin Actions
  login: async (email: string, pass: string): Promise<AdminUser | null> => {
    await delay(800);
    if (email === MOCK_ADMIN.email && pass === MOCK_ADMIN.password) {
      const user = { id: 'admin-1', email, name: 'Administrador Principal' };
      localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
  },

  getCurrentUser: (): AdminUser | null => {
    const u = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    return u ? JSON.parse(u) : null;
  },

  getAllNominations: async (): Promise<Nomination[]> => {
    await delay(500);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOMINATIONS) || '[]');
  },

  updateNomination: async (id: string, updates: Partial<Nomination>, adminEmail: string): Promise<void> => {
    await delay(400);
    const nominations: Nomination[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOMINATIONS) || '[]');
    const index = nominations.findIndex(n => n.id === id);
    if (index === -1) throw new Error('Not found');

    const oldStatus = nominations[index].status;
    nominations[index] = { ...nominations[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.NOMINATIONS, JSON.stringify(nominations));

    // Audit Log
    const logs: AuditLog[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT) || '[]');
    let actionDesc = `Updated ID ${id}`;
    if (updates.status && updates.status !== oldStatus) {
      actionDesc = `Changed status of "${nominations[index].dishName}" to ${updates.status}`;
    } else if (updates.dishName) {
      actionDesc = `Renamed dish to "${updates.dishName}"`;
    }
    
    logs.push({
      id: Date.now().toString(),
      adminEmail,
      action: actionDesc,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(logs));
  },

  getStats: async (): Promise<NominationStats> => {
    const nominations: Nomination[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOMINATIONS) || '[]');
    const stats: NominationStats = {
      total: nominations.length,
      approved: 0,
      pending: 0,
      rejected: 0,
      byCity: {},
      byDish: {},
      byRestaurant: {}
    };

    nominations.forEach(n => {
      // Counts
      if (n.status === Status.APPROVED) stats.approved++;
      if (n.status === Status.PENDING) stats.pending++;
      if (n.status === Status.REJECTED) stats.rejected++;

      // Aggregates (regardless of status for admin view, usually. Or maybe just all)
      // Let's count ALL for dashboard visibility
      stats.byCity[n.city] = (stats.byCity[n.city] || 0) + 1;
      
      const dishKey = n.dishName.toLowerCase().trim();
      // Capitalize for display key
      const displayDish = dishKey.charAt(0).toUpperCase() + dishKey.slice(1);
      stats.byDish[displayDish] = (stats.byDish[displayDish] || 0) + 1;

      const restKey = n.restaurantName;
      stats.byRestaurant[restKey] = (stats.byRestaurant[restKey] || 0) + 1;
    });

    return stats;
  }
};
