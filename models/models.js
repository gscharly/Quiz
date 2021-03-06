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

//Importar definicion de la tabla Comment
var user_path = path.join(__dirname,'user');
var User = sequelize.import(user_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

//los quizes pertenecen a un usuario registrado
Quiz.belongsTo(User);
User.hasMany(Quiz);

//favoritos

favourites= sequelize.define('favourites');
User.belongsToMany(Quiz, {through: 'favourites'});
Quiz.belongsToMany(User, {through: 'favourites'});

//exportar tablas

exports.Quiz=Quiz; //exportar definicion de tabla Quiz
exports.Comment= Comment;
exports.User=User;
exports.favourites= favourites;

//crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function(){
	User.count().then(function(count){
		if(count===0){
			User.bulkCreate(
				[ {username: 'admin', password: '1234', isAdmin: true},
 				   {username: 'pepe', password: '5678'}
				]
				).then(function(){
					console.log('Base de datos (tabla user) inicializada');
					Quiz.count().then(function(count){
						if(count===0){
							Quiz.bulkCreate(
								[ {pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 2, tema: "Otro"},
								  {pregunta: 'Capital de Portugal', respuesta:'Lisboa', UserId:2, tema: "Otro"}
								]
								).then(function(){console.log('Base de datos (tabla Quiz) inicializada')});
						};
					});

				});
		};
	});
	/*Quiz.count().then(function(count){
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

	User.count().then(function(count){
		if(count===0){
			User.create({username: 'admin', password: '1234', isAdmin: true})
			.then(function(){console.log('Usuario hecho')});
		}
	})*/
});