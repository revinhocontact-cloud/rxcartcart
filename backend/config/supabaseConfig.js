
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'placeholder';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.warn("⚠️  AVISO BACKEND: SUPABASE_URL ou SUPABASE_ANON_KEY não definidos no .env. A conexão falhará.");
}

// Inicializa o cliente com valores seguros para não travar o require
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
