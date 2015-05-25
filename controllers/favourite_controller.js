var models = require('../models/models.js');
var quizes = [];

//PUT /user/:userId/favourites/:quizId
exports.new= function(req,res,next){

	var quiz= req.quiz;
	var user= req.user;

	user.hasQuiz(quiz).then(function(result){
		if(result){
			next();
			return;
		}
		else{
			user.addQuiz(quiz).then(function(){
				user.hasQuiz(quiz).then(function(result){
					console.log("Usuario " + user.id + "faveo quiz " + quiz.id);
				})
			})
		}
		
		res.redirect(req.session.redir.toString());
		//res.render('quizes/index.ejs', {quizes: quizes, misearch: "", search: "", errors: []});
	});
};

//DELETE /user/:userId/favourites/:quizId
exports.destroy= function(req,res){
	var quiz= req.quiz;
	var user= req.user;

	user.hasQuiz(quiz).then(function(result){
		if(result){
			user.removeQuiz(quiz).then(function(){
				user.hasQuiz(quiz).then(function(result){
					console.log("Usuario " + user.id + "unfaveo Quiz " + quiz.id);
				})
			})
		}
		res.redirect(req.session.redir.toString());
	});


};
//GET /user/:userId/favourites
exports.show = function(req,res){

	var favs= [];
	var i;
	var id;
	models.favourites.findAll({
		where:{UserId: Number(req.session.user.id)}
	}).then(function(favoritos){
		quizes=[];
		for(i=0; i<favoritos.length;i++){
			favs.push(favoritos[i].dataValues.QuizId);
		}
	}).then(function(){
		if(favs.length >0){
			for(i=0; i<favs.length; i++){
				id=favs[i];
				models.Quiz.find({
					where:{id: Number(id)},
					order: 'pregunta ASC',
					include: [{model:models.Comment}]
				}).then(function(quiz){
					quizes.push(quiz);
				}).then(function(){
					if(quizes.length === favs.length){
						res.render('quizes/index.ejs', {quizes: quizes, errors: [], misearch:'', search:'', favs:favs});
					}
				});
			}
		} else{
			res.render('quizes/index.ejs', {quizes: quizes, errors: [], misearch:'', search:'', favs:favs})
		}
	});


};