var Desafio = angular.module('Desafio', ['ui.router', 'ngResource', 'ui.bootstrap']);

    //TODO
    //Automatizar a porta onde a api é aberta
    Desafio.constant('API', {
		url: 'http://localhost:3000'
	});

    Desafio.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
         
        $urlRouterProvider.otherwise("/");
          
        
        $stateProvider
		   
          
            .state('personagens', {
                url : '/personagens',
                templateUrl : '../views/personagens/index.html',
                controller : 'personagensController'
            })
          
            .state('home', {
                url : '/',
                templateUrl : '../views/home.html'
            })
          
          
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });