
const postgres = require('postgres');
require('dotenv').config();

const { DATABASE_URL, NODE_ENV } = process.env;

if (!DATABASE_URL) {
  console.warn("⚠️  AVISO: DATABASE_URL não definida. Usando mock de dados.");
  module.exports = null;
  return;
}

// Configuração de conexão
const config = {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
};

// Só exige SSL em produção ou se explicitamente configurado.
// Para localhost (Postgres local), SSL geralmente deve ser desligado.
if (NODE_ENV === 'production' || DATABASE_URL.includes('supabase') || DATABASE_URL.includes('neon')) {
    config.ssl = 'require';
} else {
    // Permite conexão insegura para localhost
    config.ssl = false;
}

const sql = postgres(DATABASE_URL, config);

// Teste de conexão
sql`SELECT 1+1 AS result`.then(() => {
  console.log('✅ Conectado ao PostgreSQL com sucesso!');
}).catch((err) => {
  console.error('❌ Erro ao conectar no banco:', err);
});

module.exports = sql;
