import API from '@plugins/api.plugin';
import moment from 'moment';

interface ICreatPayInPayOut {
  amount: number;
  type: string;
  status: string;
  bankAccountId?: number;
  withdrawalType?: string | undefined;
  accountNumber?: string;
  accountHolderName?: string;
  bankName?: string;
  ifscCode?: string;
  upiAddress?: string;
}

interface IUpdateBankAccountPayload extends ICreatPayInPayOut {
  id: string;
}

class PayInPayOutService {
  createPayments(payload: ICreatPayInPayOut) {
    return API.apiClient.post(`/payments`, payload);
  }
  updateBankAccount(payload: IUpdateBankAccountPayload) {
    return API.apiClient.put(`/payments/${payload.id}`, payload);
  }
  paymentApprovedById(
    approveId: number,
    payload?: { withdrawalProof: string },
  ) {
    return API.apiClient.put(`/payments/approve/${approveId}`, payload);
  }
  paymentRejectById(rejectId: number, payload?: { rejectedRemark?: string }) {
    return API.apiClient.put(`/payments/reject/${rejectId}`, payload);
  }
  deleteBankAccount(accountId: number) {
    return API.apiClient.delete(`/payments/${accountId}`);
  }

  getPayInPayOutList(type: string, payloadData?: any) {
    const userId =
      payloadData?.userId ?? payloadData?.masterId ?? payloadData?.adminId;
    let path = `/payments/${type}`;
    if (userId > 0) path += `/${Number(userId)}/`;

    return API.apiClient.get(path, {
      params: {
        approvedStatus: payloadData?.approvedStatus,
        startDate: payloadData?.startDate
          ? moment(payloadData?.startDate).format('YYYY-MM-DD')
          : undefined,
        endDate: payloadData?.endDate
          ? moment(payloadData?.endDate).format('YYYY-MM-DD')
          : undefined,
        paymentStatus: payloadData?.paymentStatus,
        paymentMethod: payloadData?.paymentMethod,
        withdrawalType: payloadData?.withdrawalType,
      },
    });
  }
  getBankAccountById(accountId: number) {
    return API.apiClient.get(`/payments/${accountId}`);
  }
  getPaymentAttachmentById(paymentId: number) {
    return API.apiClient.get(`/payments/pop/${paymentId}`);
  }
  getPaymentAttachmentByWpId(wpId: number) {
    return API.apiClient.get(`/payments/wp/${wpId}`);
  }
}
// eslint-disable-next-line
export default new PayInPayOutService();
