const host = 'http://localhost:8081';

export class Endpoints {
  static USER_LOGIN = `${host}/login`;
  static USER_SIGNUP = `${host}/signup`;
  static USER_LOGIN_CODE = `${host}/login-code`;
  static USER_CART = `${host}/cart`;

  static RESTAURANT_LOGIN = `${host}/login/restaurant`;
  static RESTAURANT_LOGIN_CODE = `${host}/login-code/restaurant`;
  static RESTAURANT_SIGNUP = `${host}/signup/restaurant`;
  static RESTAURANT_FOOD_ITEM = `${host}/food-item`;

  static ORDER = `${host}/order`;

  static LAST_FOOD = `${host}/last-food`;
  static LAST_RESTAURANTS = `${host}/last-restaurants`;
  static FOOD = `${host}/food`;
  static RESTAURANT = `${host}/restaurant`
}
