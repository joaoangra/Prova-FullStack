const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.listarComentarios = async (req, res) => {
  try {
    const comentarios = await prisma.comentario.findMany({
      include: {
        equipamento: true,
        usuario: { include: { perfil: true } }
      }
    });
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar comentários' });
  }
};

exports.criarComentario = async (req, res) => {
  try {
    const { comentario, equipamentoId, usuarioId } = req.body;
    const novoComentario = await prisma.comentario.create({
      data: { comentario, equipamentoId, usuarioId },
      include: {
        equipamento: true,
        usuario: { include: { perfil: true } }
      }
    });
    res.status(201).json(novoComentario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar comentário' });
  }
};

exports.deletarComentario = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.comentario.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Comentário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar comentário' });
  }
};
