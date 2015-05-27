Desafio.factory('Personagem', function($resource, API){
    return $resource(API.url + '/api/personagens', null, null); 
});