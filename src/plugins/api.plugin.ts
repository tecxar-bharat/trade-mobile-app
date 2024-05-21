import axios, { AxiosInstance } from 'axios';
import config from '@config/index';
import store from '@store/index';
import { logOutFromApi } from '@reducers/auth.reducer';
import { LoggedUser } from '@db/schemas/loggedUser.model';
class APIClient {
  public apiClient!: AxiosInstance;

  public constructor() {
    this.assign(config.baseUrl);
  }

  private assign = async (BASE_URL: string) => {
    this.apiClient = axios.create({
      baseURL: BASE_URL,
      withCredentials: false,
    });

    this.apiClient.interceptors.request.use(
      configuration => {
        const currentUser = LoggedUser.getActiveUser(globalThis.realm);
        // configuration.headers.set(
        //   'User-agent',
        //   `bluesharkApp/${this.appVersion}${Platform.OS}${this.systemVersion}`,
        //   true,
        // );

        if (
          configuration.url?.indexOf('/login') !== -1 ||
          this.apiClient.defaults.headers.common.Authorization !== undefined
        ) {
          return configuration;
        }
        /** In dev, intercepts request and logs it into console for dev */
        // configuration.headers?.common?['Content-Type'] = 'application/json';

        if (currentUser) {
          configuration.headers.set('Cookie', currentUser.Cookie, true);
        }
        return configuration;
      },
      error => {
        return Promise.reject(error);
      },
    );

    this.apiClient.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        console.log(
          '------------------->',

          error,
        );

        console.log(
          '------------------->',

          error.response.status,
          error.response.config.url,
        );
        if (
          error.response.status === 403 &&
          error.response.config.url !== '/auth/whoami'
        ) {
          await store.dispatch(logOutFromApi({}));
        } else {
          return error;
        }
      },
    );
  };
}

export default new APIClient();
