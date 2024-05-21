export interface IConfig {
  baseUrl: string;
  socketUrl: string;
}
const config: IConfig = {
  baseUrl: "https://api.trade-future.com/api/v1",
  socketUrl: "https://api.trade-future.com",
};
export default config;
