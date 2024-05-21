import API from '@plugins/api.plugin';
class CommonService {
  getSegmentsDataById(id: number) {
    return API.apiClient.get(`/segments/${id}`);
  }
  getAllScripts() {
    return API.apiClient.get(`/scripts?fetchType=dropdown`);
  }
  getAdminNameList() {
    return API.apiClient.get(`/users?fetchType=dropdown&role=admin`);
  }
  getMasterNameList(userId?: number | null) {
    return API.apiClient.get(
      `/users?fetchType=dropdown&role=master&${
        userId !== undefined && `userId=${userId}`
      }`,
    );
  }
  getUserNameList(userId?: number | null) {
    return API.apiClient.get(
      `/users?fetchType=dropdown&role=user&${
        userId !== undefined && `userId=${userId}`
      }`,
    );
  }
  getBrokerNameList(userId?: number | null) {
    return API.apiClient.get(
      `/users?fetchType=dropdown&role=broker&${
        userId !== undefined && `userId=${userId}`
      }`,
    );
  }
  getuserNseFormScripts() {
    return API.apiClient.get(`/scripts/userNseFormScripts`);
  }
  getuserNseFormLotScripts() {
    return API.apiClient.get(`/scripts/userNseFormScripts`);
  }
  getuserNSEOoptionsScripts() {
    return API.apiClient.get(`/scripts/userNseFormScripts`);
  }
  getuserMcxFormScripts() {
    return API.apiClient.get(`/scripts/userMcxFormScripts`);
  }
  getuserMcxFormScriptsOthers() {
    return API.apiClient.get(`/scripts/userMcxFormScriptsOthers`);
  }
  getUserBrokerNameList(userId?: number | null) {
    return API.apiClient.get(
      `/users?fetchType=dropdown&userBroker=userBroker&${
        userId !== undefined && `userId=${userId}`
      }`,
    );
  }
  getUserAccountTypes(parentId: number) {
    return API.apiClient.get(`/users/groups/qty/${parentId}`);
  }
  getMasterAccountTypes() {
    return API.apiClient.get(`/groups/qty`);
  }
  getBlockScriptsofUsers(
    page?: number,
    size?: number,
    userId?: any,
    scriptId?: any,
    segmentId?: any,
  ) {
    const params: {
      limit?: number;
      offset?: number;
      userId?: any;
      scriptId?: any;
      segmentId?: any;
    } = {
      limit: size,
      offset: page,
    };
    if (userId) {
      params.userId = userId;
    }
    if (scriptId) {
      params.scriptId = scriptId;
    }
    if (segmentId) {
      params.segmentId = segmentId;
    }
    return API.apiClient.get(
      `/scripts/view/scripts/block?limit=${size}&offset=${page}`,
    );
  }
  getBlockScripts(page?: number, size?: number) {
    return API.apiClient.get(
      `scripts/block/user/?limit=${size}&offset=${page}`,
    );
  }
  createBlockScripts(payload: any) {
    return API.apiClient.post(`/scripts/block`, payload);
  }
  deleteBlockScriptById(id: number) {
    return API.apiClient.delete(`/scripts/block/${id}`);
  }
}
export default new CommonService();
