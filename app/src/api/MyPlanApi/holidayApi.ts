
import httpAxiosClient from "../../config/httpclient";

class Holidays {
  private holidayEndpoint: string;

  constructor() {
    this.holidayEndpoint = '/holidays/get-all-holidays';
  }

  async createHoliday(holidayData: any) {
    return await httpAxiosClient.post(this.holidayEndpoint, holidayData);
  }

  async getHoliday(holidayId: string) {
    return await httpAxiosClient.get(`${this.holidayEndpoint}/${holidayId}`);
  }

  async updateHoliday(holidayId: string, holidayData: any) {
    return await httpAxiosClient.put(`${this.holidayEndpoint}/${holidayId}`, holidayData);
  }

  async deleteHoliday(holidayId: string) {
    return await httpAxiosClient.delete(`${this.holidayEndpoint}/${holidayId}`);
  }

  async getAllHolidays() {
    return await httpAxiosClient.get(this.holidayEndpoint);
  }
}

export default new Holidays();
