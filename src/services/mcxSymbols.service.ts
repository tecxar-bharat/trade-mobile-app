import API from '@plugins/api.plugin';

class McxSymbolsService {
  addMcxSymbol(payload: {
    instrumentId: number;
    identifier: string;
    symbol: string;
    refSlug: string;
  }) {
    return API.apiClient.post(`/mcx-current-symbols`, payload);
  }

  getCurrentMcxSymbols() {
    return API.apiClient.get(`/mcx-current-symbols`);
  }

  getMcxSymbols() {
    return API.apiClient.get(`/mcx-current-symbols/mcxSymbols`);
  }

  deleteMcxSymbolById(id: number) {
    return API.apiClient.delete(`/mcx-current-symbols/${id}`);
  }
}

export default new McxSymbolsService();
