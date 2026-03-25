
import menuApi from 'api/MyPlanApi/menuApi';
import { ApiResponseModel } from 'src/model/apiResponseModel';

class MenuService {

  
 static async getChildren(requestData:any): Promise<ApiResponseModel> {
    try {
      const response = await menuApi.getChildren(requestData);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error creating menu',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }
  static async saveMenuSelection(children:any): Promise<ApiResponseModel> {
    try {
      const response = await menuApi.createMenu(children);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error creating menu',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async getMenu(menuId: string): Promise<ApiResponseModel> {
    try {
      const response = await menuApi.getMenu(menuId);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error fetching menu',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async updateMenu(menuId: string, menuData: any): Promise<ApiResponseModel> {
    try {
      const response = await menuApi.updateMenu(menuId, menuData);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error updating menu',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async deleteMenu(menuId: string): Promise<ApiResponseModel> {
    try {
      const response = await menuApi.deleteMenu(menuId);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error deleting menu',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async getAllMenus(path: string, userId: string): Promise<ApiResponseModel> {
    try {
      const response = await menuApi.getAllMenus(path, userId);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error fetching all menus',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  private static handleApiError(error: any): string {
    if (error.response) {
      return `Error: ${error.response.data?.message || 'An unexpected error occurred'}`;
    } else if (error.request) {
      return 'No response from server';
    } else {
      return `Error: ${error.message}`;
    }
  }
}

export default MenuService;
