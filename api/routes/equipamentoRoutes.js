const express = require('express');
const router = express.Router();
const equipamentoController = require('../controllers/equipamentoController');

router.get('/equipamentos', equipamentoController.listarEquipamentos);
router.get('/equipamentos/:id', equipamentoController.detalharEquipamento);
router.post('/equipamentos', equipamentoController.criarEquipamento);
router.put('/equipamentos/:id', equipamentoController.atualizarEquipamento);
router.delete('/equipamentos/:id', equipamentoController.deletarEquipamento);

module.exports = router;
