Desafio.filter('label', function () {

    return function (input) {
        input = input.replace(/([A-Z])/g, ' $1');
        input = input.replace(/_[at]*/g, '');

        return input[0].toUpperCase() + input.slice(1);
    }
});