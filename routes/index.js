var express = require('express');
var multer = require('multer');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statsController = require('../controllers/statistics_controller');
var userController = require('../controllers/user_controller');
var favController = require('../controllers/favourite_controller');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Bienvenido a Quiz', errors: [] });
});
//Autoload de comandos con :quizId
router.param('quizId', quizController.load);
router.param('commentId', commentController.load);
router.param('userId', userController.load);

//Definicion de rutas de sesion
router.get('/login', sessionController.new);
router.post('/login', sessionController.create);
router.get('/logout', sessionController.destroy);

//Rutas de /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', sessionController.loginRequired, quizController.new);
router.post('/quizes/create',sessionController.loginRequired, multer({dest: './public/media/'}), quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',sessionController.loginRequired,quizController.ownershipRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired,quizController.ownershipRequired,multer({dest: './public/media/'}), quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired,quizController.ownershipRequired, quizController.destroy);

//Rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired,commentController.ownershipRequired,commentController.publish);

//Ruta de autores
router.get('/author', function(req,res){
       res.render('author', {errors: []});
});

//Ruta de estadisticas
router.get('/quizes/statistics',statsController.stats);

//Definicion de rutas de cuenta
router.get('/user', userController.new);
router.post('/user', userController.create);
router.get('/user/:userId(\\d+)/edit', sessionController.loginRequired,userController.ownershipRequired, userController.edit);
router.put('/user/:userId(\\d+)', sessionController.loginRequired,userController.ownershipRequired, userController.update);
router.delete('/user/:userId(\\d+)', sessionController.loginRequired,userController.ownershipRequired, userController.destroy);
router.get('/user/:userId(\\d+)/quizes', quizController.index);

//Rutas de favoritos
//PUT /user/:userId/favourites/:quizId
router.put('/user/:userId(\\d+)/favourites/:quizId(\\d+)',sessionController.loginRequired, favController.new);
//DELETE /user/:userId/favourites/:quizId
router.delete('/user/:userId(\\d+)/favourites/:quizId(\\d+)',sessionController.loginRequired, favController.destroy);
//GET /user/:userId/favourites
router.get('/user/:userId(\\d+)/favourites',sessionController.loginRequired, favController.show);

module.exports = router;
