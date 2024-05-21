import { moderateScale } from "@common/constants";
import EHeader from "@commonComponents/EHeader";
import ELoader from "@commonComponents/ELoader";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import BankAccount from "@components/models/BankAccount";
import DeleteModal from "@components/models/DeleteModal";
import bankAccountsService from "@services/bankAccounts.service";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Image, RefreshControl } from "react-native";
import { FlatList, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import IconDelete from "@assets/svgs/IconDelete";
import IconEdit from "@assets/svgs/IconEdit";
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
interface ICashEntryForm {
  accountType: string;
  accountHolderName: string;
  upiAddress: string;
  bankName: string;
  ifscCode: string;
  accountNumber: string;
}
const BackAccount = () => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [bankAccount, setBankAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editBankAccountData, setEditBankAccountData] =
    useState<IBankAccountListData | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const [deleteItem, setDeleteItem] = useState<any | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [bankAccountData, setBankAccountData] = useState<
    IBankAccountListData[]
  >([]);

  useEffect(() => {
    if (editBankAccountData) {
      setBankAccount(true);
    }
  }, [editBankAccountData]);

  const refreshData = () => {
    setLoading(true);
    bankAccountsService
      .getBankAccounts()
      .then((res: IResponseBankAccountListData | any) => {
        if (res.data.statusCode === 200) {
          setBankAccountData(res.data.data.rows);
          setLoading(false);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (editId) {
      setEditLoading(true);
      bankAccountsService
        .getBankAccountById(editId)
        .then((res: IResponseBankAccountListData | any) => {
          setEditLoading(false);
          if (res.data.statusCode === 200) {
            setEditBankAccountData(res.data.data);
          }
        })
        .catch(() => {
          setEditLoading(false);
        });
    }
  }, [editId]);

  const handleDelete = () => {
    bankAccountsService.deleteBankAccount(deleteItem).then((res: any) => {
      Toast.show({ type: "success", text1: res.data.message });
      refreshData();
    });
    setDeleteItem(null);
    setDeleteModal(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor1 }}>
      <EHeader
        title="Bank Account"
        rightIcon={
          <TouchableOpacity
            style={{
              backgroundColor: current.primary,
              borderRadius: 6,
              paddingHorizontal: 5,
              paddingVertical: 5,
            }}
            onPress={() => setBankAccount(true)}
          >
            <EText color={current.white} type="m14">
              + Add
            </EText>
          </TouchableOpacity>
        }
      />
      <View
        style={{
          flex: 1,
          backgroundColor: current.backgroundColor,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}
      >
        {loading ? (
          <ELoader loading={true} size="medium" mode={"fullscreen"} />
        ) : (
          <FlatList
            data={bankAccountData}
            keyExtractor={(item, index) => `${item?.id}_${index}`}
            renderItem={({ item }: any) => {
              const deleteClick = () => {
                setDeleteModal(true);
                setDeleteItem(item?.id);
              };
              return (
                <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                  {item?.accountType === "qrCode" && (
                    <View
                      style={{
                        flex: 1,
                        borderRadius: 6,
                        borderColor: current.bcolor,
                        borderWidth: 1,
                        padding: 10,
                      }}
                    >
                      <View
                        style={{
                          borderBottomWidth: 1,
                          borderColor: current.bcolor,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 3,
                          padding: 5,
                        }}
                      >
                        <EText type="m14" color={current.textColor}>
                          {item?.accountType.toUpperCase()}
                        </EText>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                          <TouchableOpacity
                            onPress={() => {
                              setEditId(item.id);
                            }}
                          >
                            <IconEdit color={current.blue} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={deleteClick}>
                            <IconDelete color={current.red} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={{ alignItems: "center" }}>
                        <Image
                          source={{ uri: item?.qrCode }}
                          style={{
                            height: moderateScale(200),
                            width: moderateScale(200),
                          }}
                          resizeMode="contain"
                        />
                      </View>
                    </View>
                  )}
                  {item?.accountType === "bank" && (
                    <View
                      style={{
                        flex: 1,

                        borderRadius: 6,
                        borderColor: current.bcolor,
                        borderWidth: 1,
                        padding: 10,
                      }}
                    >
                      <View
                        style={{
                          borderBottomWidth: 1,
                          borderColor: current.bcolor,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 3,
                          padding: 5,
                        }}
                      >
                        <EText type="m14">
                          {item?.accountType.toUpperCase()}
                        </EText>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                          <TouchableOpacity
                            onPress={() => {
                              setEditId(item.id);
                            }}
                          >
                            <IconEdit color={current.blue} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={deleteClick}>
                            <IconDelete color={current.red} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={{ flexDirection: "row", padding: 5 }}>
                        <View style={{ flex: 1, gap: 5 }}>
                          <EText>{"A/C Holder"}</EText>
                          <EText>{"Bank Name"}</EText>
                          <EText>{"A/C No."}</EText>
                          <EText>{"IFSC Code"}</EText>
                        </View>
                        <View
                          style={{ flex: 1, gap: 5, alignItems: "flex-end" }}
                        >
                          <EText>{item?.accountHolderName}</EText>
                          <EText>{item?.accountType}</EText>
                          <EText>{item?.accountNumber}</EText>
                          <EText>{item?.ifscCode}</EText>
                        </View>
                      </View>
                    </View>
                  )}
                  {item?.accountType === "upiId" && (
                    <View
                      style={{
                        flex: 1,
                        borderRadius: 6,
                        borderColor: current.bcolor,
                        borderWidth: 1,
                        padding: 10,
                      }}
                    >
                      <View
                        style={{
                          borderBottomWidth: 1,
                          borderColor: current.bcolor,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 3,
                          padding: 5,
                        }}
                      >
                        <EText type="m14">
                          {item?.accountType.toUpperCase()}
                        </EText>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                          <TouchableOpacity
                            onPress={() => {
                              setEditId(item.id);
                            }}
                          >
                            <IconEdit color={current.blue} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={deleteClick}>
                            <IconDelete color={current.red} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={{ flexDirection: "row", padding: 5 }}>
                        <View style={{ flex: 1, gap: 5 }}>
                          <EText>{"Upi"}</EText>
                        </View>
                        <View
                          style={{ flex: 1, gap: 5, alignItems: "flex-end" }}
                        >
                          <EText>{item?.upiAddress}</EText>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              );
            }}
            ListEmptyComponent={ListEmptyComponent}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => {
                  setLoading(true);
                  bankAccountsService
                    .getBankAccounts()
                    .then((res: IResponseBankAccountListData | any) => {
                      if (res.data.statusCode === 200) {
                        setBankAccountData(res.data.data.rows);
                      }
                    });
                  setLoading(false);
                }}
              />
            }
          />
        )}
      </View>

      <DeleteModal
        onPress={() => handleDelete(deleteItem)}
        visible={deleteModal}
        title="Delete"
        deleteLabel="Bank Account?"
        onBackdropPress={() => setDeleteModal(false)}
        onDismiss={() => setDeleteModal(false)}
      />

      {bankAccount ? (
        <BankAccount
          visible={bankAccount}
          onDismiss={() => {
            setBankAccount(false);
            setEditId(null);
            setEditBankAccountData(null);
          }}
          defaultValue={editBankAccountData}
          onSuccess={refreshData}
        />
      ) : null}
    </View>
  );
};
export default BackAccount;
