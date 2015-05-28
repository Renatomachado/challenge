Desafio.controller('personagensController', function ($scope, Personagem) {

    $scope.collapse_fields = true;
//    $scope.collapse_filter = true;

    $scope.page = 1;
    $scope.perPage = 15;
    $scope.fields = [];
    $scope.loading = false;
    
    $scope.get_personagens = function(){
        // $scope.loading = true;
        Personagem.get({
            page: $scope.page,
            perPage: $scope.perPage,
        }).$promise.
        then(function (data) {

            $scope.personagens = data.list;
            $scope.total = data.total;

            _.map($scope.personagens, function (item) {
                if(item.pessoasRelacionadas){
                    item.mae = item.pessoasRelacionadas.mae;
                    item.pai = item.pessoasRelacionadas.pai;
                    item.amigos = item.pessoasRelacionadas.amigos.join(', ');
                    item.inimigos = item.pessoasRelacionadas.inimigos.join(', ');
                }
                
                if(item.caracteristicas){
                    item.caracteristicas = item.caracteristicas.join(', ');
                }
                return item;
            });
            
            if(data.list.length){
                var fields = _.keys(data.list[0]);
                if(fields.indexOf('pessoasRelacionadas') > -1){
                    fields.splice(fields.indexOf('pessoasRelacionadas'), 1);
                }
                fields.forEach(function(item){
                    $scope.fields.push({
                        field : item,
                        show : true
                    });
                    
                })
            }
            
            $scope.loading = false;

        }, function(err){

            $scope.message = 'Ocorreu um erro ao tentar buscar os personagens';

        });
    };
    
    $scope.get_personagens();
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

});