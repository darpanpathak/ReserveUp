var app = angular.module('reserveup')

app.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $http, $state) {

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.modal = modal;
    //$scope.checklogin();

  });

  // $scope.checklogin = function () {

  //   var isLoggedin = localStorage.getItem("user");
  //   if (isLoggedin != undefined && isLoggedin != null) {} else {
  //     $scope.login();
  //   }
  // }


  $scope.closeLoginifloggedin = function () {
    var isLoggedin = localStorage.getItem("user");
    if (isLoggedin != undefined && isLoggedin != null) {
      $scope.modal.hide();
    } else {
      $state.go('app.home');
      $scope.modal.hide();
    }
  }

  // Triggered in the login modal to close it
  $scope.closeLogin = function () {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function () {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function () {
    var config = {
      headers: {
        'Content-Type': 'application/JSON',
        'Accept': 'application/JSON'
      }
    }


    if ($scope.loginData.username != undefined && $scope.loginData.password != undefined) {
      $http.post('http://restroapis.herokuapp.com/api/login', $scope.loginData, config)
        .then(function (data, status, headers, config) {

          if (data.status === 200) {
            localStorage.removeItem("user");
            localStorage.setItem("user", JSON.stringify(data.data.user[0]));
            $scope.modal.hide();

            window.location.reload();

          } else {
            window.alert("login failed");
          }
        });

    };
  }

})

app.controller('homeCtrl', ['$scope', '$state', '$stateParams', '$http', function ($scope, $state, $stateParams, $http) {

  $http({
    method: 'GET',
    url: "http://restroapis.herokuapp.com/api/getAllRestro"
  }).then(function (response) {
    $scope.restros = response.data.restros;
    console.log(response);
  }, function (err) {
    console.log(err);
  });

}]);

app.controller('createCtrl', function ($scope, $state, Upload, $http, $ionicLoading) {
  $scope.rm = {};
  $scope.selectedImages = [];

  if (localStorage.getItem("user") == undefined || localStorage.getItem("user") == null)
    $scope.modal.show();

  $scope.Addfiletoanarray = function (sfile) {
    $scope.selectedImages.push(sfile);
  }

  $scope.submitRestro = function () {
    $scope.uploadimg($scope.rm.file);
  }

  $scope.uploaddata = function (img) {
    // Setup the loader
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    $scope.rm.createdBy = "pathakdarpan77@gmail.com";
    $scope.rm.image = img;
    var config = {
      headers: {
        'Content-Type': 'application/JSON',
        'Accept': 'application/JSON'
      }
    }

    $http.post('http://restroapis.herokuapp.com/api/postRestro', $scope.rm, config)
      .then(function (data, status, headers, config) {

        $ionicLoading.hide();
        $state.go('app.home');
        window.location.reload();

      });
  }

  $scope.uploadimg = function (file) {

    // Setup the loader
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });


    var imgarr = [];

    for (var i = 0; i < $scope.selectedImages.length; i++) {
      var selimg = $scope.selectedImages[i];
      if (selimg[0] === undefined) {
        $scope.selectedImages.splice(i, 1);
      }
    }

    for (var i = 0; i < $scope.selectedImages.length; i++) {
      var selimg = $scope.selectedImages[i];

      Upload.upload({
        url: 'http://foodie.delivision.in/api/imageupload',
        data: {
          file: selimg[0]
        }
      }).then(function (resp) {

        imgarr.push(resp.data[0]);
        $ionicLoading.hide();
        if (imgarr.length == $scope.selectedImages.length)
          $scope.uploaddata(imgarr);
      }, function (err) {
        window.alert("error");
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });

    }
  }

});

app.controller('detailsCtrl', function ($scope, $stateParams, $http, $ionicSlideBoxDelegate, $state) {
  var id = $stateParams.id;
  $scope.restro = {};
  $scope.res = {};
  $scope.res.bookingdatetime = new Date();
  $scope.res.restroid = id;

  $http({
    method: 'GET',
    url: "http://restroapis.herokuapp.com/api/getRestroById/" + id
  }).then(function (response) {
    debugger;
    $scope.restro = response.data[0];
    $ionicSlideBoxDelegate.update();
    console.log(response);
  }, function (err) {
    console.log(err);
  });

  $scope.next = function () {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function () {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function (index) {
    $scope.slideIndex = index;
  };

  $scope.bookRestro = function () {
    var config = {
      headers: {
        'Content-Type': 'application/JSON',
        'Accept': 'application/JSON'
      }
    }
    $scope.res.createdBy = "pathakdarpan77@gmail.com";
    $scope.res.bookingdatetime = formatDate($scope.res.bookingdatetime);
    $http.post('http://restroapis.herokuapp.com/api/submitbooking', $scope.res, config)
      .then(function (data) {
        window.alert("booking done successfully");
        $state.go("app.home");
      }, function (err) {
        window.alert("restaurant is closed on this day");
      });
  }

  function formatDate(date) {
    try {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      // hours = hours % 12;
      // hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes;
      return date.getFullYear() + "-" + (parseInt(date.getMonth()) + 1) + "-" + date.getDate() + " " + strTime;
    } catch (err) {
      return date;
    }
  }

});
