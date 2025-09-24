const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/login', usuarioController.login);
router.get('/usuarios', usuarioController.listarUsuarios);
router.post('/usuarios', usuarioController.criarUsuario);

module.exports = router;
