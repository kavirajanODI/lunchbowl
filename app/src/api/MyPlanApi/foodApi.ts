import httpAxiosClient from '../../config/httpclient';

class FoodApi {
  private foodEndpoint: string;

  constructor() {
    this.foodEndpoint = '/customer';
  }

  async createFood(foodData: any) {
    return await httpAxiosClient.post(`${this.foodEndpoint}/create`, foodData);
  }

  async getFood(foodId: string) {
    return await httpAxiosClient.get(`${this.foodEndpoint}/${foodId}`);
  }

  async updateFood(foodId: string, foodData: any) {
    return await httpAxiosClient.put(
      `${this.foodEndpoint}/${foodId}`,
      foodData,
    );
  }

  async deleteFood(foodId: string) {
    return await httpAxiosClient.delete(`${this.foodEndpoint}/${foodId}`);
  }

  //   async getAllFoods(path: string,userId: string, ) {
  //     return await httpAxiosClient.get(`${this.foodEndpoint}/get-saved-meals`, {
  //       params: { path,userId,},
  //     });
  //   }

  async getAllFoods(path: string, userId: string) {
    return await httpAxiosClient.post(`${this.foodEndpoint}/get-saved-meals`, {
      _id: userId,
      path,
    });
  }
}

export default new FoodApi();
