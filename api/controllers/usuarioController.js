const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.login = async (req, res) => {
  try {
    const { senha } = req.body;
    const usuario = await prisma.usuario.findFirst({
      where: { senha },
      include: { perfil: true }
    });
    if (!usuario) {
      return res.status(401).json({ error: 'ERRO: Senha incorreta.' });
    }
    res.json({
      id: usuario.id,
      perfil: usuario.perfil.perfil,
      perfilId: usuario.perfilId
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
};

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({ include: { perfil: true } });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

exports.criarUsuario = async (req, res) => {
  try {
    const { senha, perfilId } = req.body;
    const novoUsuario = await prisma.usuario.create({
      data: { senha, perfilId },
      include: { perfil: true }
    });
    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};
