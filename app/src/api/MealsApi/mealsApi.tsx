import httpAxiosClient from '../../config/httpclient';

class mealsApi {
  private AllMealsEndPoint: string;
  constructor() {
    this.AllMealsEndPoint = '/products/get-all-menu-dishes';
  }

  async getAllMealsList() {
    return await httpAxiosClient.get(
      `${this.AllMealsEndPoint}`
      
    );
  }

}
export default new mealsApi();
