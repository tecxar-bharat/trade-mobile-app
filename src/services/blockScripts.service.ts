import API from '@plugins/api.plugin';
import { addQueryParamsToUrl } from '@utils/helpers';

class BlockScriptsService {
  createBlockScriptGroup(payload: any) {
    return API.apiClient.post(`/groups`, payload);
  }

  getBlockScriptsGroup(page?: number, size?: number, groupType?: string) {
    const params: { limit?: number; offset?: number; groupType?: string } = {
      limit: size,
      offset: page,
      groupType,
    };
    return API.apiClient.get(addQueryParamsToUrl('/groups', params));
  }
  getQuantityScriptsofUsers(
    userId?: any,
    scriptId?: any,
  ) {
    const params: any = {};
    if (userId) {
      params.userId = userId;
    }
    if (scriptId) {
      params.scriptId = scriptId;
    }
    return API.apiClient.get(addQueryParamsToUrl(`/scripts/qtyScripts/user`, params));
  }

  getQuantityScriptsDataByGroupId(groupId: number) {
    const params: { groupId: number } = {
      groupId: groupId,
    };
    return API.apiClient.get(
      addQueryParamsToUrl('/groups/quantityScriptsbymodule', params),
    );
  }
  getBlockScriptsGroupDropDown(
    page?: number,
    size?: number,
    parentId?: number,
    groupType?: string,
  ) {
    const params: {
      limit?: number;
      offset?: number;
      userId?: number;
      fetchType?: string;
      groupType?: string;
    } = {
      limit: size,
      offset: page,
      userId: parentId,
      fetchType: 'dropdown',
      groupType: groupType,
    };
    return API.apiClient.get(addQueryParamsToUrl('/groups', params));
  }

  updateBlockScriptsGroupById(
    groupId: number,
    payload: { name: string; scriptIds: number[] },
  ) {
    return API.apiClient.put(`/groups/${groupId}`, payload);
  }

  deleteBlockScriptsGroupById(groupId: number) {
    return API.apiClient.delete(`/groups/${groupId}`);
  }

  getTradeLogs(
    userId?: number,
    startDate?: string,
    endDate?: string,
    page?: number,
    size?: number,
  ) {
    const params: any = {
      limit: size,
      offset: page,
    };
    if (userId) {
      params.userId = userId;
    }
    if (startDate) {
      params.startDate = startDate;
    }
    if (endDate) {
      params.endDate = endDate;
    }
    return API.apiClient.get(
      addQueryParamsToUrl(
        userId ? `/tradelogs/${userId}` : `/tradelogs`,
        params,
      ),
    );
  }

  //New Add
  getBlockScriptsGroupById(groupId: number) {
    return API.apiClient.get(`/groups/${groupId}/qty`);
  }
}
export default new BlockScriptsService();
