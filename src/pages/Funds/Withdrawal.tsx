import { ActionButton } from "@commonComponents/ActionButtons";
import { ApproveRejectChip } from "@commonComponents/ApproveRejectChip";
import ApproveRejectModal from "@commonComponents/ApproveRejectModal";
import EHeader from "@commonComponents/EHeader";
import EListLayout from "@commonComponents/EListLayout";
import ELoader from "@commonComponents/ELoader";
import EText from "@commonComponents/EText";
import ImageModal from "@commonComponents/ImageModal";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
import ValueLabelComponent from "@commonComponents/ValueLabelComponent";
import AddWithdrawalModal from "@components/models/AddWithdrawal";
import { SCREENS } from "@navigation/NavigationKeys";
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
interface Data {
  count: number;
  rows: IBankAccountListData[];
}
const Withdrawal = (props: any) => {
  const size = 10;
  const [page, setPage] = useState(1);
  const [rowData, setRowData] = useState<IBankAccountListData[]>([]);
  const [approve, setApprove] = useState<any | null>(null);
  const [reject, setReject] = useState<any | null>(null);
  const [rejected, setRejected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [withdraw, setWithdraw] = useState<IBankAccountListData | null>(null);
  const [filteredData, setFilteredData] = useState<any>({});
  const [image, setImage] = useState({});
  const [imageModal, setImageModal] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [fetchMoreLoading, setFetchMoreLoading] = useState(true);
  const [errors, setError] = useState<string>("");

  const [addFundModal, setAddFundModal] = useState(false);
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const userData = useAppSelector((state) => authSelector(state, "userData"));

  const { data, isLoading, error } = useQuery(
    ["withdrawal", page, size, filteredData, refresh],
    async () => {
      return await payInPayoutService.getPayInPayOutList(
        "withdrawal",
        filteredData
      );
    }
  );

  const onRefresh = () => {
    setPage(1);
    setRefresh((prev) => !prev);
  };

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

  React.useEffect(() => {
    if (!isLoading && !error && data?.data?.data?.rows) {
      if (page === 1) {
        setRowData(data.data.data.rows);
      } else {
        setRowData((prevData) => [...prevData, ...data.data.data.rows]);
      }
    }
  }, [data, isLoading, error, page]);

  const fetchMoreData = () => {
    if (!isLoading && !error && data?.data?.data?.count > page * size) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  const handleApproved = async (item: any, formData: any) => {
    if (!image.base64) {
      setError("Attachment is required");
      return;
    }
    const payload = {
      withdrawalProof: `data:image/png;base64,${image?.base64}`,
      transactionId: formData.transactionId,
      paymentDate: formData.paymentDate
        ? moment(formData.paymentDate).format("YYYY-MM-DD")
        : undefined,
    };
    setLoadingBtn(true);
    await payInPayoutService
      .paymentApprovedById(item.id, payload)
      .then((res) => {
        if (res.data.statusCode === 200) {
          Toast.show({ type: "success", text1: res.data.message });
          setImage({});
          setImageModal(false);
          onRefresh();
        } else {
          console.log("------error", error);
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
          console.log("------error", error);
        }
      });
    setLoadingBtn(false);
  };
  const onView = (item: any) => {
    if (withdraw && withdraw.id === item.id) {
      setWithdraw(null);
    } else {
      setWithdraw(item);
    }
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
              {item?.withdrawalType}
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
        {withdraw?.id === item?.id && (
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
                  value: item?.withdrawalType,
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: true,
                    broker: true,
                  },
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
                  label: "Amount",
                  value: item?.amount ? item?.amount : "-",
                  withComma: true,
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
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: true,
                    broker: true,
                  },
                },
                {
                  label: "Approved Date",
                  value: item?.approvedDateTime
                    ? moment(item?.approvedDateTime).format(date)
                    : "-",
                },
                {
                  label: "Status",
                  value: item?.isApproved,
                  isStatus: true,
                },
                {
                  label: "Payment Status",
                  value: item?.status,
                  isStatus: true,
                },
                {
                  label: "Remarks",
                  value: item?.remarks ? item?.remarks : "-",
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
                  id: item?.id,
                  type: "withdraw",
                })
              }
              reject={"reject"}
              approve={"approve"}
              approved={() => {
                setImageModal(true);
                setApprove(item);
              }}
              rejected={() => {
                setRejected(true);
                setReject(item);
              }}
              user={userData?.role?.slug}
              isApproved={item?.isApproved}
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
        label: "Payment Method",
        name: "withdrawalType",
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
      {props.hideHeader !== true && <EHeader title="Withdrawal" />}
      <EListLayout
        addButtonLabel="Withdraw Fund"
        config={filterControls}
        defaultValue={filteredData}
        handleChangeFilter={setFilteredData}
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
            onEndReachedThreshold={0.3}
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

      <AddWithdrawalModal
        visible={addFundModal}
        onDismiss={() => setAddFundModal(false)}
        onSuccess={onRefresh}
      />
      {/* <ApproveRejectModal
          onPress={() => handleApproved(approve)}
          visible={approved}
          title="Approved"
          message="Are you sure you want to Approve?"
          onDismiss={() => setApproved(false)}
        /> */}
      <ApproveRejectModal
        onPress={(remark: string) => handleRejected(reject, remark)}
        visible={rejected}
        title="Reject"
        withRemarks={true}
        message="Are you sure you want to Reject?"
        onDismiss={() => setRejected(false)}
        confirmLoading={loadingBtn}
      />

      <ImageModal
        onPress={(formData) => handleApproved(approve, formData)}
        title={"Attachments"}
        setImage={setImage}
        confirmLoading={loadingBtn}
        errors={errors}
        image={image}
        visible={imageModal}
        onDismiss={() => {
          setImageModal(false), setImage({});
        }}
      />
    </View>
  );
};
export default Withdrawal;
