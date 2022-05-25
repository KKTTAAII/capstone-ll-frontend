import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class PetlyApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { authorization: `Bearer ${this.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  //Auth Routes

  /*Register route for both shelters and adopters
   * userType = Shelter/Adopter
   */
  static async register(userType, data) {
    const response = await this.request(
      `auth${userType}/register`,
      data,
      "post"
    );
    this.token = response.token;
    return response.token;
  }

  /*Register route for both shelters and adopters
   * userType = Shelter/Adopter
   */
  static async logIn(userType, data) {
    const response = await this.request(`auth${userType}/token`, data, "post");
    this.token = response.token;
    return response.token;
  }

  /**Authenticate for both shelters and adopters
   * userType = Shelter/Adopter
   */
  static async authenticate(userType, data) {
    const response = await this.request(
      `auth${userType}/authenticate`,
      data,
      "post"
    );
    return response;
  }

  /*Get all users userType = shelters/adopters/adoptableDogs
   * can filter the search with data
   * shelter data = {name, city, state, postcode}
   * adopter data = {username}
   * adoptableDog data = {name, goodWDogs, goodWCats, goodWKids, breedId, age, gender}
   */
  static async getAll(userType, data = {}, token = this.token) {
    this.token = token;
    const res = await this.request(`${userType}`, data);
    return res[userType];
  }

  /**Get individual
   * adopters params = username
   * shelters params = userId
   * adoptableDogs params = dogId (can be number or string)
   */
  static async get(type, params, token = this.token) {
    this.token = token;
    const res = await this.request(`${type}/${params}`);
    if (type === "shelters" && res.shelter) {
      return res.shelter;
    } else if (type === "adopters" && res.adopter) {
      return res.adopter;
    } else if (type === "adoptableDogs" && res.adoptableDog) {
      return res.adoptableDog;
    } else {
      return "No data found";
    }
  }

  /**Create a new shelter/adopter
   * type = shelters/adopters
   * shelter data = {username, password, name, address (optional), city, state, postcode (optional), phoneNumber, email, logo (optional), description (optional) }
   * adopter data = { username, password, email }
   */
  static async create(type, data) {
    const res = await this.request(`${type}/`, data, "post");
    if (type === "shelters") {
      return res.newAdopter;
    } else if (type === "adopters") {
      return res.newShelter;
    }
  }

  /**Create a new adoptableDog
   * params = userId (id of a shelter posting a new dog)
   * * adoptableDog data = {name, breed_id, gender, age, picture, description, goodWKids, goodWDogs, goodWCcats, shelterId}
   */
  static async createDog(params, data) {
    const res = await this.request(`adoptableDogs/${params}`, data, "post");
    return res.newAdoptableDog;
  }

  /**Update an existing shelter/adopter
   * type = adopters/shelters (params: username, userId)
   * adopter data = { username, email, picture, description, privateOutdoors, numOfDogs, preferredGender, preferredAge}
   * shelter data = { name, address, city, state, postcode, phoneNumber, email, logo, description }
   */
  static async update(type, data, params) {
    const res = await this.request(`${type}/${params}`, data, "patch");
    if (type === "shelters") {
      return res.shelter;
    } else if (type === "adopters") {
      return res.adopter;
    }
  }

  /**Update an existing dog
   * params = {userId, dogId}
   * adoptableDog data = { name, breed_id, gender, age, picture, description, goodWKids, goodWDogs, goodWCats }
   */
  static async updateDog(data, params) {
    const res = await this.request(
      `adoptableDogs/${params.userId}/${params.dogId}`,
      data,
      "patch"
    );
    return res.adoptableDog;
  }

  /**Delete an existing shelter/adopter
   * type = shelters/adopters
   * shelter params = userId
   * adopter params = username
   */
  static async delete(type, params) {
    const res = await this.request(`${type}/${params}`, {}, "delete");
    return res;
  }

  /**Delete an existing dog
   * params = {userId, dogId}
   */
  static async deleteDog(userId, dogId) {
    const res = await this.request(
      `adoptableDogs/${userId}/${dogId}`,
      {},
      "delete"
    );
    return res;
  }

  /**Update Password
   * type = shelters/adopters
   * shelter params = userId
   * adopter params = username
   * data = new password
   * */
  static async resetPassword(type, data, params) {
    const res = await this.request(
      `${type}/resetPassword/${params}`,
      data,
      "patch"
    );
    return res;
  }

  /**Contact shelter
   * data = {message, name, adopterEmail}
   * params = userId (id of shelter that adopter wants to contact)
   */
  static async contactShelter(data, params) {
    const res = await this.request(
      `shelters/contactShelter/${params}`,
      data,
      "post"
    );
    return res;
  }

  /**Favorite a dog
   * params = adoptableDogId
   */
  static async favoriteDog(params) {
    const res = await this.request(`adopters/favoriteDog/${params}`, {}, "post");
    return res.favDog;
  }

  /**Unfavorite a dog
   * params = adoptableDogId
   */
  static async unFavoriteDog(params) {
    const res = await this.request(
      `adopters/unfavoriteDog/${params}`,
      {},
      "delete"
    );
    return res.unFavoriteDog;
  }

  /**Get an adopter's favorite dogs
   * params = username
   */
  static async getFavoriteDogs(params, token) {
    this.token = token;
    const res = await this.request(`adopters/favoriteDogs/${params}`);
    return res.favoriteDogs;
  }
}

export default PetlyApi;
