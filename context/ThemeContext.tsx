
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SystemConfig } from '../types';
import { MockService } from '../services/mockService';

interface ThemeContextType {
  theme: SystemConfig['theme'];
  site: SystemConfig['site'];
  refreshTheme: () => void;
  updateThemeDirectly: (newTheme: SystemConfig['theme']) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_THEME_CONFIG: SystemConfig = {
    theme: { preset: 'standard', primaryColor: '#7C3AED', secondaryColor: '#1E293B', mode: 'dark', font: 'Inter' },
    plans: { free: { name: 'Básico', price: 49, limit: 100, active: true }, pro: { name: 'Pro', price: 99, limit: 9999, active: true }, enterprise: { name: 'Enterprise', price: 199, limit: 9999, active: true } },
    site: { name: 'RexCart', description: '', logoMain: null, logoSmall: null, whatsapp: '', email: '' }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SystemConfig>(DEFAULT_THEME_CONFIG);

  const refreshTheme = async () => {
    try {
        const newConfig = await MockService.getSystemConfig();
        if (newConfig) setConfig(newConfig);
    } catch (error) {
        console.error("Failed to load theme", error);
    }
  };

  const updateThemeDirectly = (newTheme: SystemConfig['theme']) => {
      setConfig(prev => ({ ...prev, theme: newTheme }));
  };

  // Initial load
  useEffect(() => {
    refreshTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ 
        theme: config.theme, 
        site: config.site, 
        refreshTheme,
        updateThemeDirectly 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
