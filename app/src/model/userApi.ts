import {UserInterface} from 'models/schema/userSchema';
import httpAxiosClient from '../config/httpclient';

class UserApi {
  private userEndpoint: string;

  constructor() {
    this.userEndpoint = '/users';
  }

  async getUser(userId: string) {
    return await httpAxiosClient.get(`${this.userEndpoint}/${userId}`);
  }

  async updateUser(userId: string, userData: any) {
    return await httpAxiosClient.post(
      `${this.userEndpoint}/${userId}`,
      userData,
    );
  }

  async deleteUser(userId: string) {
    return await httpAxiosClient.delete(`${this.userEndpoint}/${userId}`);
  }

  async updatePassword(userId: string, passwordData: any) {
    return await httpAxiosClient.post(
      `${this.userEndpoint}/update-password/${userId}`,
      passwordData,
    );
  }

  async updateUserDetails(userId: string, userDetails: Partial<UserInterface>) {
    return await httpAxiosClient.post(
      `${this.userEndpoint}/update-user-details/${userId}`,
      userDetails,
    );
  }
}

export default new UserApi();
