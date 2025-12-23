
/**
 * REXCART DATABASE CONFIGURATION
 * 
 * Este arquivo centraliza a configuração de conexão com o banco de dados.
 * Para usar com Supabase, Neon ou PostgreSQL.
 * 
 * Instalação necessária no backend:
 * npm install postgres
 */

export const dbConfig = {
  // Substitua pela sua string de conexão do Neon/Supabase
  // Exemplo: postgresql://usuario:senha@host-neon.tech/neondb?sslmode=require
  connectionString: process.env.DATABASE_URL || "postgresql://user:password@host/database",
  
  // Configurações opcionais de pool
  max: 10, // Max conexões
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Exemplo de como inicializar a conexão (apenas backend/Node.js)
/*
import postgres from 'postgres';
const sql = postgres(dbConfig.connectionString);
export default sql;
*/
