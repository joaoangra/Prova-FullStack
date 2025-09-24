const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.listarEquipamentos = async (req, res) => {
  try {
    const equipamentos = await prisma.equipamento.findMany({
      include: { comentarios: true }
    });
    res.json(equipamentos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar equipamentos' });
  }
};

exports.detalharEquipamento = async (req, res) => {
  try {
    const { id } = req.params;
    const equipamento = await prisma.equipamento.findUnique({
      where: { id: parseInt(id) },
      include: {
        comentarios: {
          include: { usuario: { include: { perfil: true } } }
        }
      }
    });
    if (!equipamento) {
      return res.status(404).json({ error: 'Equipamento não encontrado' });
    }
    res.json(equipamento);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar equipamento' });
  }
};

exports.criarEquipamento = async (req, res) => {
  try {
    const { equipamento, imagem, descricao, ativo } = req.body;
    const novoEquipamento = await prisma.equipamento.create({
      data: { equipamento, imagem, descricao, ativo }
    });
    res.status(201).json(novoEquipamento);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar equipamento' });
  }
};

exports.atualizarEquipamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { equipamento, imagem, descricao, ativo } = req.body;
    const equipamentoAtualizado = await prisma.equipamento.update({
      where: { id: parseInt(id) },
      data: { equipamento, imagem, descricao, ativo }
    });
    res.json(equipamentoAtualizado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar equipamento' });
  }
};

exports.deletarEquipamento = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.equipamento.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Equipamento deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar equipamento' });
  }
};
