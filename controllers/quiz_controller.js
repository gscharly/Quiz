var models = require('../models/models.js');
var search;
var misearch;


exports.load= function(req,res,next, quizId){
	models.Quiz.find({
		where: {id: Number(quizId)},
		include: [{model: models.Comment}]
	}).then(
		function(quiz){
			if(quiz){
				req.quiz=quiz;
				next();
			} else{
				next(new Error('No existe quizId =' + quizId));
			}

		}).catch(function(error){ next(error);});
};

exports.index = function(req,res){
	misearch= req.query.search;
	search='%';
	if(misearch === undefined)
		misearch='.';
	else{
		misearch=misearch.replace(/[^\w]/g,'%');
		search=search.concat(misearch);
		search=search.concat('%');
		misearch=' para "'+ misearch + '".';

	}

	models.Quiz.findAll({
		where:["pregunta like ?", search],
		order:'pregunta ASC'
	}).then(function(quizes){
		//console.log(quizes);
		res.render('quizes/index.ejs', {quizes: quizes, misearch: misearch, search: search, errors: []});
	})
};

exports.show = function(req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show', {quiz:req.quiz, errors: []});
	})
};

exports.answer= function(req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		if( req.query.respuesta === req.quiz.respuesta){
		res.render('quizes/answer', {quiz:req.quiz, respuesta: 'Correcto', errors: []});
	} else{
		res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Incorrecto', errors: [] });
	}
	})
};

exports.new = function(req,res){
	var quiz= models.Quiz.build(
		{pregunta: "Pregunta,", respuesta: "Respuesta"}
		);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

//POST /quizes/creates
exports.create = function(req,res){
	req.body.quiz.UserId = req.session.user.id;
	var quiz = models.Quiz.build(req.body.quiz);
	quiz.validate().then(
		function(err){
			if(err){
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else{
				quiz.save({ fields: ["pregunta", "respuesta", "UserId"]})
				.then( function(){ res.redirect('/quizes')})
			}
		}
	);

	
};

exports.edit = function(req,res){
	var quiz = req.quiz;
	res.render('quizes/edit', {quiz: quiz, errors: []});
};


// PUT /quizes/:id
exports.update= function(req,res){
	req.quiz.pregunta= req.body.quiz.pregunta;
	req.quiz.respuesta=req.body.quiz.respuesta;

	req.quiz.validate().then(
		function(err){
			if(err){
				res.render('quizes/edit', {quiz:quiz, errors: err.errors});

			}else{
				req.quiz.save({fields: ["pregunta","respuesta"]})
				.then(function(){ res.redirect('/quizes');});
			}
		}
		);
};

//DELETE /quizes/:id
exports.destroy = function(req,res){

	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
}