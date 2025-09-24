const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API do Sistema de Equipamentos funcionando!' });
});

// Rotas para Perfis
app.get('/perfis', async (req, res) => {
  try {
    const perfis = await prisma.perfil.findMany();
    res.json(perfis);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar perfis' });
  }
});

app.post('/perfis', async (req, res) => {
  try {
    const { perfil } = req.body;
    const novoPerfil = await prisma.perfil.create({
      data: { perfil }
    });
    res.status(201).json(novoPerfil);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar perfil' });
  }
});


// Importar rotas organizadas (fora das rotas inline)
const usuarioRoutes = require('./routes/usuarioRoutes');
const equipamentoRoutes = require('./routes/equipamentoRoutes');
const comentarioRoutes = require('./routes/comentarioRoutes');

app.use(usuarioRoutes);
app.use(equipamentoRoutes);
app.use(comentarioRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

