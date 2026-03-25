import httpAxiosClient from "../../config/httpclient";

class Menus {
  private menuEndpoint: string;
  private ChildEndPoint: string;
  constructor() {
    this.menuEndpoint = '/customer/save-Menu-Calendar';
    this.ChildEndPoint = '/customer/get-Menu-Calendar';
  }


  async createMenu(children: any) {
    return await httpAxiosClient.post(this.menuEndpoint, children);
  }
  async getChildren(requestData?: string) {
    return await httpAxiosClient.post(this.ChildEndPoint, requestData);
  }
  async getMenu(menuId: string) {
    return await httpAxiosClient.get(`${this.menuEndpoint}/${menuId}`);
  }

  async updateMenu(menuId: string, menuData: any) {
    return await httpAxiosClient.put(`${this.menuEndpoint}/${menuId}`, menuData);
  }

  async deleteMenu(menuId: string) {
    return await httpAxiosClient.delete(`${this.menuEndpoint}/${menuId}`);
  }

  async getAllMenus(path: string, userId: string) {
    return await httpAxiosClient.get(this.menuEndpoint);
  }
}

export default new Menus();
