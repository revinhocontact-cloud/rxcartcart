/*
  # Criar tabela de usuários
  
  1. Nova Tabela
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `password_hash` (text)
      - `role` (text) - ADMIN ou CUSTOMER
      - `plan` (text) - FREE, PRO ou ENTERPRISE
      - `cpf` (text, optional)
      - `address` (text, optional)
      - `phone` (text, optional)
      - `status` (text) - ACTIVE, INACTIVE, EXPIRED, PENDING
      - `usage` (integer) - contador de uso
      - `valid_until` (timestamptz) - data de validade do plano
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
  2. Segurança
    - Habilitar RLS na tabela `users`
    - Políticas para usuários autenticados visualizarem apenas seus próprios dados
    - Admins podem visualizar todos os usuários
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'CUSTOMER',
  plan text NOT NULL DEFAULT 'FREE',
  cpf text,
  address text,
  phone text,
  status text NOT NULL DEFAULT 'ACTIVE',
  usage integer DEFAULT 0,
  valid_until timestamptz DEFAULT NOW() + INTERVAL '30 days',
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR role = 'ADMIN');

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all users"
  ON users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'ADMIN'
    )
  );
