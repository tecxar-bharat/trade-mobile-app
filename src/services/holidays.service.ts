import { IHoliday } from "@interfaces/account.interface";
import API from "@plugins/api.plugin";
import { addQueryParamsToUrl } from "@utils/helpers";

class HolidayService {
  getAllHoliday(segmentId?: number, page?: number, size?: number, exportData?: boolean) {
    const params: any = {
      limit: size,
      offset: page,
      exportData: exportData,
    };
    if (segmentId) {
      params.segmentId = segmentId;
    }
    return API.apiClient.get(addQueryParamsToUrl(`/holidays`, params));
  }

  delete(id: number) {
    return API.apiClient.delete(`/holidays/${id}`);
  }

  create(payload: IHoliday) {
    return API.apiClient.post(`/holidays`, payload);
  }

  getSegmentsForDropDown() {
    return API.apiClient.get(`/segments/for/dropdown`);
  }
}

export default new HolidayService();
