var models = require('../models/models.js');
var search;
var misearch;


//Pertenece al usuario logeado o si es admin
exports.ownershipRequired = function(req,res,next){
	var objQuizOwner=req.quiz.UserId;
	var logUser = req.session.user.id;
	var isAdmin= req.session.user.isAdmin;

	if(isAdmin || objQuizOwner===logUser){
		next();
	}else{
		res.redirect('/');
	}
}

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
	var options = {};
	var i;
	var favs= [];
	if(req.user){
		options.where= {UserId: req.user.id};
		options.order= 'pregunta ASC';
	} else{

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
	options.where = ["pregunta like ?", search];
		options.order = 'pregunta ASC';
		options.include = [{model: models.Comment}];

}

//favoritos
if(req.session.user){
	models.favourites.findAll({
		where:{UserId: Number(req.session.user.id)}
	}).then(function(favo){
		for(i=0; i<favo.length;i++){
			favs.push(favo[i].dataValues.QuizId);
		}
	})
}

	models.Quiz.findAll(options).then(function(quizes){
		//console.log(quizes);
		res.render('quizes/index.ejs', {quizes: quizes, misearch: misearch, search: search, errors: [], favs:favs});
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
	if(req.files.image){
		req.body.quiz.image= req.files.image.name;
	}
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
	if(req.files.image){
		req.quiz.image= req.files.image.name;
	}
	req.quiz.pregunta= req.body.quiz.pregunta;
	req.quiz.respuesta=req.body.quiz.respuesta;

	req.quiz.validate().then(
		function(err){
			if(err){
				res.render('quizes/edit', {quiz:quiz, errors: err.errors});

			}else{
				req.quiz.save({fields: ["pregunta","respuesta", "image"]})
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