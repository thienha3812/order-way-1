import { url } from 'inspector';
import apiConfig from './apiConfig';

export interface LoginDTO {
  phone_number: string;
  password: string;
}

class UserService {
  constructor() {}

  static async login(data: LoginDTO) {
    try {
      const url = '/staff/login';
      const response = await apiConfig.post(url, data);
      return response.data;
    } catch (err) {
      return err;
    }
  }
}

export default UserService;
