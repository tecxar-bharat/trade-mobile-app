import API from '@plugins/api.plugin';

class AnnouncementService {
  createAnnouncement(payload: any) {
    return API.apiClient.post(`/announcements`, payload);
  }

  getAnnouncements() {
    return API.apiClient.get(`/announcements`);
  }
  getAnnouncementsByCategory(category: string) {
    return API.apiClient.get(`/announcements/category/${category}`);
  }

  updateAnnouncementById(id: number, payload: any) {
    return API.apiClient.put(`/announcements/${id}`, payload);
  }

  deleteAnnouncementById(id: number) {
    return API.apiClient.delete(`/announcements/${id}`);
  }
}

export default new AnnouncementService();
