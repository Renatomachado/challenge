Desafio.controller('personagensController', function ($scope, Personagem) {

    $scope.collapse_fields = true;
//    $scope.collapse_filter = true;

    $scope.page = 1;
    $scope.perPage = 15;
    $scope.fields = [];
    $scope.loading = false;
    
    $scope.get_personagens = function(){
        $scope.loading = true;
        Personagem.get({
            page: $scope.page,
            perPage: $scope.perPage,
        }).$promise.then(function (data) {

            $scope.personagens = data.list;
            $scope.total = data.total;

            _.map($scope.personagens, function (item) {
                item.mae = item.pessoasRelacionadas.mae;
                item.pai = item.pessoasRelacionadas.pai;
                item.caracteristicas = item.caracteristicas.join(', ');
                item.amigos = item.pessoasRelacionadas.amigos.join(', ');
                item.inimigos = item.pessoasRelacionadas.inimigos.join(', ');
                return item;
            });
            
            if(data.list.length){
                var fields = _.keys(data.list[0]);
                fields.splice(fields.indexOf('pessoasRelacionadas'), 1);
                fields.forEach(function(item){
                    $scope.fields.push({
                        field : item,
                        show : true
                    });
                    
                })
            }
            
            $scope.loading = false;

        });
    };
    
    $scope.get_personagens();
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

});