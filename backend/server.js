const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Carregar variáveis de ambiente
require('dotenv').config();

// Controladores
const authController = require('./controllers/authController');
const dataController = require('./controllers/dataController');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Multer para Upload de Imagens
// Nota: No Render (Free), arquivos salvos em disco somem após o deploy/restart.
// Para produção real, recomenda-se usar S3 ou Supabase Storage.
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

// Middlewares Globais
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Limite aumentado para imagens base64 se necessário
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (Imagens)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ROTAS ---

// Health Check
app.get('/', (req, res) => {
  res.send('RexCart API está rodando 🚀');
});

// Autenticação
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);

// Dados (CRUD Genérico) - Protegido por JWT
// O frontend deve enviar ?type=product ou ?type=history na URL
app.get('/data', authMiddleware, dataController.getData);
app.post('/data', authMiddleware, dataController.createData);
app.put('/data/:id', authMiddleware, dataController.updateData);
app.delete('/data/:id', authMiddleware, dataController.deleteData);

// Upload de Imagem
app.post('/upload/image', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo enviado.');
  }
  
  // Constrói a URL pública da imagem
  const protocol = req.protocol;
  const host = req.get('host');
  const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

  res.json({ imageUrl });
});

// Iniciar Servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});