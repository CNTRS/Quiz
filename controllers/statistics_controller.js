var models = require('../models/models.js');

var estadisticas = {numPreguntas:0, numComentarios:0, numComentariosPub:0, pregComentadas:0};

var numComentarios = function() {
	 models.Comment.count().then(function (count){
	 	return count;
   });
};

var numComentariosPub = function(){
  models.Comment.count({where:{publicado:true}}).then(function(count){
    if(count!=0){
      return count;
    }else{return 0;}
  });
};

exports.Stats = function(req, res, next) {
	 models.Quiz.count().then(function (count){
	 	estadisticas.numPreguntas=count;
	 	return estadisticas;})
	 .then(function(estadisticas){
	 		models.Comment.count().then(function (count){
		 	    estadisticas.numComentarios=count;
		 	    return estadisticas;
		 		}).then(function(estadisticas){
           models.Comment.count({where:{publicado:true}})
           .then(function(count){
             estadisticas.numComentariosPub=count;
             return estadisticas;
             }).then(function(estadisticas){
               models.Quiz.findAll().then(function(quiz){
                 estadisticas.pregComentadas=0;
                 for (i=0; i<quiz.length;i++){
                   quizIdValue=quiz[i].dataValues.id;
                   models.Comment.count( { where:{quizId:quizIdValue}}).then(function(count){
                     if (count!=0){estadisticas.pregComentadas++;}
                   });
                 }
                 res.render('statistics/showStats', {contPreguntas: estadisticas.numPreguntas,contComments: estadisticas.numComentarios,contConComments:estadisticas.pregComentadas,contPublicados:estadisticas.numComentariosPub, errors: []});
               });
					   });
	 	 	 	});
	 });
};
