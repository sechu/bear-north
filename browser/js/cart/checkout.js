app.config(function ($stateProvider) {

    $stateProvider.state('checkout', {
        url: '/cart/checkout',
        templateUrl: 'js/cart/checkout.html',
        controller: 'CheckoutCtrl',
        resolve: {
          cart: function(CartFactory) {
            return CartFactory.getCart();
          },
          user: function(AuthService) {
            return AuthService.getLoggedInUser();
          }
        }
    });

    $stateProvider.state('postCheckout', {
        url: '/cart/thanks',
        templateUrl: 'js/cart/post-checkout.html'
    });

});

app.controller('CheckoutCtrl', function ($scope, cart, user, CartFactory, $state) {

  $scope.cart = cart;
  $scope.orderTotal = CartFactory.getTotal();

  // default values for testing purposes - to be removed
  $scope.orderName = (user) ? user.first_name+' '+user.last_name : 'John Smith';
  $scope.orderAddress = (user) ? user.defaultShipping : 'Shipping Address';
  $scope.customerId = (user) ? user.email : 'customer@stripe.com';
  $scope.number = '4242424242424242';
  $scope.expiry = '12/17';
  $scope.cvc = '123';

  $scope.stripeCallback = function (status, response) {
    if (response.error) {
      window.alert('it failed! error: ' + response.error.message);
    } else { // Token created!

      // Get the token ID:
      var paymentToken = response.id,
        shippingDetails = {
          name: $scope.orderName,
          address: $scope.orderAddress
        };

      // Submit the form:
      return CartFactory.submitOrder(shippingDetails, paymentToken, $scope.orderTotal, $scope.customerId)
      .then(function() {
        $state.go('postCheckout');
      });
    }
  }

});
