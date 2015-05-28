describe('App tests', function() {
	
    beforeEach(module('Desafio'));

    var $controller;
    var $httpBackend;
    var $rootScope; 
    var API;   

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $controller = $injector.get('$controller');
        $rootScope = $injector.get('$rootScope');
        API = $injector.get('API');
        
    }));


    describe('personagensController tests', function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = $rootScope.$new();
            controller = $controller('personagensController', { $scope: $scope });
        });


        it('deve definir variaveis iniciais', function(){
            // spyOn($scope, 'get_personagens'); //essa função é executada logo que o controller inicia, portanto aqui ela ja foi executada

            expect($scope.fields).toBeEmptyArray();
            expect($scope.page).toBe(1);
            expect($scope.perPage).toBe(15);
            expect($scope.loading).toBeFalsy(); //esse aqui é false depois do get


        });

        it("deve fazer um request no servido com página 1", function(){
            $httpBackend.expect('GET', API.url + '/api/personagens?page=1&perPage=15')
                .respond(200, { total : 0, list : []});

            $httpBackend.flush();

            expect($scope.total).toBe(0);
            expect($scope.personagens).toBeEmptyArray();

        });

        it("deve fazer request com query string de acordo com a paginação", function(){
            
            $httpBackend.expect('GET', API.url + '/api/personagens?page=1&perPage=15') //request feita quando incia controller
                .respond(200, { total : 0, list : []});

            $httpBackend.expect('GET', API.url + '/api/personagens?page=2&perPage=15') //request feita após chamar função novamente com paginação
                .respond(200, { total : 0, list : []});

            $scope.page = 2;
            $scope.get_personagens();

            $httpBackend.flush();

            expect($scope.total).toBe(0);
            expect($scope.personagens).toBeEmptyArray();


        });


        it("deve montar variavel $scope.fields com os atributos dos objetos da lista retornada", function(){
            $httpBackend.expect('GET', API.url + '/api/personagens?page=1&perPage=15')
                .respond(200, { total : 1, list : [{teste1 : 'teste1', teste2 : 'teste2'}]});

            $httpBackend.flush();

            expect($scope.fields).toBeArrayOfSize(2);
            expect($scope.fields).toBeArrayOfObjects();

        });

        it("deve remover atributo pessoasRelacionadas da lista e montar: mae, pai, amigos e inimigos", function(){

            $httpBackend.expect('GET', API.url + '/api/personagens?page=1&perPage=15')
                .respond(200, { total : 1, list : [{teste1 : 'teste1', 
                                                    pessoasRelacionadas : {
                                                        mae : 'mae',
                                                        pai : 'pai',
                                                        amigos : ['amigo1', 'amigo2'],
                                                        inimigos : ['inimigo1', 'inimigo2']
                                                    }}]});

            $httpBackend.flush();
            expect($scope.fields).toBeArrayOfSize(5);

        })


        it("deve mostrar mensagem de erro caso request falhe", function(){
            $httpBackend.expect('GET', API.url + '/api/personagens?page=1&perPage=15') //request feita quando incia controller
                .respond(500, { total : 0, list : []});

            $httpBackend.flush();

            expect($scope.message).toBeDefined();
            expect($scope.message).toEqual("Ocorreu um erro ao tentar buscar os personagens");


        });


    });

});