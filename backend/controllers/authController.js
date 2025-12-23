const sql = require('../config/dbConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    // Verificar se usuário existe
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Usuário já existe" });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Criar usuário
    const [user] = await sql`
      INSERT INTO users (name, email, password_hash, role, plan, valid_until, usage)
      VALUES (${name}, ${email}, ${hash}, ${role || 'CUSTOMER'}, 'FREE', NOW() + INTERVAL '30 days', 0)
      RETURNING id, name, email, role, plan, valid_until
    `;

    // Gerar Token
    const token = jwt.sign(
      { user_id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({ user, token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha são obrigatórios" });
    }

    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    const user = users[0];

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      const token = jwt.sign(
        { user_id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Remover hash da resposta
      delete user.password_hash;

      return res.status(200).json({ user, token });
    }

    res.status(400).json({ message: "Credenciais inválidas" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};