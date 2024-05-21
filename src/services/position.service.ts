import API from '@plugins/api.plugin';
import { addQueryParamsToUrl } from '@utils/constant';
import { formatDateString } from '@utils/helpers';
class PositionService {
  getPositionList(
    userId?: number | null,
    scriptId?: any,
    segmentId?: any,
    deliveryType?: string,
    expiryDate?: string,
    search?: string | null,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = {};
    if (scriptId) {
      params.scriptId = scriptId;
    }
    if (segmentId) {
      params.segmentId = segmentId;
    }
    if (deliveryType) {
      params.deliveryType = deliveryType;
    }
    if (search) {
      params.search = search;
    }
    if (expiryDate) {
      params.expiryDate = formatDateString(expiryDate);
    }
    return API.apiClient.get(
      addQueryParamsToUrl(
        userId ? `/trades/positions/${userId}` : '/trades/positions',
        params,
      ),
    );
  }
}
export default new PositionService();
