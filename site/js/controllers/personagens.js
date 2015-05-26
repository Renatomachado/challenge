Desafio.controller('personagensController', function($scope, Personagem){
    
    var page = 1,
        perPage = 20;
    
    
    Personagem.query({
        page : page,
        perPage : perPage,
    }).$promise.then(function(lista){
        $scope.personagens = lista;
        console.log($scope.personagens);
    });
    
    
});