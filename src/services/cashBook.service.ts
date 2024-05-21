import API from '@plugins/api.plugin';
import { addQueryParamsToUrl } from '@utils/constant';

class LedgerService {
  createCashBook(payload: any) {
    return API.apiClient.post(`/cashBooks`, payload);
  }

  getCashBookList(
    page?: number,
    size?: number,
    str?: string,
    userId?: number | null,
    entryType?: string,
  ) {
    const params: {
      limit?: number;
      offset?: number;
      search?: string;
      userId?: number | null;
      entryType?: string;
    } = {
      limit: size,
      offset: page,
      search: str,
      entryType,
    };
    if (userId) {
      params.userId = userId;
    }
    return API.apiClient.get(
      addQueryParamsToUrl(
        userId ? `/cashBooks/${userId}` : '/cashBooks',
        params,
      ),
    );
  }

  getAllUsersCashLedgers(
    userId?: number | null,
    page?: number,
    size?: number,
    str?: string,
    entryType?: string,
  ) {
    const params: {
      userId?: number | null;
      limit?: number;
      offset?: number;
      search?: string;
      entryType?: string;
    } = {
      limit: size,
      offset: page,
      search: str,
      entryType,
    };
    if (userId) {
      params.userId = userId;
    }
    return API.apiClient.get(
      // addQueryParamsToUrl(
      //   userId
      //     ? `/cashbooks/allUsersCashLedgers/${userId}`
      //     : '/cashbooks/allUsersCashLedgers',
      //   params,
      // ),

      `cashbooks/allUsersCashLedgers/?limit=10&offset=1&entryType=cashDeposit`,
    );
  }

  getBalanceByUserId(userId: number, type: string) {
    if (type === 'cash') {
      return API.apiClient.get(`/ledgers/balance/${userId}`);
    } else {
      return API.apiClient.get(`/cashBooks/balance/${userId}`);
    }
  }
}
export default new LedgerService();
