import API from '@plugins/api.plugin';
import { addQueryParamsToUrl } from '@utils/helpers';

class BrokerService {
  createBrokerUsers(payload: any) {
    return API.apiClient.post(`/users/brokerUsers`, payload);
  }

  getBrokerUsers(userId?: number) {
    const params: any = {};
    return API.apiClient.get(
      addQueryParamsToUrl(
        userId
          ? `/users/findAllUsersOfBrokerUser/${userId}?fetchType=dropdown&role=user`
          : '/users/findAllUsersOfBrokerUser?fetchType=dropdown&role=user',
        params,
      ),
    );
  }
  getAllBrokerBillOfUsers(startDate?: string | null, endDate?: string | null, userId?: number | null) {
    const params: { startDate?: string | null; endDate?: string | null } = {
      startDate,
      endDate,
    };
    return API.apiClient.get(addQueryParamsToUrl(userId ? `/users/brokerBillOfUsers/${userId}` : `/users/brokerBillOfUsers`, params));
  }
}
export default new BrokerService();
