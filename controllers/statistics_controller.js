var models = require('../models/models.js');

exports.stats = function (req,res) {
	models.Quiz.findAll({include:[{
		model: models.Comment


	}]}).then(function(preguntas){
		models.Comment.count().then(function(coments){
			var numeroPreg = preguntas.length;
			var media = coments/numeroPreg;
			var conComent=0;
			for(i=0; i<numeroPreg; i++){
				if(preguntas[i].Comments.length>0){
					conComent++;
				}
			}
			var sinComent= numeroPreg - conComent;
			res.render('statistics', {numeroPreg:numeroPreg, coments: coments, media:media, conComent: conComent, sinComent:sinComent, errors:[]});
		});
	});
};