import { ILoginPayload } from '@interfaces/user.interface';
import API from '@plugins/api.plugin';

class AuthService {
  login(payload: ILoginPayload) {
    return API.apiClient.post(`/auth/login`, { ...payload, isMobileApp: true });
  }
  whoAmI() {
    return API.apiClient.get(`/auth/whoami`);
  }
  logout() {
    return API.apiClient.get(`/auth/logout`);
  }

  resetPasswordByMaster(payload: object) {
    return API.apiClient.post(`/auth/resetPasswordByMaster`, {
      ...payload,
      isMobileApp: true,
    });
  }

  changePassword(payload: any) {
    return API.apiClient.post(`/auth/changePassword`, {
      ...payload,
      isMobileApp: true,
    });
  }

  getBalanceByUserId() {
    return API.apiClient.get(`/ledgers/block/balance`);
  }
}

export default new AuthService();
