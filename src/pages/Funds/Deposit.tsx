import { ActionButton } from "@commonComponents/ActionButtons";
import { ApproveRejectChip } from "@commonComponents/ApproveRejectChip";
import ApproveRejectModal from "@commonComponents/ApproveRejectModal";
import EHeader from "@commonComponents/EHeader";
import EListLayout from "@commonComponents/EListLayout";
import ELoader from "@commonComponents/ELoader";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
import ValueLabelComponent from "@commonComponents/ValueLabelComponent";
import AddFundDepositModal from "@components/models/AddFundDeposit";
import { SCREENS } from "@navigation/NavigationKeys";
import bankAccountsService from "@services/bankAccounts.service";
import payInPayoutService from "@services/payInPayout.service";
import { useAppSelector } from "@store/index";
import { authSelector } from "@store/reducers/auth.reducer";
import { themeSelector } from "@store/reducers/theme.reducer";
import { date, dateFormat } from "@utils/constant";
import { formatIndianAmount } from "@utils/helpers";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useQuery } from "react-query";

interface IBankAccountListData {
  id: number;
  userId: number;
  accountNumber: string;
  accountHolderName?: string;
  bankName: string;
  ifscCode: string;
  upiAddress: null;
  accountType: string;
  qrCode: null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  user: User;
}
interface User {
  name: string;
}
interface IResponseBankAccountListData {
  statusCode: number;
  message: string;
  data: Data;
}
interface Data {
  count: number;
  rows: IBankAccountListData[];
}
const Deposit = (props: any) => {
  const size = 10;
  const [page, setPage] = useState(1);
  const [rowData, setRowData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [fetchMoreLoading, setFetchMoreLoading] = useState(true);
  const [bankAccountData, setBankAccountData] = useState<
    IBankAccountListData[]
  >([]);
  const [deposit, setDeposit] = useState<IBankAccountListData[]>([]);
  const [approved, setApproved] = useState(false);
  const [approve, setApprove] = useState<any | null>(null);
  const [reject, setReject] = useState<any | null>(null);
  const [rejected, setRejected] = useState(false);
  const userData = useAppSelector((state) => authSelector(state, "userData"));
  const [filteredData, setFilteredData] = useState<any>({});
  const [addFundModal, setAddFundModal] = useState(false);
  const current = useAppSelector((state) => themeSelector(state, "current"));

  const onCallFilter = async (filterData: any) => {
    setFilteredData(filterData);
  };

  const { data, isLoading, error } = useQuery(
    ["deposit", page, size, filteredData, refresh],
    async () => {
      return await payInPayoutService.getPayInPayOutList(
        "deposit",
        filteredData
      );
    }
  );
  useEffect(() => {
    bankAccountsService
      .getBankAccounts()
      .then((res: IResponseBankAccountListData | any) => {
        if (res.data.statusCode === 200) {
          setBankAccountData(res.data.data.rows);
        }
      });
  }, []);

  React.useEffect(() => {
    if (!isLoading && !error && data?.data?.data?.rows) {
      if (page === 1) {
        setRowData(data.data.data.rows);
      } else {
        setRowData((prevData) => [...prevData, ...data.data.data.rows]);
      }
    }
  }, [data, isLoading, error, page]);

  useEffect(() => {
    if (isLoading) {
      if (page > 1) {
        setFetchMoreLoading(true);
      } else {
        setLoading(true);
      }
    } else {
      setFetchMoreLoading(false);
      setLoading(false);
    }
  }, [isLoading]);

  const onRefresh = () => {
    setPage(1);
    setRefresh((prev) => !prev);
  };

  const fetchMoreData = () => {
    if (!isLoading && !error && data?.data?.data?.count > page * size) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const onView = (item: any) => {
    if (deposit && deposit.id === item.id) {
      setDeposit(null);
    } else {
      setDeposit(item);
    }
  };

  const handleApproved = async (item: any) => {
    setLoadingBtn(true);
    await payInPayoutService.paymentApprovedById(item.id).then((res) => {
      if (res.data.statusCode === 200) {
        Toast.show({ type: "success", text1: res.data.message });
        setApproved(false);
        onRefresh();
      } else {
        // console.log("------error", error);
      }
    });
    setLoadingBtn(false);
  };

  const handleRejected = async (item: any, rejectedRemark: string) => {
    setLoadingBtn(true);
    await payInPayoutService
      .paymentRejectById(item.id, { rejectedRemark })
      .then((res) => {
        if (res.data.statusCode === 200) {
          Toast.show({ type: "success", text1: res.data.message });
          setRejected(false);
          onRefresh();
        } else {
          // console.log("------error", error);
        }
      });
    setLoadingBtn(false);
  };

  const renderItem = ({ item }: any) => {
    return (
      <>
        <TouchableOpacity
          style={{
            backgroundColor: current.backgroundColor,
            padding: 10,
            borderBottomWidth: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            borderColor: current.bcolor,
          }}
          onPress={() => onView(item)}
        >
          <View style={{ flex: 1, gap: 5 }}>
            <EText type="m16" style={{ textTransform: "capitalize" }}>
              {item?.bankAccount?.accountType}
            </EText>
            <EText
              type="m14"
              style={{ textTransform: "capitalize", color: current.greyText }}
            >
              {item?.status}
            </EText>
          </View>

          <View style={{ alignItems: "flex-end", flex: 1, gap: 5 }}>
            <EText type="m16" style={{ color: current.textColor }}>
              {formatIndianAmount(item?.amount)}
            </EText>
            <ApproveRejectChip isApproved={item?.isApproved} />
          </View>
        </TouchableOpacity>
        {/* {deposit === item && (
          <View
            style={{
              backgroundColor: current.backgroundColor,
              padding: 8,
              borderBottomWidth: 1,
              borderColor:
                current.value === "dark" ? current.bcolor : current.bcolor,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1, gap: 5 }}>
                {userData?.role?.slug === "superadmin" && (
                  <>
                    <EText type="r14">{"Admin"}</EText>
                    <EText type="r14">{"Master"}</EText>
                  </>
                )}
                <EText type="r14">{"Client"}</EText>
                <EText type="r14">{"Create Date"}</EText>
                <EText type="r14">{"Payment Method"}</EText>
                <EText type="r14">{"Payment Date"}</EText>
                <EText type="r14">{"UTR Number"}</EText>
                <EText type="r14">{"Attachment"}</EText>
                <EText type="r14">{"Amount"}</EText>
                <EText type="r14">{"Approval Date"}</EText>
                <EText type="r14">{"Status"}</EText>
                <EText type="r14">{"Payment Status"}</EText>
              </View>
              <View style={{ gap: 5, alignItems: "flex-end" }}>
                {userData?.role?.slug === "superadmin" && (
                  <>
                    <EText type="r14">{item?.adminName}</EText>
                    <EText type="r14">{item?.masterName}</EText>
                  </>
                )}
                <EText type="r14">{deposit?.user?.name}</EText>
                <EText type="r14">
                  {moment(deposit?.createdAt).format(dateFormat)}
                </EText>
                <EText type="r14">{deposit?.bankAccount?.accountType}</EText>
                <EText type="r14">
                  {moment(deposit?.paymentDate).format(dateFormat)}
                </EText>
                <EText type="r14">{deposit?.transactionId}</EText>
                <TouchableOpacity
                  style={{
                    backgroundColor: current.primary,
                    borderRadius: 6,
                    paddingHorizontal: 5,
                  }}
                  onPress={() =>
                    props.navigation.navigate(SCREENS.ImageShow, {
                      id: deposit?.id,
                      type: "deposit",
                    })
                  }
                >
                  <EText type="r12" color={current.white}>
                    {"View"}
                  </EText>
                </TouchableOpacity>

                <EText type="r14">{formatIndianAmount(deposit?.amount)}</EText>
                <EText type="r14">
                  {deposit?.approvedDateTime
                    ? moment(deposit?.approvedDateTime).format(dateFormat)
                    : "-"}
                </EText>
                <EText type="r14" style={{ textTransform: "capitalize" }}>
                  {deposit?.isApproved}
                </EText>
                <EText type="r14" style={{ textTransform: "capitalize" }}>
                  {deposit?.status}
                </EText>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <EText type="r14">{"Remark"}</EText>
              <EText type="r14">
                {deposit?.remarks ? deposit?.remarks : "-"}
              </EText>
            </View>
            {deposit?.rejectedRemark ? (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <EText type="r14">{"Rejection Reason"}</EText>
                <EText type="r14">{deposit?.rejectedRemark}</EText>
              </View>
            ) : null}
            {["admin", "superadmin"].includes(userData?.role.slug) &&
              deposit.isApproved === "pending" && (
                <Fragment>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: 8,
                      marginVertical: 8,
                    }}
                  >
                    <EText type="r14">{"Approve"}</EText>

                    <TouchableOpacity
                      onPress={() => {
                        setApproved(true);
                        setApprove(deposit);
                      }}
                    >
                      <AntDesign
                        name={"checkcircleo"}
                        color={current.green}
                        size={18}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <EText type="r14">{"Reject"}</EText>
                    <TouchableOpacity
                      onPress={() => {
                        setRejected(true);
                        setReject(deposit);
                      }}
                    >
                      <AntDesign
                        name={"closecircleo"}
                        color={current.red}
                        size={18}
                      />
                    </TouchableOpacity>
                  </View>
                </Fragment>
              )}
          </View>
        )} */}
        {deposit === item && (
          <View
            style={{
              padding: 10,
              alignItems: "center",
              borderBottomWidth: 1,
              borderColor:
                current.value === "dark"
                  ? current.backgroundColor
                  : current.bcolor,
            }}
          >
            <ValueLabelComponent
              fields={[
                {
                  label: "Admin",
                  value: item?.adminName ? item?.adminName : "-",
                  access: {
                    superadmin: true,
                    admin: false,
                    master: false,
                    user: false,
                    broker: false,
                  },
                },
                {
                  label: "MASTER",
                  value: item?.masterName ? item?.masterName : "-",
                  access: {
                    superadmin: true,
                    admin: true,
                    master: false,
                    user: false,
                    broker: false,
                  },
                },

                {
                  label: "CLIENT",
                  value: item?.user?.name ? `${item?.user?.name}` : "-",
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: false,
                    broker: false,
                  },
                },
                {
                  label: "Date",
                  value: item?.createdAt
                    ? moment(item?.createdAt).format(dateFormat)
                    : "-",
                },
                {
                  label: "Payment Method",
                  value: item?.bankAccount?.accountType,
                  textTransform: "capitalize",
                },
                {
                  label: "Payment Date",
                  value: item?.paymentDate
                    ? moment(item?.paymentDate).format(date)
                    : "-",
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: true,
                    broker: true,
                  },
                },
                {
                  label: "UTR Number",
                  value: item?.transactionId ? item?.transactionId : "-",
                  textTransform: "capitalize",
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: true,
                    broker: true,
                  },
                },
                {
                  label: "Amount",
                  value: item?.amount ? item?.amount : "-",
                  withComma: true,
                },
                {
                  label: "Approved Date",
                  value: item?.approvedDateTime
                    ? moment(item?.approvedDateTime).format(dateFormat)
                    : "-",
                },
                {
                  label: "Status",
                  value: item?.isApproved ? item?.isApproved : "-",
                  isStatus: true,
                },
                {
                  label: "Payment Status",
                  value: item?.status ? item?.status : "-",
                  isStatus: true,
                },
                {
                  label: "Remarks",
                  value: item?.remarks ? item?.remarks : "-",
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: true,
                    broker: true,
                  },
                },
                {
                  label: "Rejected Remarks",
                  value: item?.rejectedRemark ? item?.rejectedRemark : "-",
                },
              ]}
            />
            <ActionButton
              view={"view"}
              viewClick={() =>
                props.navigation.navigate(SCREENS.ImageShow, {
                  id: deposit?.id,
                  type: "deposit",
                })
              }
              viewLabel="Attachment"
              reject={"reject"}
              approve={"approve"}
              approved={() => {
                setApproved(true);
                setApprove(deposit);
              }}
              rejected={() => {
                setRejected(true);
                setReject(deposit);
              }}
              user={userData?.role?.slug}
              isApproved={deposit?.isApproved}
            />
          </View>
        )}
      </>
    );
  };

  const filterControls = useMemo(() => {
    return [
      {
        label: "Admin",
        name: "adminId",
        type: "select",
        clearable: true,
        access: {
          superadmin: true,
          admin: false,
          master: false,
          user: false,
          broker: false,
        },
      },
      {
        label: "Master",
        name: "masterId",
        type: "select",
        clearable: true,
        access: {
          superadmin: true,
          admin: true,
          master: false,
          user: false,
          broker: false,
        },
      },
      {
        label: "Client",
        name: "userId",
        type: "select",
        clearable: true,
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: false,
          broker: false,
        },
      },
      {
        label: "Status",
        name: "approvedStatus",
        type: "select",
        clearable: true,
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: true,
          broker: true,
        },
      },
      {
        label: "Payment Status",
        name: "paymentStatus",
        type: "select",
        clearable: true,
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: true,
          broker: true,
        },
      },
      {
        label: "Payment Method",
        name: "paymentMethod",
        type: "select",
        clearable: true,
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: true,
          broker: true,
        },
      },
      {
        label: "Start Date :",
        name: "startDate",
        type: "date",
        maximumDate: new Date(),
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: true,
          broker: true,
        },
      },
      {
        label: "End Date :",
        name: "endDate",
        type: "date",
        maximumDate: new Date(),
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: true,
          broker: true,
        },
      },
    ];
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor1 }}>
      {props.hideHeader !== true && <EHeader title="Deposit" />}
      <EListLayout
        addButtonLabel="Add Fund"
        config={filterControls}
        defaultValue={filteredData}
        handleChangeFilter={setFilteredData}
        setPage={setPage}
        {...(userData?.role?.slug === "user" && {
          onAddNew: () => setAddFundModal(true),
        })}
      >
        {loading ? (
          <ELoader loading={true} size="medium" mode={"fullscreen"} />
        ) : (
          <FlatList
            data={rowData}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            onEndReached={fetchMoreData}
            onEndReachedThreshold={0.1}
            ListEmptyComponent={ListEmptyComponent}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
            }
            ListFooterComponentStyle={
              fetchMoreLoading ? { alignItems: "center", padding: 10 } : null
            }
            ListFooterComponent={
              <RenderFooter isFetchingMore={fetchMoreLoading} />
            }
          />
        )}
      </EListLayout>
      <AddFundDepositModal
        visible={addFundModal}
        onDismiss={() => setAddFundModal(false)}
        bankAccountData={bankAccountData}
        onSuccess={onRefresh}
      />
      <ApproveRejectModal
        onPress={() => handleApproved(approve)}
        visible={approved}
        title="Approved"
        message="Are you sure you want to Approve?"
        onDismiss={() => setApproved(false)}
        confirmLoading={loadingBtn}
      />
      <ApproveRejectModal
        onPress={(remark: string) => handleRejected(reject, remark)}
        visible={rejected}
        title="Reject"
        withRemarks={true}
        message="Are you sure you want to Reject?"
        onDismiss={() => setRejected(false)}
        confirmLoading={loadingBtn}
      />
    </View>
  );
};
export default Deposit;
