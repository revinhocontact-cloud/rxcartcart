
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO DO SUPABASE ---
// Substitua as strings abaixo pelas suas credenciais do painel do Supabase.
// Você encontra isso em Settings > API.

// ATENÇÃO: Usei um formato de URL válido para evitar o erro "TypeError: Invalid URL".
// Você DEVE substituir 'https://sua-url-aqui.supabase.co' pela sua URL real.
const SUPABASE_URL = 'https://sua-url-aqui.supabase.co'; 
const SUPABASE_ANON_KEY = 'sua-chave-anonima-aqui'; 

// Verificação simples para alertar no console
const isConfigured = SUPABASE_URL !== 'https://sua-url-aqui.supabase.co';

if (!isConfigured) {
  console.warn('⚠️ ALERTA: Você precisa configurar as credenciais no arquivo services/supabaseClient.ts para que o login funcione.');
}

// Inicializa o cliente. Se a URL for a padrão, as chamadas de rede falharão (o que é esperado),
// mas a aplicação não travará com tela branca.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
