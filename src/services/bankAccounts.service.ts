import API from '@plugins/api.plugin';

interface ICreatBankAccount {
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  paymentType: string;
}

interface IUpdateBankAccountPayload extends ICreatBankAccount {
  id: string;
}

class BankAccountsService {
  createBankAccount(payload: ICreatBankAccount) {

    return API.apiClient.post(`/bank-accounts`, payload);
  }
  updateBankAccount(payload: IUpdateBankAccountPayload) {
    return API.apiClient.put(`/bank-accounts/${payload.id}`, payload);
  }
  deleteBankAccount(accountId: number) {
    return API.apiClient.delete(`/bank-accounts/${accountId}`);
  }

  getBankAccounts() {
    return API.apiClient.get(`/bank-accounts`);
  }
  getBankAccountById(accountId: number) {
    return API.apiClient.get(`/bank-accounts/${accountId}`);
  }
}
// eslint-disable-next-line
export default new BankAccountsService();
