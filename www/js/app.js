// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('reserveup', ['ionic', 'ngFileUpload', 'ion-datetime-picker'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.backButton.previousTitleText(false).text('');

    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: 'templates/home.html',
                controller: 'homeCtrl'
            }
        }
    })

    .state('app.create', {
        url: '/create',
        views: {
            'menuContent': {
                templateUrl: 'templates/create.html',
                controller: 'createCtrl'
            }
        }
    })

    .state('app.admindash', {
        url: '/admindashboard',
        views: {
            'menuContent': {
                templateUrl: 'templates/admindashboard.html',
                controller: 'createCtrl'
            }
        }
    })

    .state('app.bookinglist', {
        url: '/bookinglist',
        views: {
            'menuContent': {
                templateUrl: 'templates/bookinglist.html',
                controller: 'createCtrl'
            }
        }
    })

    .state('app.details', {
        url: '/details/:id',
        views: {
            'menuContent': {
                templateUrl: 'templates/details.html',
                controller: 'detailsCtrl'
            }
        }
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
});