import API from '@plugins/api.plugin';
import { addQueryParamsToUrl } from '@utils/constant';
class LedgerService {
  createLedger(payload: any) {
    return API.apiClient.post(`/ledgers`, payload);
  }
  createJVEntry(payload: any) {
    return API.apiClient.post(`/ledgers/jvEntry`, payload);
  }

  getAllBrokerBillOfUsers(
    startDate?: string,
    endDate?: string,
    userId?: number | null,
  ) {
    const params: { startDate?: string; endDate?: string } = {
      startDate,
      endDate,
    };
    return API.apiClient.get(
      addQueryParamsToUrl(
        userId
          ? `/users/brokerBillOfUsers/${userId}`
          : `/users/brokerBillOfUsers`,
        params,
      ),
    );
  }
  getAllCashLedgers(
    page?: number,
    size?: number,
    userId?: number | null,
    startDate?: string,
    endDate?: string,
    str?: string,
  ) {
    const params: any = {
      limit: size,
      offset: page,
      startDate: startDate,
      endDate: endDate,
      search: str,
    };
    return API.apiClient.get(
      addQueryParamsToUrl(userId ? `/ledgers/${userId}` : `/ledgers`, params),
    );
  }

  getCashLedgersList(
    userId?: number,
    page?: number,
    size?: number,
    str?: string,
  ) {
    let params: any = {
      limit: size,
      offset: page,
      search: str,
    };
    if (userId) {
      params.userId = userId;
    }
    return API.apiClient.get(
      addQueryParamsToUrl(
        userId ? `/ledgers/cash/${userId}` : `/ledgers/cash`,
        params,
      ),
    );
  }
  getCashJVEntryList(
    // userId?: number,
    // startDate?: string,
    // endDate?: string,
    // page?: number,
    // size?: number,
    // entryType?: string
    page?: number,
    pageSize?: string,
  ) {
    // const params: any = {
    //   limit: size,
    //   offset: page,
    //   entryList: entryType,
    // };
    // if (userId) {
    //   params.userId = userId;
    // }
    // if (startDate) {
    //   params.startDate = startDate;
    // }
    // if (endDate) {
    //   params.endDate = endDate;
    // }
    // return API.apiClient.get(
    //   addQueryParamsToUrl(
    //     userId ? `/ledgers/entries/${userId}` : `/ledgers/entries`,
    //     params
    //   )
    // );
    return API.apiClient.get(
      `/ledgers/entries/?limit=${pageSize}&offset=${page}&entryList=jv`,
    );
  }

  getUplineBills(startDate?: string, endDate?: string, userId?: number) {
    let params: any = {
      startDate,
      endDate,
    };
    if (userId) {
      params.userId = userId;
    }
    return API.apiClient.get(
      addQueryParamsToUrl(
        userId ? `/valans/getUplineBill/${userId}` : `/valans/getUplineBill`,
        params,
      ),
    );
  }

  getAllUsersLedgers(
    userId?: number | null,
    page?: number,
    size?: number,
    str?: string,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = {
      limit: size,
      offset: page,
      search: str,
    };
    return API.apiClient.get(
      addQueryParamsToUrl(
        userId
          ? `/ledgers/allUsersLedgers/${userId}`
          : `/ledgers/allUsersLedgers`,
        params,
      ),
    );
  }

  getValanDropDownList() {
    return API.apiClient.get(`/valans/dates?fetchType=dropdown`);
  }

  getValanviseList(userId?: number) {
    return API.apiClient.get(`/valans/all/${userId}`);
  }

  getCashLedgerById(id: number) {
    return API.apiClient.get(`/ledgers/specialAccount/${id}`);
  }
  updateLedgerById(userId: number, payload: any) {
    return API.apiClient.put(`/ledgers/${userId}`, payload);
  }
  getCashEntryList(
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
      `/ledgers/entries/?limit=${size}&offset=${page}&entryList=cash`,
    );
  }

  ledgerModel(id: number) {
    return API.apiClient.get(`/ledgers/${id}/?userId=${id}`);
  }

  getBrokerBrokerage() {
    return API.apiClient.get(`/trades/broker/brokerage`);
  }
}
export default new LedgerService();
