/*
  # Criar tabela genérica de dados da aplicação
  
  1. Nova Tabela
    - `app_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `type` (text) - product, queue, history, template, config
      - `content` (jsonb) - dados flexíveis em JSON
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
  2. Segurança
    - Habilitar RLS na tabela `app_data`
    - Usuários podem acessar apenas seus próprios dados
    - Config do sistema pode ser acessado por todos
*/

CREATE TABLE IF NOT EXISTS app_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_data_user_type ON app_data(user_id, type);
CREATE INDEX IF NOT EXISTS idx_app_data_type ON app_data(type);

ALTER TABLE app_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON app_data FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR type = 'config');

CREATE POLICY "Users can insert own data"
  ON app_data FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own data"
  ON app_data FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own data"
  ON app_data FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all data"
  ON app_data FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'ADMIN'
    )
  );
