import RegistrationApi from 'api/RegistrationApi/RegistrationApi';
import {ApiResponseModel} from 'src/model/apiResponseModel';

class RegistrationService {
  static async getParentAndChildren(userId: string): Promise<ApiResponseModel> {
    try {
      const response = await RegistrationApi.getParentAndChildren(userId);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error fetching parent and children info',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async updateParent(payload: {
    formData: any;
    _id: string | null;
    path: string;
  }): Promise<ApiResponseModel> {
    try {
      const response = await RegistrationApi.updateParentDetails(payload as any);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error updating parent details',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async updateChildren(payload: {
    formData: any[];
    _id: string | null;
    path: string;
  }): Promise<ApiResponseModel> {
    try {
      const response = await RegistrationApi.updateChildrenDetails(payload as any);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error updating children details',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async deleteChild(
    userId: string | null,
    childId: string,
  ): Promise<ApiResponseModel> {
    try {
      const response = await RegistrationApi.deleteChild(userId ?? '', childId);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error deleting child',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async createParentRegistration(
    registrationData: any,
  ): Promise<ApiResponseModel> {
    try {
      const response = await RegistrationApi.createParentRegistration(
        registrationData,
      );
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error creating registration',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

    static async getPerDayCost(
    token: any,
  ): Promise<ApiResponseModel> {
    try {
      const response = await RegistrationApi.getPerDayCost(token        
      );
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error creating registration',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }
  // getPerDayCost

  static async createChildRegistration(
    registrationData: any,
  ): Promise<ApiResponseModel> {
    try {
      const response = await RegistrationApi.createChildRegistration(
        registrationData,
      );
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error creating registration',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async getRegistration(
    registrationId: string,
  ): Promise<ApiResponseModel> {
    try {
      const response = await RegistrationApi.getRegistration(registrationId);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error fetching registration',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async getRegisterdUserData(userId: string): Promise<ApiResponseModel> {
    try {
      const response = await RegistrationApi.getRegisterdUserData(userId);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error fetching registration',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async registrationCheck(payload: { _id: string; path: string }): Promise<ApiResponseModel> {
    try {
      const response = await RegistrationApi.registrationCheck(payload);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error fetching registration',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async startSubscription(
    payloadData: string,
  ): Promise<ApiResponseModel> {
    try {
      const response = await RegistrationApi.startSubscription(payloadData);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error fetching registration',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async getAllSchools(): Promise<ApiResponseModel> {
    try {
      const response = await RegistrationApi.getAllSchools();
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error fetching registration',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async updateRegistration(
    registrationId: string,
    registrationData: any,
  ): Promise<ApiResponseModel> {
    try {
      const response = await RegistrationApi.updateRegistration(
        registrationId,
        registrationData,
      );
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error updating registration',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async deleteRegistration(
    registrationId: string,
  ): Promise<ApiResponseModel> {
    try {
      const response = await RegistrationApi.deleteRegistration(registrationId);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error deleting registration',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async getAllRegistrations(
    path: string,
    userId: string,
  ): Promise<ApiResponseModel> {
    try {
      const response = await RegistrationApi.getAllRegistrations(path, userId);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error fetching all registrations',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  static async savePlans(payload: string): Promise<ApiResponseModel> {
    try {
      const response = await RegistrationApi.savePlansDetails(payload);
      return response.data as ApiResponseModel;
    } catch (error: any) {
      return {
        success: false,
        message: 'Error fetching all registrations',
        data: null,
        error: this.handleApiError(error),
      };
    }
  }

  private static handleApiError(error: any): string {
    if (error.response) {
      return `Error: ${
        error.response.data?.message || 'An unexpected error occurred'
      }`;
    } else if (error.request) {
      return 'No response from server';
    } else {
      return `Error: ${error.message}`;
    }
  }
}

export default RegistrationService;
