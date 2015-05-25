var models = require('../models/models.js');


//PUT /user/:userId/favourites/:quizId
exports.new= function(req,res){

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
					console.log(user.id + "faveo" + quiz.id);
				})
			})
		}
		res.redirect(req.session.redir.toString());
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
					console.log(user.id + "unfaveo " + quiz.id);
				})
			})
		}
		res.redirect(req.session.redir.toString());
	});


};
//GET /user/:userId/favourites
exports.show = function(req,res){


};