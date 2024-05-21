import API from '@plugins/api.plugin';
import { Role } from '@interfaces/user.interface';
import { IStatus } from '@interfaces/index';
import { addQueryParamsToUrl } from '@utils/constant';
import { Status } from '@interfaces/common';
class AccountService {
  // getAccountList(page?: number, size?: number, str?: string, role?: Role) {
  //   return API.apiClient.get(
  //     `/users?limit=${size}&offset=${page}&role=${role}&search=${str}`,
  //   );
  // }
  getRandomGenerateUserId() {
    return API.apiClient.get('/users/randomUserId');
  }
  getAccountList(
    page?: number,
    size?: number,
    str?: string,
    tradeUserId?: number | null,
    role?: Role,
    status?: Status | null,
    startDate?: string | null,
    endDate?: string | null,
    loginAfter?: string | null,
    loginBefore?: string | null,
  ) {
    const params: {
      limit?: number;
      offset?: number;
      search?: string;
      userId?: number | null;
      role?: Role;
      status?: Status | null;
      startDate?: string | null;
      endDate?: string | null;
      loginAfter?: string | null;
      loginBefore?: string | null;
    } = {
      limit: size,
      offset: page,
      search: str,
      role: role,
      userId: tradeUserId,
      status: status,
    };
    if (startDate) {
      params.startDate = startDate;
    }
    if (endDate) {
      params.endDate = endDate;
    }
    if (loginAfter) {
      params.loginAfter = loginAfter;
    }
    if (loginBefore) {
      params.loginBefore = loginBefore;
    }
    return API.apiClient.get(addQueryParamsToUrl('/users', params));
  }
  getBrokerAccountList(
    page?: number,
    size?: number,
    str?: string,
    userId?: number | null,
    role?: Role,
    status?: string | null,
    startDate?: string | null,
    endDate?: string | null,
    loginAfter?: string | null,
    loginBefore?: string | null,
  ) {
    const params: {
      limit?: number;
      offset?: number;
      userId?: any;
      search?: any;
      role?: string;
      status?: string;
      startDate?: string | null;
      endDate?: string | null;
      loginAfter?: string | null;
      loginBefore?: string | null;
    } = {
      limit: size,
      offset: page,
      role: role,
    };
    if (str) {
      params.search = str;
    }
    if (status) {
      params.status = status;
    }
    if (startDate) {
      params.startDate = startDate;
    }
    if (endDate) {
      params.endDate = endDate;
    }
    if (loginAfter) {
      params.loginAfter = loginAfter;
    }
    if (loginBefore) {
      params.loginBefore = loginBefore;
    }
    return API.apiClient.get(
      addQueryParamsToUrl(
        userId ? `/users/brokers/${userId}` : '/users/brokers',
        params,
      ),
    );
  }

  getAccountListAdmin(
    page?: number,
    size?: number,
    str?: string,
    tradeUserId?: number | null,
    role?: Role,
  ) {
    const params: {
      limit?: number;
      offset?: number;
      search?: string;
      userId?: number | null;
      role?: Role;
    } = {
      limit: size,
      offset: page,
      search: str,
      role: role,
      userId: tradeUserId,
    };
    return API.apiClient.get(addQueryParamsToUrl('/users', params));
  }

  createUserSegmentBrokerageLotsEntry(payload: any) {
    return API.apiClient.post(
      `/users/createUserSegmentBrokerageLotsEntry`,
      payload,
    );
  }
  updateUserSegmentBrokerageLotsEntry(payload: any) {
    return API.apiClient.put(
      `/users/updateUserSegmentBrokerageLotsEntry`,
      payload,
    );
  }
  getUserAuditList(userId?: number | null, page?: number, size?: number) {
    const params: { limit?: number; offset?: number } = {
      limit: size,
      offset: page,
    };
    return API.apiClient.get(
      addQueryParamsToUrl(
        userId ? `/audit-logs/${userId}` : '/audit-logs',
        params,
      ),
    );
  }
  onlyPositionSquareOff(userId: number, payload: IStatus) {
    return API.apiClient.put(`/users/onlyPositionSquareOff/${userId}`, payload);
  }
  m2mAlertOfUsers() {
    return API.apiClient.get(`/users/m2mAlertOfUsers`);
  }
  exportAccountList(exportData?: boolean, role?: Role) {
    return API.apiClient.get(`/users?role=${role}&exportData=${exportData}`);
  }
  getAccountById(id: number) {
    return API.apiClient.get(`/users/${id}`);
  }
  getUsersName() {
    return API.apiClient.get(`/users/myAllUsers`);
  }
  findUserByName(userName: string) {
    return API.apiClient.get(`/users/findByName/${userName}`);
  }
  updateAccountById(userId: number, payload: any) {
    return API.apiClient.put(`/users/${userId}`, payload);
  }
  deleteAccountById(userId: number) {
    return API.apiClient.delete(`/users/${userId}`);
  }
  getSegments() {
    return API.apiClient.get(`/segments?limit=10&offset=1&fetchType=dropdown`);
  }
  getTradesList(page?: number, size?: number, str?: string) {
    return API.apiClient.get(
      `/trades?limit=${size}&offset=${page}&search=${str}`,
    );
  }
  getAllRoles() {
    return API.apiClient.get(`/roles?limit=10&offset=1&fetchType=dropdown`);
  }
  createAccount(payload: any) {
    return API.apiClient.post(`/users`, payload);
  }
  getMasterCount() {
    return API.apiClient.get(`/users?role=master`);
  }
  isUserAvailable(userId: string) {
    return API.apiClient.get(`/users/available/${userId}`);
  }
  changeStatusById(userId: number, payload: IStatus) {
    return API.apiClient.put(`/users/changeStatus/${userId}`, payload);
  }
  deleteUsersSegmentBrokerageLotsEntry(id: number) {
    return API.apiClient.delete(
      `/users/removeUsersSegmentBrokerageLotsEntry/${id}`,
    );
  }
  getSummaryReport(
    page?: number,
    size?: number,
    userId?: number | undefined,
    scriptId?: number | undefined,
    segmentId?: number | undefined,
    startDate?: string | undefined,
    endDate?: string | undefined,
  ) {
    const params: {
      offset?: number;
      limit?: number;
      userId?: number | undefined;
      scriptId?: number | undefined;
      segmentId?: number | undefined;
      startDate?: string | undefined;
      endDate?: string | undefined;
    } = {};
    if (page) {
      params.offset = page;
    }
    if (size) {
      params.limit = size;
    }
    if (scriptId) {
      params.scriptId = scriptId;
    }
    if (segmentId) {
      params.segmentId = segmentId;
    }
    if (startDate) {
      params.startDate = startDate;
    }
    if (userId) {
      params.userId = userId;
    }
    if (endDate) {
      params.endDate = endDate;
    }
    return API.apiClient.get(
      addQueryParamsToUrl('/users/report/summary', params),
    );
  }

  MaxqtyLimit() {
    return API.apiClient.get(`groups/?limit=10&offset=1&groupType=qtyScript`);
  }
  getViewQuantityScriptsofUsers(
    page?: number,
    size?: number,
    segmentId?: any,
    scriptId?: any,
    search?: string,
  ) {
    const params: {
      limit?: number;
      offset?: number;
      userId?: any;
      scriptId?: any;
      segmentId?: any;
      search?: any;
    } = {
      limit: size,
      offset: page,
    };
    if (segmentId) {
      params.segmentId = segmentId;
    }
    if (scriptId) {
      params.scriptId = scriptId;
    }
    if (search) {
      params.search = search;
    }

    return API.apiClient.get(
      addQueryParamsToUrl(`/groups/view/scripts/qty`, params),
    );
  }
}
export default new AccountService();
