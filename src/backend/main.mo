import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type Product = {
    id : Nat;
    name : Text;
    price : Nat;
    category : Text;
    image : Storage.ExternalBlob;
  };

  public type CartItem = {
    product : Product;
    quantity : Nat;
  };

  public type Order = {
    id : Nat;
    owner : Principal;
    products : [CartItem];
    total : Nat;
    paymentMethod : Text;
    status : Text;
  };

  public type UserProfile = {
    name : Text;
    address : Text;
    phone : Text;
  };

  var nextProductId = 0;
  var nextOrderId = 0;

  let products = Map.empty<Nat, Product>();
  let carts = Map.empty<Principal, [CartItem]>();
  let orders = Map.empty<Nat, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management (Admin-only)
  public shared ({ caller }) func addProduct(name : Text, price : Nat, category : Text, image : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let product : Product = {
      id = nextProductId;
      name;
      price;
      category;
      image;
    };
    products.add(nextProductId, product);
    nextProductId += 1;
  };

  public shared ({ caller }) func updateProduct(productId : Nat, name : Text, price : Nat, category : Text, image : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let product : Product = {
          id = productId;
          name;
          price;
          category;
          image;
        };
        products.add(productId, product);
      };
    };
  };

  // Public product browsing (no auth required)
  public query func getProductsByCategory(category : Text) : async [Product] {
    let iter = products.values();
    iter.toArray().filter(
      func(product) {
        product.category == category;
      }
    );
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query func getProduct(productId : Nat) : async ?Product {
    products.get(productId);
  };

  // Cart Management (User-only, own cart)
  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let cart = switch (carts.get(caller)) {
          case (null) { [] };
          case (?existingCart) { existingCart };
        };
        let updatedCart = switch (cart.findIndex(func(item) { item.product.id == productId })) {
          case (?index) {
            Array.tabulate(
              cart.size(),
              func(i) {
                if (i == index) {
                  {
                    product;
                    quantity = cart[i].quantity + quantity;
                  };
                } else {
                  cart[i];
                };
              },
            );
          };
          case (null) { cart.concat([{ product; quantity }]) };
        };
        carts.add(caller, updatedCart);
      };
    };
  };

  public shared ({ caller }) func removeItemFromCart(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can modify cart");
    };
    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) {
        let updatedCart = cart.filter(func(item) { item.product.id != productId });
        carts.add(caller, updatedCart);
      };
    };
  };

  public shared ({ caller }) func updateCartItemQuantity(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can modify cart");
    };
    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) {
        let updatedCart = Array.tabulate(
          cart.size(),
          func(i) {
            if (cart[i].product.id == productId) {
              { cart[i] with quantity };
            } else {
              cart[i];
            };
          },
        );
        carts.add(caller, updatedCart);
      };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear cart");
    };
    carts.remove(caller);
  };

  module CartItem {
    public func compareByQuantity(a : CartItem, b : CartItem) : Order.Order {
      Nat.compare(a.quantity, b.quantity);
    };
  };

  func sortCartByQuantity(cart : [CartItem]) : [CartItem] {
    cart.sort(CartItem.compareByQuantity);
  };

  public type CartSummary = {
    items : [CartItem];
    total : Nat;
    totalItems : Nat;
  };

  public query ({ caller }) func getCartSummary() : async CartSummary {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cart");
    };
    switch (carts.get(caller)) {
      case (null) {
        {
          items = [];
          total = 0;
          totalItems = 0;
        };
      };
      case (?cart) {
        let total = cart.foldLeft(0, func(acc, item) { acc + (item.product.price * item.quantity) });
        let totalItems = cart.foldLeft(0, func(acc, item) { acc + item.quantity });
        let sortedCart = sortCartByQuantity(cart);
        {
          items = sortedCart;
          total;
          totalItems;
        };
      };
    };
  };

  // Checkout and Order Management
  public shared ({ caller }) func checkout(paymentMethod : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can checkout");
    };
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?cart) {
        if (cart.size() == 0) {
          Runtime.trap("Cart is empty");
        };
        cart;
      };
    };
    let total = cart.foldLeft(0, func(acc, item) { acc + (item.product.price * item.quantity) });
    let order : Order = {
      id = nextOrderId;
      owner = caller;
      products = cart;
      total;
      paymentMethod;
      status = "Pending";
    };
    orders.add(nextOrderId, order);
    let orderId = nextOrderId;
    nextOrderId += 1;
    carts.remove(caller);
    orderId;
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        // Users can only view their own orders, admins can view any order
        if (order.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
    };
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    orders.values().toArray().filter(func(order) { order.owner == caller });
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = { order with status };
        orders.add(orderId, updatedOrder);
      };
    };
  };
};
