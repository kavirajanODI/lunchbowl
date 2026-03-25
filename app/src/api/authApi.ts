import { LoginForm } from 'src/model/authModel';
import httpAxiosClient from '../config/httpclient';
import { ApiResponseModel } from '../model/apiResponseModel';

/**
 * Class representing the authentication API.
 */
class AuthApi {
  private authEndpoint: string;

  constructor() {
    // this.authEndpoint = '/auth';
    this.authEndpoint = '/customer';
  }

  /**
   * Method to handle user login.
   * @param credentials - An object containing the user's email and password.
   * @returns A promise that resolves to the response of the login request.
   */

  async login(userData: any): Promise<ApiResponseModel> {
    return await httpAxiosClient.post(
      `${this.authEndpoint}/verifyOtp`,
      userData,
    );
  }

  async SendOtp(credentials: { mobile: string }): Promise<ApiResponseModel> {
    return await httpAxiosClient.post(
      `${this.authEndpoint}/sendOtp`,
      credentials,
    );
  }

  /**
   * Method to handle user registration.
   * @param userData - An object containing the user's email, password, and name.
   * @returns A promise that resolves to the response of the registration request.
   */

  async register(userData: any): Promise<ApiResponseModel> {
    return await httpAxiosClient.post(
      `${this.authEndpoint}/verifyOtp`,
      userData,
    );
  }

  /**
   * Method to handle user logout.
   * @returns A promise that resolves to the response of the logout request.
   */
  async logout(): Promise<ApiResponseModel> {
    return await httpAxiosClient.post(`${this.authEndpoint}/logout`);
  }

  /**
   * Method to refresh the authentication token.
   * @param token - The current authentication token.
   * @returns A promise that resolves to the response of the token refresh request.
   */
  async refreshToken(token: string): Promise<ApiResponseModel> {
    return await httpAxiosClient.post(`${this.authEndpoint}/refresh-token`, {
      token,
    });
  }

  /**
   * Method to verify the user's role.
   * @param role - The role to be verified.
   * @returns A promise that resolves to the response of the role verification request.
   */
  async verifyRole(role: string): Promise<ApiResponseModel> {
    return await httpAxiosClient.get(`${this.authEndpoint}/verify-role`, {
      params: { role },
    });
  }

  /**
   * Method to verify the user's email.
   * @param email - The email to be verified.
   * @returns A promise that resolves to the response of the email verification request.
   */
  async verifyEmail(email: string): Promise<ApiResponseModel> {
    return await httpAxiosClient.get(`${this.authEndpoint}/verify-email`, {
      params: { email },
    });
  }

  /**
   * Method to complete the onboarding process.
   * @param userInfo - The user information required to complete onboarding.
   * @returns A promise that resolves to the response of the onboarding request.
   */
  async completeOnboarding(userInfo: string): Promise<ApiResponseModel> {
    return await httpAxiosClient.post(
      `${this.authEndpoint}/complete-onboarding/`,
      userInfo,
    );
  }
}

export default new AuthApi();
