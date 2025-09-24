const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');

router.get('/comentarios', comentarioController.listarComentarios);
router.post('/comentarios', comentarioController.criarComentario);
router.delete('/comentarios/:id', comentarioController.deletarComentario);

module.exports = router;
