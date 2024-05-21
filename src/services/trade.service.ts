import { IUpdateTrade } from '@interfaces/index';
import API from '@plugins/api.plugin';
import { addQueryParamsToUrl } from '@utils/constant';
class TradeService {
  createTrade(payload: any) {
    return API.apiClient.post(`/trades/create/balance`, payload);
  }

  getTradeList({
    userId,
    page,
    size,
    tradeType,
    days,
    scriptId,
    segmentId,
    startDate,
    endDate,
    tradePositionSubType,
    search,
  }: {
    userId?: number | null;
    page?: number;
    size?: number;
    tradeType?: string;
    days?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scriptId?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    segmentId?: any;
    startDate?: string | null;
    endDate?: string | null;
    tradePositionSubType?: string;
    search?: string | null;
  }) {
    const params: {
      limit?: number;
      offset?: number;
      searchByTradeStatus?: string;
      days?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      scriptId?: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      segmentId?: any;
      startDate?: string;
      endDate?: string;
      tradeType?: string;
      tradePositionSubType?: string;
      search?: string;
    } = {
      limit: size,
      offset: page,
      searchByTradeStatus: tradeType,
      days: days,
      tradePositionSubType: tradePositionSubType,
    };
    if (scriptId) {
      params.scriptId = scriptId;
    }
    if (segmentId) {
      params.segmentId = segmentId;
    }
    if (startDate) {
      params.startDate = startDate;
    }
    if (endDate) {
      params.endDate = endDate;
    }
    if (search) {
      params.search = search;
    }
    if (tradePositionSubType) {
      params.tradePositionSubType = tradePositionSubType;
    }
    return API.apiClient.get(
      addQueryParamsToUrl(userId ? `/trades/${userId}` : '/trades', params),
    );
  }

  getAllAutoSqureOffLogs(userId?: number | null, page?: number, size?: number) {
    const params: { userId?: number | null; offset?: number; limit?: number } =
      {
        offset: page,
        limit: size,
      };
    if (page) {
      params.offset = page;
    }
    if (size) {
      params.limit = size;
    }
    return API.apiClient.get(
      addQueryParamsToUrl(
        userId
          ? `/trades/autoSquareOffLogs/list/${userId}`
          : '/trades/autoSquareOffLogs/list',
        params,
      ),
    );
  }
  getAllTradeList(days?: string) {
    return API.apiClient.get(
      `/trades?days=${days}&exportData=true&dashboard=true`,
    );
  }

  updateTrade(tradeId: number, payload: IUpdateTrade) {
    return API.apiClient.put(`/trades/${tradeId}`, payload);
  }
  getShortTradeReport(
    tradeDate?: string | undefined,
    tradeMinute?: string | undefined,
    scriptId?: number | undefined,
    userId?: number | undefined,
  ) {
    const params: {
      scriptId?: number | undefined;
      tradeMinute?: string | undefined;
      userId?: number | undefined;
      tradeDate?: string | undefined;
    } = {};
    if (tradeDate) {
      params.tradeDate = tradeDate;
    }
    if (tradeMinute) {
      params.tradeMinute = tradeMinute;
    }
    if (userId) {
      params.userId = userId;
    }
    if (scriptId) {
      params.scriptId = scriptId;
    }
    return API.apiClient.get(
      addQueryParamsToUrl('/trades/short/report', params),
    );
  }

  getRejected({
    userId,
    page,
    size,

    scriptId,
    segmentId,
    startDate,
    endDate,
    search,
  }: {
    userId?: number | null;
    page?: number;
    size?: number;
    tradeType?: string;
    days?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scriptId?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    segmentId?: any;
    startDate?: string;
    endDate?: string;
    search?: string | null;
  }) {
    const params: {
      userId?: number | null;
      limit?: number;
      offset?: number;
      searchByTradeStatus?: string;
      days?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      scriptId?: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      segmentId?: any;
      startDate?: string;
      endDate?: string;
      tradeType?: string;
      tradePositionSubType?: string;
      search?: string;
    } = {
      limit: size,
      offset: page,
      searchByTradeStatus: 'rejected',
      days: 'old',
    };
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
    if (search) {
      params.search = search;
    }
    if (userId) {
      params.userId = userId;
    }
    if (endDate) {
      params.endDate = endDate;
    }
    return API.apiClient.get(
      addQueryParamsToUrl(userId ? `/trades/${userId}` : '/trades', params),
    );
  }
  getTradeLogs({
    page,
    size,
    userId,
    scriptId,
    segmentId,
    startDate,
    endDate,
  }: {
    page?: number;
    size?: number;
    userId?: number | undefined | null;
    scriptId?: number | undefined;
    segmentId?: number | undefined;
    startDate?: string | undefined | null;
    endDate?: string | undefined | null;
  }) {
    const params: {
      offset?: number;
      limit?: number;
      userId?: number | undefined;
      scriptId?: number | undefined;
      segmentId?: number | undefined;
      startDate?: string | undefined | null;
      endDate?: string | undefined | null;
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
      addQueryParamsToUrl(
        userId ? `/tradelogs/${userId}` : '/tradelogs',
        params,
      ),
    );
  }
  getAutosquareOffLogs(
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
      `/trades/autoSquareOffLogs/list/?offset=${page}&limit=${size}`,
    );
  }
  getUserLogs(
    userId?: number | null,
    page?: number,
    size?: number,
    startDate?: string | null,
  ) {
    const params: {
      limit?: number;
      offset?: number;
      startDate?: string | null;
    } = {
      limit: size,
      offset: page,
    };
    if (startDate) {
      params.startDate = startDate;
    }
    return API.apiClient.get(
      addQueryParamsToUrl(
        userId ? `/audit-logs/${userId}` : '/audit-logs',
        params,
      ),
    );
  }

  //new added
  getBlockScript(page?: number, size?: number) {
    const params: { offset?: number; limit?: number } = {
      offset: page,
      limit: size,
    };
    if (page) {
      params.offset = page;
    }
    if (size) {
      params.limit = size;
    }
    return API.apiClient.get(
      `scripts/view/scripts/block?limit=${size}&offset=${page}`,
    );
  }
}

export default new TradeService();
