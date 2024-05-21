import API from '@plugins/api.plugin';
class DashboardService {
  getCompletedTrades() {
    return API.apiClient.get(
      `/trades?dashboard=true&searchByTradeStatus=completed`,
    );
  }
  getPendingTrades() {
    return API.apiClient.get(`/trades?dashboard=true&searchByTradeStatus=open`);
  }
  getRejectedTrades() {
    return API.apiClient.get(
      `/trades?dashboard=true&searchByTradeStatus=rejected`,
    );
  }
}

export default new DashboardService();
