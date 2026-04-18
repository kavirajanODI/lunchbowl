
import UserApi from 'api/userApi';
import { ApiResponseModel } from 'src/model/apiResponseModel';
import { handleApiError } from 'utils/handleError';

class UserService {

  static async updatePassword(
    userId: string,
    passwordData: any,
  ): Promise<ApiResponseModel> {
    try {
      const response = await UserApi.updatePassword(userId, passwordData);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error updating password',
        data: null,
        error: handleApiError(error),
      };
    }
  }

  static async getRegisteredUSerData(userId: string): Promise<ApiResponseModel> {
    try {
      const response = await UserApi.getUserData(userId);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error fetching user info',
        data: null,
        error: handleApiError(error),
      };
    }
  }

  static async updateUserDetails(
    userId: string,
    userDetails: any,
  ): Promise<ApiResponseModel> {
    try {
      const response = await UserApi.updateUserDetails(userId, userDetails);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error updating user details',
        data: null,
        error: handleApiError(error),
      };
    }
  }

  static async getChildInformation(
    userId: string,
    path?: string,
  ): Promise<ApiResponseModel> {
    try {
      const response = await UserApi.getChildData(userId, path);
      return response.data as ApiResponseModel
    }
    catch (error: any) {
      return {
        success: false,
        message: 'Error updating user details',
        data: null,
        error: handleApiError(error),
      };

    }
  }

  /**
   * Permanently deletes the user's account and all related data from the database.
   * The caller is responsible for logging the user out afterwards.
   */
  static async deleteAccount(userId: string): Promise<ApiResponseModel> {
    try {
      const response = await UserApi.deleteAccount(userId);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error deleting account',
        data: null,
        error: handleApiError(error),
      };
    }
  }
}

export default UserService;
