import { InstrumentQuery, InstrumentResponse } from '@interfaces/account.interface';
import API from '@plugins/api.plugin';

class InstrumentService {
  getExpiryDates(segmentId: number, scriptId: number) {
    return API.apiClient.get(
      `/instruments/expiryDates/${segmentId}/${scriptId}`,
    );
  }
  getWatchListScripts(segmentId: number, expiry: string) {
    return API.apiClient.get(
      `/instruments/watchListScripts/${segmentId}/${expiry}`,
    );
  }

  getAllSubscribedSymbols() {
    return API.apiClient.get(`/instruments/watchListScripts/1/25APR2024`);
  }

  getStrikePrices(segmentId: number, scriptId: number, expiry: string) {
    return API.apiClient.get(
      `/instruments/strikePrices/${segmentId}/${scriptId}/${expiry}`,
    );
  }
  getIdentifier({ segmentId, scriptId, expiry, optionType, strikePrice }: InstrumentQuery) {
    let instrumentUrl = `/instruments/identifier/${segmentId}/${scriptId}/${expiry}`;
    if (optionType && strikePrice) instrumentUrl += `/${optionType}/${strikePrice}`;
    return API.apiClient.get<InstrumentResponse>(instrumentUrl);

  }
}
export default new InstrumentService();
