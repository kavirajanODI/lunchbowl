import { UserInterface } from 'src/model/userSchema';
import httpAxiosClient from '../config/httpclient';

class UserApi {
  private userEndpoint: string;
  private childEndpoint:string

  constructor() {
    this.userEndpoint = '/customer/account-details';
    this.childEndpoint = '/customer/get-all-children';

  }

async getUserData(userId: string) {
  return await httpAxiosClient.post(
    `${this.userEndpoint}`,   
    { userId }                
  );
}

  async getChildData(userId: string) {
    return await httpAxiosClient.post(
      `${this.childEndpoint}`,
      { userId }
    )
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
    return await httpAxiosClient.post('/customer/change-password', {
      userId,
      ...passwordData,
    });
  }

  async updateUserDetails(userId: string, userDetails: Partial<UserInterface>) {
    return await httpAxiosClient.post(
      `${this.userEndpoint}/update-user-details/${userId}`,
      userDetails,
    );
  }
}

export default new UserApi();
