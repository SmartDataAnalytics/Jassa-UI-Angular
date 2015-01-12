angular.module('jassa.demo')

.controller('SponateCtrl', ['$scope', function($scope) {
    // Code mirror setup
    $scope.editorOptions = {
        ttl: {
            lineWrapping : true,
            lineNumbers: true,
            tabMode: 'indent',
            matchBrackets: true,
            mode: 'text/turtle',
            readOnly: true
        },
//        html: {
//            lineWrapping : true,
//            lineNumbers: true,
//            tabMode: 'indent',
//            matchBrackets: true,
//            mode: 'text/html',
//        },
    };
}])

;

