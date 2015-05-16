var path= require('path');

var url= process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name= (url[6] || null);
var user= (url[2]||null);
var pwd= (url[3]||null);
var protocol= (url[1]||null);
var dialect = (url[1]||null);
var port= (url[5]||null);
var host= (url[4]||null);
var storage = process.env.DATABASE_STORAGE;
//Cargar Modelo ORM
var Sequelize = require('sequelize');
//Usar BBDD SQlite
var sequelize= new Sequelize(DB_name,user,pwd,
{dialect: protocol, 
 protocol:protocol,
 port: port,
 host: host,	
 storage: storage,
 omitNull:true
}
);
//Importar la definicion de la tabla Quiz en quiz.js
var quiz_path= path.join(__dirname,'quiz');
var Quiz= sequelize.import(quiz_path);

//Importar definicion de la tabla Comment
var comment_path=  path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz=Quiz; //exportar definicion de tabla Quiz
exports.Comment= Comment;

//crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function(){
	Quiz.count().then(function(count){
		if(count===0){
			Quiz.create({pregunta: 'Capital de Italia',
						 respuesta: 'Roma'
		});
			Quiz.create({pregunta: 'Capital de Portugal',
						 respuesta: 'Lisboa'
		})
		.then(function(){console.log('Base de datos inicializada')});
		};
	});
});