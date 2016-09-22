/*
// ЗАДАНИЕ:
// Here is a quick exercise that will help me evaluate the team’s skills
// Once it is complete, please have the developers add their project to github.com where I can browse the code.
//
// Here's what I would suggest:
// 1. Write a simple angular app that displays the weather from openweathermap.org
// 2. Provide a simple text field that could take a city name and then display the current weather.
// 3. Must use a controller and service and comment about how you segregate the functionality between them.
// 4. Render the weather with a custom directive showing current temperature, humidity, and description.
*/

var wApp = angular.module("weatherApp", []);

wApp.controller("weatherController", ['$scope', 'weatherService', function($scope, weatherService) {
    $scope.town = "Владимир";
    $scope.load = false;
    // Функция printInfo передает в сервис название города и как только сервер даст ответ, сохранит его в модель с помощью callback-функции
    $scope.printInfo = function () {
        weatherService.getWeather($scope.town).then(function(data) {
            $scope.weather = data;
        })
        $scope.load = true; // Делает видимым блок, в котором будет отображаться ответ сервера
    }
}]);
        
// В соответствии с заданием (п.3). Функциональность между сервисом и контроллером разделена по принципу:
// контроллер - управляет бизнес-логикой всего приложения, сервис - решает узко специализированную задачу (делает запрос на сервер)
wApp.factory('weatherService', ['$http', '$q', function ($http, $q) {
    function getWeather(town) {
    var deferred = $q.defer(); // метод создает объект должника и объект обещания
    var URL = 'http://api.openweathermap.org/data/2.5/weather';
    var request = {
        method: 'GET',
        url: URL,
        params: {
            q: town,                                    // Город
            mode: 'json',                               // Формат ответа (по умолчанию json)
            units: 'metric',                            // Метрическая система мер (также есть imperial)
            cnt: '1',                                   // Число точек в черте города, с которых собираются данные (кол-во метеостанций)
            lang: 'ru',                                 // Язык ответа сервера
            appid: 'd82cc0899c6daac257da82e9b2ab2ea4'   // Уникальный идентификатор (нововведение, без него ответ получить нельзя)
        }
    };

    $http(request).success(function(data) {
            deferred.resolve(data);
        });
        return deferred.promise // Возвращает (извлекает) объект обещания, ассоциированный с должником
    }
    return {
        getWeather: getWeather // Возвращает результат работы сервиса
    };
}]);
        
// Кастомная директива для отображения информации на форме. Сделано в соответствии с заданием (п.4)
wApp.directive('weatherDir', function() {
    return {
        template: '<p align="center">Температура: {{weather.main.temp}}&degC</p>' +
                  '<p align="center">Влажность: {{weather.main.humidity}}%</p>' +
                  '<p align="center">Описание: {{weather.weather[0].description}}</p>' +
                  '<p class="fig"><img src="http://openweathermap.org/img/w/{{weather.weather[0].icon}}.png"></p>'
    };
});