var models = require('../models/models.js');
var search;
var misearch;
var preba;
//GET /quizes/question
/*exports.question= function(req,res){
	   models.Quiz.findAll().then(function(quiz){
	   		res.render('quizes/question', {pregunta: quiz[0].pregunta});

	   })
       
};*/

//GET /quizes/answer
/*exports.answer= function(req,res){
		models.Quiz.findAll().then(function(quiz){
			if(req.query.respuesta=== quiz[0].respuesta){
               res.render('quizes/answer', {respuesta: 'Correcto'});
       } else{
               res.render('quizes/answer', {respuesta: 'Incorrecto'});
       }

		})
       
};*/

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
		res.render('quizes/index.ejs', {quizes: quizes, misearch: misearch, search: search});
	})
};

exports.show = function(req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show', {quiz:quiz});
	})
};

exports.answer= function(req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		if( req.query.respuesta === quiz.respuesta){
		res.render('quizes/answer', {quiz:quiz, respuesta: 'Correcto'});
	} else{
		res.render('quizes/answer', {quiz: quiz, respuesta: 'Incorrecto'});
	}
	})
};

