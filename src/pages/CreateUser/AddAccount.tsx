import IconCopy from "@assets/svgs/IconCopy";
import CloseIcon from "@commonComponents/CloseIcon";
import EButton from "@commonComponents/EButton";
import EHeader from "@commonComponents/EHeader";
import EText from "@commonComponents/EText";
import FormInput from "@fields/FormInput";
import FormSelect from "@fields/FormSelect";
import { ISegmentSummary } from "@interfaces/account.interface";
import { IAdminNameList } from "@interfaces/common";
import { SCREENS } from "@navigation/NavigationKeys";
import Clipboard from "@react-native-community/clipboard";
import { NavigationProp } from "@react-navigation/native";
import accountService from "@services/account.service";
import commonService from "@services/common.service";
import { useAppSelector } from "@store/index";
import { authSelector } from "@store/reducers/auth.reducer";
import { themeSelector } from "@store/reducers/theme.reducer";
import { toNumber } from "@utils/constant";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import AdminForm from "./Admin/AdminForm";
import BrokerForm from "./Broker/BrokerForm";
import MasterForm from "./Master/MasterForm";
import UserForm from "./User/UserForm";

interface IAccountProps {
  title: string;
  type: string;
  role: string;
  userData?: any;
  navigation: NavigationProp<any>;
}

interface INewUser {
  password: string;
  type: "User" | "Broker" | "Master" | "Admin";
  userId: string;
}

interface IUserForm {
  userType: string;
  userId: string;
  adminId: string;
  name: string;
  mobile: string;
  maxMasters: string;
  maxUsers: string;
  editTrade: boolean;
  deleteTrade: boolean;
  manualTrade: boolean;
  maxMarginUserNseFut: null;
  maxLotUserMcx: null;
  maxLotUserNseOption: null;
  parentId: null;
  quantityScriptGroupId: null;
  segment: [];
  nse_fut: any;
  nse_fut_lot: any;
  nseOptions_lots: any;
  Mcx_lots: any;
  orderBetweenHighLow: boolean;
  isLimitAllow: boolean;
  isApplyAutoSquareOff: boolean;
  marginType: string;
  brokerageType: string;
  partnershipPercentage: string;
  brokerage: number | null;
  //extraa fields
  balanceWise: boolean;
  accountType: string;
  marginLimit: string;
  isApplyIntradayAutoSquareOff: boolean;
  onlyPositionSquareOff: boolean;
  isNseOptionSell: boolean;
  deliveryMultiplication: number;
  intradayMultiplication: number;
  intradayMultiplicationNseOpt: number;
  deliveryMultiplicationNseOpt: number;
  nseOptDeliveryMultiplication: number;
  nseOptIntradayMultiplication: number;
  //intraday
  brokeragePercentage: number;
  mcxBrokeragePercentage: number;
  nseOptBrokeragePercentage: number;
  //delivery
  brokeragePercentageDelivery: number;
  mcxBrokeragePercentageDelivery: number;
  nseOptBrokeragePercentageDelivery: number;
  remarks: string;
  brokerId: number;
  quantityGroups: { groupId: number; group: { name: string } };
  //NSE Fut Master
  minBrokerage: number;
  nseMcx: boolean;
  nseFut: boolean;
  nseOpt: boolean;
  //NSE OPt
  nseOptMinLotWiseBrokerage: number;
  //mcx
  minMcxBrokeragePercentage: number;
  minMcxBrokerage: number;
  //user
  otherM2mAlert: string;
  otherM2mPercentage: string;
  maxPositionLimitOpt: string;
  brokerageOpt: string;
  intradayBrokerageOpt: string;
  maxPositionLimitFut: string;
  brokerageFut: string;
  intradayBrokerageFut: string;
  brokerageMcx: string;
  intradayBrokerageMcx: string;
  commissionType: string;
  maxPositionLimitMcx: string;
}

const NewUserModal = ({
  newUser,
  isVisible,
  close,
}: {
  newUser: INewUser | null;
  isVisible: boolean;
  close: () => void;
}) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const copyToClipboard = () => {
    Clipboard.setString(
      `UserId: ${newUser.userId}, Password: ${newUser.password}`
    );
  };
  return (
    <Modal
      onBackdropPress={close}
      onBackButtonPress={close}
      isVisible={isVisible}
      onDismiss={close}
    >
      <View
        style={{
          backgroundColor: current.backgroundColor,
          borderRadius: 12,
          padding: 16,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <EText style={{ color: current.red, fontSize: 18 }}>
            {`${newUser?.type} created with credential`}
          </EText>
          <TouchableOpacity onPress={close}>
            <CloseIcon />
          </TouchableOpacity>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 16,
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <EText type="r14">User Id: </EText>
              <EText type="s16">{newUser?.userId}</EText>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <EText type="r14">Password: </EText>
              <EText type="s16">{newUser?.password}</EText>
            </View>
          </View>
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={copyToClipboard}
          >
            <IconCopy color={current.primary} />
            <EText type="r10" style={{ marginTop: 5 }}>
              Copy
            </EText>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <EButton
            style={{ textAlign: "center", paddingHorizontal: 10 }}
            title={"Okay"}
            height={30}
            onPress={close}
            bgColor={current.primary}
          />
        </View>
      </View>
    </Modal>
  );
};

const AddAccount = (props: IAccountProps) => {
  const [userType, setUserType] = useState(
    props.type === "edit" ? props.role : ""
  );
  const [loading, setLoading] = useState<boolean>(false);
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [nseFut, setNseFut] = useState<boolean>(false);
  const userData = useAppSelector((state) => authSelector(state, "userData"));
  const [mcx, setMcx] = useState<boolean>(false);
  const [nseOption, setNseOption] = useState<boolean>(false);
  const [allAdminNameList, setAllAdminList] = useState<IAdminNameList[]>([]);
  const [allMasterNameList, setAllMasterList] = useState<IAdminNameList[]>([]);
  const [newUser, setNewUser] = useState<INewUser | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    getValues,
  } = useForm<IUserForm>({
    defaultValues: {
      userType: props.userData ? props.role : "",
      userId: props.userData ? props?.userData?.userId : "",
      parentId: props.userData ? props?.userData?.parentId : null,
      brokerId: props.userData
        ? props?.userData?.brokerUsers[0]?.brokerId
        : null,
      mobile: props.userData ? props?.userData?.mobile : null,
      //intraday
      brokeragePercentage: props.userData
        ? props?.userData?.brokerUsers[0]?.brokeragePercentage
        : null,
      mcxBrokeragePercentage: props.userData
        ? props?.userData?.brokerUsers[0]?.mcxBrokeragePercentage
        : null,
      nseOptBrokeragePercentage: props.userData
        ? props?.userData?.brokerUsers[0]?.nseOptBrokeragePercentage
        : null,
      //delivery
      brokeragePercentageDelivery: props.userData
        ? props?.userData?.brokerUsers[0]?.brokeragePercentageDelivery
        : null,
      mcxBrokeragePercentageDelivery: props.userData
        ? props?.userData?.brokerUsers[0]?.mcxBrokeragePercentageDelivery
        : null,
      nseOptBrokeragePercentageDelivery: props.userData
        ? props?.userData?.brokerUsers[0]?.nseOptBrokeragePercentageDelivery
        : null,

      name: props.userData ? props.userData.name : "",
      maxMasters: props.userData ? props.userData.maxMasters : "",
      maxUsers: props.userData ? props.userData.maxUsers : "",
      editTrade: props.userData ? props.userData.editTrade : false,
      deleteTrade: props.userData ? props.userData.deleteTrade : false,
      manualTrade: props.userData ? props.userData.manualTrade : false,
      deliveryMultiplication: props.userData
        ? props.userData.deliveryMultiplication
        : 60,
      intradayMultiplication: props.userData
        ? props.userData.intradayMultiplication
        : 500,
      quantityScriptGroupId: props.userData
        ? props.userData.quantityScriptGroupId
        : null,
      nseOptDeliveryMultiplication: props.userData
        ? props.userData.nseOptDeliveryMultiplication
        : 1,
      nseOptIntradayMultiplication: props.userData
        ? props.userData.nseOptIntradayMultiplication
        : 1,
      intradayMultiplicationNseOpt: props.userData
        ? props.userData.intradayMultiplicationNseOpt
        : 1,
      deliveryMultiplicationNseOpt: props.userData
        ? props.userData.deliveryMultiplicationNseOpt
        : 1,
      minMcxBrokeragePercentage: props.userData
        ? props.userData.minMcxBrokeragePercentage
        : 1,
      minMcxBrokerage: props.userData ? props.userData.minMcxBrokerage : 1,
      partnershipPercentage: props.userData
        ? props.userData?.partnershipPercentage
        : 1,
      otherM2mAlert: props.userData ? props.userData?.otherM2mAlert : 0,
      otherM2mPercentage: props.userData
        ? props.userData?.otherM2mPercentage
        : 90,
      marginLimit: props.userData ? props.userData?.marginLimit : 0,
      //NSE OPt
      nseOptMinLotWiseBrokerage: props.userData
        ? props.userData.nseOptMinLotWiseBrokerage
        : 0,
      remarks: props.userData ? props.userData.remarks : "",
      minBrokerage: props.userData ? props.userData.minBrokerage : 0,
      quantityGroups: props.userData ? props.userData.quantityGroups : [],
      maxMarginUserNseFut: null,
      maxLotUserMcx: null,
      maxLotUserNseOption: null,
      segment: [],
      nse_fut: [],
      orderBetweenHighLow: props.userData
        ? props.userData.orderBetweenHighLow
        : false,
      isLimitAllow: props.userData ? props.userData.isLimitAllow : false,
      isApplyAutoSquareOff: props.userData
        ? props.userData.isApplyAutoSquareOff
        : true,
      marginType: "amount",
      brokerage: 0,
      isApplyIntradayAutoSquareOff: props.userData
        ? props.userData.isApplyIntradayAutoSquareOff
        : false,
      onlyPositionSquareOff: props.userData
        ? props.userData.onlyPositionSquareOff
        : false,
      isNseOptionSell: props.userData ? props.userData.isNseOptionSell : false,
      // user
      nseFut: props.userData ? props.userData.nseFut : false,
      nseOpt: props.userData ? props.userData?.nseOpt : false,
      nseMcx: props.userData ? props.userData?.nseMcx : false,
      maxPositionLimitOpt: props.userData
        ? props.userData.maxPositionLimitOpt === 0
          ? ""
          : props.userData.maxPositionLimitOpt
        : "",
      brokerageOpt: props.userData ? props.userData.brokerageOpt : "",
      intradayBrokerageOpt: props.userData
        ? props.userData.intradayBrokerageOpt
        : "",

      maxPositionLimitFut: props.userData
        ? props.userData.maxPositionLimitFut === 0
          ? ""
          : props.userData.maxPositionLimitFut
        : "",
      brokerageFut: props.userData ? props.userData.brokerageFut : "",
      intradayBrokerageFut: props.userData
        ? props.userData.intradayBrokerageFut
        : "",

      brokerageMcx: props.userData ? props.userData.brokerageMcx : "",
      intradayBrokerageMcx: props.userData
        ? props.userData.intradayBrokerageMcx
        : "",
      maxPositionLimitMcx: props.userData
        ? props.userData.maxPositionLimitMcx === 0
          ? ""
          : props.userData.maxPositionLimitMcx
        : "",
      commissionType: props.userData ? props.userData.commissionType : null,
      brokerageType: props.userData ? props.userData.brokerageType : "lot",
      Mcx_lots: props.userData ? props.userData.Mcx_lots : [],
    },
    mode: "all",
  });
  const parentId = watch("parentId");
  useEffect(() => {
    commonService.getAdminNameList().then((e) => {
      setAllAdminList(e.data.data as IAdminNameList[]);
    });

    commonService.getMasterNameList().then((e) => {
      setAllMasterList(e.data.data as IAdminNameList[]);
    });

    if (props.type !== "edit") {
      accountService.getRandomGenerateUserId().then((res: any) => {
        setValue("userId", res.data);
      });
    }
  }, []);
  const adminParent =
    allAdminNameList &&
    allAdminNameList.find((e: IAdminNameList) => e.id === parentId);

  const masterParent =
    allMasterNameList &&
    allMasterNameList.find((e: IAdminNameList) => e.id === parentId);

  const userTypeSelect = [
    { id: "admin", name: "Admin" },
    { id: "master", name: "Master" },
    { id: "user", name: "User" },
    { id: "broker", name: "Broker" },
  ];
  const [typeOption, setTypeOption] =
    useState<{ name: string; id: string }[]>(userTypeSelect);

  const [allSegmentList, setAllSegmentList] = useState<ISegmentSummary[]>([]);

  useEffect(() => {
    if (userData?.role?.slug === "admin") {
      setTypeOption(userTypeSelect.filter((e) => e.id !== "admin"));
    } else if (userData?.role?.slug === "master") {
      setTypeOption(
        userTypeSelect.filter((e) => e.id !== "master" && e.id !== "admin")
      );
    }

    accountService
      .getSegments()
      .then((e) => {
        setAllSegmentList(e.data.data as ISegmentSummary[]);
      })
      .catch(() => { });
  }, []);

  const validateMasterForm = (payload: any) => {
    let errorCount = 0;
    if (payload.quantityGroups.length === 0) {
      ++errorCount;
      setError(`quantityGroups`, {
        message: "Select at least one Account Type",
      });
    }
    if (!payload.nseOpt && !payload.nseMcx && !payload.nseFut) {
      ++errorCount;
      setError(`nseMcx`, {
        message: "Select at least one Market Type",
      });
    }
    if (adminParent && payload.maxUsers > adminParent.max_users) {
      ++errorCount;
      setError(`maxUsers`, {
        message: `Max Users can not be greater than ${adminParent.max_users}`,
      });
    }
    if (errorCount > 0) {
      return false;
    }
    return true;
  };

  const validateUserForm = (payload: any) => {
    let errorCount = 0;
    if (!payload.nseOpt && !payload.nseMcx && !payload.nseFut) {
      ++errorCount;
      setError(`nseMcx`, {
        message: "Select at least one Market Type",
      });
    }
    if (
      payload.deliveryMultiplication > masterParent?.delivery_multiplication!
    ) {
      ++errorCount;
      setError(`deliveryMultiplication`, {
        message: `Max allowed Value is ${masterParent?.delivery_multiplication!}`,
      });
    }
    if (
      payload.intradayMultiplication > masterParent?.intraday_multiplication!
    ) {
      ++errorCount;
      setError(`intradayMultiplication`, {
        message: `Max allowed Value is ${masterParent?.intraday_multiplication!}`,
      });
    }

    if (payload.nseOpt) {
      //Nse Option brokerage Validation
      if (
        payload.intradayMultiplicationNseOpt >
        masterParent?.nse_opt_intraday_multiplication!
      ) {
        ++errorCount;
        setError(`intradayMultiplicationNseOpt`, {
          message: `Max allowed Value is ${masterParent?.nse_opt_intraday_multiplication!}`,
        });
      }
      if (
        payload.deliveryMultiplicationNseOpt >
        masterParent?.nse_opt_delivery_multiplication!
      ) {
        ++errorCount;
        setError(`deliveryMultiplicationNseOpt`, {
          message: `Max allowed Value is ${masterParent?.nse_opt_delivery_multiplication!}`,
        });
      }
      if (payload.brokerageOpt < masterParent?.nse_opt_min_lot_wise_brokerage!) {
        ++errorCount;
        setError(`brokerageOpt`, {
          message: `Min required Value is ${masterParent?.nse_opt_min_lot_wise_brokerage!}`,
        });
      }
      if (
        payload.intradayBrokerageOpt <
        masterParent?.nse_opt_min_lot_wise_brokerage!
      ) {
        ++errorCount;
        setError(`intradayBrokerageOpt`, {
          message: `Min required Value is ${masterParent?.nse_opt_min_lot_wise_brokerage!}`,
        });
      }
    }

    if (payload.nseFut) {
      //Nse Fut brokerage Validation
      if (payload.brokerageFut < masterParent?.min_brokerage!) {
        ++errorCount;
        setError(`brokerageFut`, {
          message: `Min required Value is ${masterParent?.min_brokerage!}`,
        });
      }
      if (payload.intradayBrokerageFut < masterParent?.min_brokerage!) {
        ++errorCount;
        setError(`intradayBrokerageFut`, {
          message: `Min required Value is ${masterParent?.min_brokerage!}`,
        });
      }
    }


    if (payload.nseMcx) {
      //MCX brokerage Validation
      if (
        payload.brokerageMcx <
        (payload.brokerageType === "amount"
          ? masterParent?.min_mcx_brokerage!
          : masterParent?.min_mcx_brokerage_percentage!)
      ) {
        ++errorCount;
        setError(`brokerageMcx`, {
          message: `Min required Value is ${payload.brokerageType === "amount"
            ? masterParent?.min_mcx_brokerage!
            : masterParent?.min_mcx_brokerage_percentage!
            }`,
        });
      }
      if (
        payload.intradayBrokerageMcx <
        (payload.brokerageType === "amount"
          ? masterParent?.min_mcx_brokerage!
          : masterParent?.min_mcx_brokerage_percentage!)
      ) {
        ++errorCount;
        setError(`intradayBrokerageMcx`, {
          message: `Min required Value is ${payload.brokerageType === "amount"
            ? masterParent?.min_mcx_brokerage!
            : masterParent?.min_mcx_brokerage_percentage!
            }`,
        });
      }
    }


    if (errorCount > 0) {
      return false;
    }
    return true;
  };

  const onSubmit = async (formData: any) => {
    if (userType === "broker") {
      const payload: any = {
        roleSlug: "broker",
        roleId: 4,
        userType: formData.userType,
        password: formData.password,
        userId: formData.userId,
        parentId: formData.parentId,
        mobile: formData.mobile === "" ? null : toNumber(formData.mobile),
        brokerId: formData.brokerId,
        name: formData.name,
        remarks: formData.remarks,
      };
      setLoading(true);
      if (props?.userData && props?.userData.id) {
        formData.id = toNumber(props.userData.id);
        await accountService
          .updateAccountById(formData.id, payload)
          .then((res) => {
            if (res.data.statusCode === 200 || res.data.statusCode === 201) {
              Toast.show({ type: "success", text1: res.data.message });
              props.navigation.navigate(SCREENS.Broker);
            } else {
              Toast.show({ type: "error", text1: res.data.message });
            }
            setLoading(false);
          })
          .catch((error: any) => {
            if (error.response.data.message.length > 0) {
              for (
                let i = 0;
                i <= error.response.data.message.length - 1;
                i++
              ) {
                Toast.show({
                  type: "error",
                  text1: error.response.data.message[i],
                });
              }
            } else {
              Toast.show({ type: "", text1: error });
            }
            setLoading(false);
          });
      } else {
        const payload: any = {
          roleSlug: "broker",
          roleId: 4,
          userType: formData.userType,
          password: formData.password,
          userId: formData.userId,
          parentId: formData.parentId,
          mobile: formData.mobile === "" ? null : toNumber(formData.mobile),
          brokerId: formData.brokerId,
          name: formData.name,
          remarks: formData.remarks,
        };
        await accountService
          .createAccount(payload)
          .then((res) => {
            if (res.data.statusCode === 200 || res.data.statusCode === 201) {
              setNewUser({
                password: formData.password,
                type: "Broker",
                userId: formData.userId,
              });
            } else {
              Toast.show({ type: "error", text1: res.data.message });
            }
            setLoading(false);
          })
          .catch((error: any) => {
            if (error.response.data.message.length > 0) {
              for (
                let i = 0;
                i <= error.response.data.message.length - 1;
                i++
              ) {
                Toast.show({
                  type: "error",
                  text1: error.response.data.message[i],
                });
              }
            } else {
              Toast.show({ type: "error", text1: error });
            }
            setLoading(false);
          });
      }
    }
    if (userType === "admin") {
      setLoading(true);
      const payload = {
        roleSlug: "admin",
        roleId: 2,
        password: formData.password,
        partnershipPercentage: 0,
        userId: formData.userId,
        maxMasters: toNumber(formData.maxMasters),
        maxUsers: toNumber(formData.maxUsers),
        editTrade: formData.editTrade,
        deleteTrade: formData.deleteTrade,
        manualTrade: formData.manualTrade,
        name: formData.name,
        mobile: formData.mobile === "" ? null : toNumber(formData.mobile),
      };
      if (props.userData && props.userData.id) {
        formData.id = toNumber(props.userData.id);
        await accountService
          .updateAccountById(formData.id, payload)
          .then((res: any) => {
            if (res.data.statusCode === 200 || res.data.statusCode === 201) {
              setTimeout(() => {
                Toast.show({ type: "success", text1: res.data.message });
                props.navigation.navigate(SCREENS.Admin);
              }, 1000);
            } else {
              Toast.show({ type: "error", text1: res.data.message });
            }
            setLoading(false);
          })
          .catch((error) => {
            Toast.show({ type: "error", text1: error.message });
            setLoading(false);
          });
      } else {
        const payload = {
          roleSlug: "admin",
          roleId: 2,
          password: formData.password,
          partnershipPercentage: 0,
          userId: formData.userId,
          maxMasters: toNumber(formData.maxMasters),
          maxUsers: toNumber(formData.maxUsers),
          editTrade: formData.editTrade,
          deleteTrade: formData.deleteTrade,
          manualTrade: formData.manualTrade,
          name: formData.name,
          mobile: formData.mobile === "" ? null : toNumber(formData.mobile),
        };
        await accountService
          .createAccount(payload)
          .then((res) => {
            if (res.data.statusCode === 200 || res.data.statusCode === 201) {
              setNewUser({
                password: formData.password,
                type: "Admin",
                userId: formData.userId,
              });
            } else {
              Toast.show({ type: "error", text1: res.data.message });
            }
            setLoading(false);
          })
          .catch((error) => {
            Toast.show({ type: "error", text1: error.message });
            setLoading(false);
          });
      }
    }
    if (userType === "master") {
      if (validateMasterForm(formData)) {
        setLoading(true);
        const payload = {
          roleSlug: "master",
          balanceWise: true,
          roleId: 3,
          name: formData.name,
          userId: formData.userId,
          nseMcx: formData.nseMcx,
          nseFut: formData.nseFut,
          nseOpt: formData.nseOpt,
          quantityGroups: formData.quantityGroups,
          maxUsers:
            formData.maxUsers === "" ? null : toNumber(formData.maxUsers),
          partnershipPercentage: toNumber(formData.partnershipPercentage),
          mobile: formData.mobile === "" ? null : toNumber(formData.mobile),
          minBrokerage: formData.minBrokerage
            ? toNumber(formData.minBrokerage)
            : 0,
          nseOptMinLotWiseBrokerage: toNumber(
            formData.nseOptMinLotWiseBrokerage
          ),
          nseOptIntradayMultiplication: toNumber(
            formData.nseOptIntradayMultiplication
          ),
          nseOptDeliveryMultiplication: toNumber(
            formData.nseOptDeliveryMultiplication
          ),
          intradayMultiplication: toNumber(formData.intradayMultiplication),
          deliveryMultiplication: toNumber(formData.deliveryMultiplication),
          minMcxBrokeragePercentage: toNumber(
            formData.minMcxBrokeragePercentage
          ),
          minMcxBrokerage: toNumber(formData.minMcxBrokerage),
          remarks: formData.remarks,
        };
        if (props?.userData && props?.userData.id) {
          formData.id = toNumber(props.userData.id);
          await accountService
            .updateAccountById(formData.id, payload)
            .then((res) => {
              if (res.data.statusCode === 200 || res.data.statusCode === 201) {
                Toast.show({ type: "success", text1: res.data.message });
                props.navigation.navigate(SCREENS.Master);
              } else {
                Toast.show({ type: "error", text1: res.data.message });
              }
              setLoading(false);
            })
            .catch((error: any) => {
              if (error.response.data.message.length > 0) {
                for (
                  let i = 0;
                  i <= error.response.data.message.length - 1;
                  i++
                ) {
                  Toast.show({
                    type: "error",
                    text1: error.response.data.message[i],
                  });
                }
              } else {
                Toast.show({ type: "error", text1: error });
              }
              setLoading(false);
            });
        } else {
          const payload = {
            roleSlug: "master",
            balanceWise: true,
            roleId: 3,
            userType: formData.userType,
            password: formData.password,
            name: formData.name,
            userId: formData.userId,
            parentId: formData.parentId,
            nseMcx: formData.nseMcx,
            nseFut: formData.nseFut,
            nseOpt: formData.nseOpt,
            quantityGroups: formData.quantityGroups,
            maxUsers: toNumber(formData.maxUsers),
            partnershipPercentage: toNumber(formData.partnershipPercentage),
            mobile: formData.mobile === "" ? null : toNumber(formData.mobile),
            minBrokerage: toNumber(formData.minBrokerage),
            nseOptMinLotWiseBrokerage: toNumber(
              formData.nseOptMinLotWiseBrokerage
            ),
            nseOptIntradayMultiplication: toNumber(
              formData.nseOptIntradayMultiplication
            ),
            nseOptDeliveryMultiplication: toNumber(
              formData.nseOptDeliveryMultiplication
            ),
            minMcxBrokeragePercentage: toNumber(
              formData.minMcxBrokeragePercentage
            ),
            minMcxBrokerage: toNumber(formData.minMcxBrokerage),
            remarks: formData.remarks,
          };
          await accountService
            .createAccount(payload)
            .then((res) => {
              if (res.data.statusCode === 200 || res.data.statusCode === 201) {
                setNewUser({
                  password: formData.password,
                  type: "Master",
                  userId: formData.userId,
                });
              } else {
                Toast.show({ type: "error", text1: res.data.message });
              }
              setLoading(false);
            })
            .catch((error) => {
              setLoading(false);
              Toast.show({ type: "error", text1: error });
            });
        }
      }
    }
    if (userType === "user") {
      if (validateUserForm(formData)) {
        setLoading(true);
        const payload: any = {
          userId: formData.userId,
          parentId: formData.parentId,
          name: formData.name,
          roleSlug: "user",
          roleId: 5,
          password: formData.password,
          mobile: formData.mobile === "" ? null : toNumber(formData.mobile),
          otherM2mAlert: toNumber(formData.otherM2mAlert),
          intradayMultiplicationNseOpt: toNumber(
            formData.intradayMultiplicationNseOpt
          ),
          deliveryMultiplicationNseOpt: toNumber(
            formData.deliveryMultiplicationNseOpt
          ),
          otherM2mPercentage: toNumber(formData.otherM2mPercentage),
          partnershipPercentage: toNumber(formData.partnershipPercentage),
          orderBetweenHighLow: formData.orderBetweenHighLow,
          isLimitAllow: formData.isLimitAllow,
          isApplyAutoSquareOff: formData.isApplyAutoSquareOff,
          //extraa fields
          balanceWise: true,
          quantityScriptGroupId: formData.quantityScriptGroupId,
          marginLimit: toNumber(formData.marginLimit),
          isApplyIntradayAutoSquareOff: formData.isApplyIntradayAutoSquareOff,
          onlyPositionSquareOff: formData.onlyPositionSquareOff,
          deliveryMultiplication: toNumber(formData.deliveryMultiplication),
          intradayMultiplication: toNumber(formData.intradayMultiplication),
          //intraday
          brokeragePercentage: toNumber(formData.brokeragePercentage),
          mcxBrokeragePercentage: toNumber(formData.mcxBrokeragePercentage),
          nseOptBrokeragePercentage: toNumber(
            formData.nseOptBrokeragePercentage
          ),
          //delivery
          brokeragePercentageDelivery: toNumber(
            formData.brokeragePercentageDelivery
          ),
          mcxBrokeragePercentageDelivery: toNumber(
            formData.mcxBrokeragePercentageDelivery
          ),
          nseOptBrokeragePercentageDelivery: toNumber(
            formData.nseOptBrokeragePercentageDelivery
          ),
          remarks: formData.remarks,
          brokerId: formData.brokerId,
          segments: [],
          accountType: "",
        };
        if (nseFut) {
          payload.segments.push({
            segmentSlug: "nse_fut",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            id: allSegmentList.find((e: any) => e.slug === "nse_fut")?.id,
            maxPositionLimit:
              toNumber(formData.maxPositionLimitFut) !== ""
                ? toNumber(formData.maxPositionLimitFut)
                : 0,
            brokerage: toNumber(formData.brokerageFut),
            intradayBrokerage: toNumber(formData.intradayBrokerageFut),
            marginType: "balance",
          });
        }
        if (mcx) {
          payload.segments.push({
            segmentSlug: "mcx",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            id: allSegmentList.find((e: any) => e.slug === "mcx")?.id,
            maxPositionLimit:
              toNumber(formData.maxPositionLimitFut) !== ""
                ? toNumber(formData.maxPositionLimitFut)
                : 0,
            commissionType: formData.commissionType,
            brokerageType: formData.brokerageType,
            brokerage: toNumber(formData.brokerageMcx),
            intradayBrokerage: toNumber(formData.intradayBrokerageMcx),
            marginType: "balance",
            scripts:
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formData.commissionType === "script_wise"
                ? formData.Mcx_lots.filter((e: any) => e.isChecked).map(
                  (e: any) => {
                    return {
                      segmentSlug: "mcx",
                      id: e.id,
                      size: 1,
                      brokerage: toNumber(e.brokerage),
                      intradayBrokerage: toNumber(e.intradayBrokerage),
                    };
                  }
                )
                : [],
          });
        }
        if (nseOption) {
          payload.segments.push({
            segmentSlug: "nse_option",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            id: allSegmentList.find((e: any) => e.slug === "nse_option")?.id,
            maxPositionLimit:
              toNumber(formData.maxPositionLimitFut) !== ""
                ? toNumber(formData.maxPositionLimitFut)
                : 0,
            brokerage: toNumber(formData.brokerageOpt),
            intradayBrokerage: toNumber(formData.intradayBrokerageOpt),
            marginType: "balance",
            intradayMultiplication: toNumber(
              formData.intradayMultiplicationNseOpt
            ),
            deliveryMultiplication: toNumber(
              formData.deliveryMultiplicationNseOpt
            ),
          });
        }
        if (props.userData && props.userData.id) {
          payload.id = toNumber(props.userData.id);
          await accountService
            .updateAccountById(payload.id, payload)
            .then((res) => {
              if (res.data.statusCode === 200 || res.data.statusCode === 201) {
                props.navigation.navigate(SCREENS.User);
                Toast.show({
                  type: "success",
                  text1: res.data.message,
                });
              } else {
                Toast.show({ type: "error", text1: res.data.message });
              }
              setLoading(false);
            })
            .catch((error: any) => {
              if (error.response.data.message.length > 0) {
                for (
                  let i = 0;
                  i <= error.response.data.message.length - 1;
                  i++
                ) {
                  Toast.show({
                    type: "error",
                    text1: error.response.data.message[i],
                  });
                }
              } else {
                Toast.show({ type: "error", text1: error });
              }
              setLoading(false);
            });
        } else {
          console.log("---payload", payload);
          await accountService
            .createAccount(payload)
            .then((res) => {
              if (res.data.statusCode === 200 || res.data.statusCode === 201) {
                setNewUser({
                  password: formData.password,
                  type: "User",
                  userId: formData.userId,
                });
              } else {
                Toast.show({ type: "error", text1: res.data.message });
              }
              setLoading(false);
            })
            .catch((error: any) => {
              if (error.response.data.message.length > 0) {
                for (
                  let i = 0;
                  i <= error.response.data.message.length - 1;
                  i++
                ) {
                  Toast.show({
                    type: "error",
                    text1: error.response.data.message[i],
                  });
                }
              } else {
                Toast.show({ type: "error", text1: error });
              }
              setLoading(false);
            });
        }
      }
    }
  };
  const onLocalError = (error) => {

    console.log("---error", error)

  };

  return (
    <View style={{ flex: 1 }}>
      <EHeader title="Account" />
      <View
        style={{
          flex: 1,
          backgroundColor: current.backgroundColor,
        }}
      >
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                marginTop: 10,
                paddingHorizontal: 16,
              }}
            >
              <FormSelect
                control={control}
                label={"User Type"}
                disable={props.type === "edit" ? true : false}
                name="userType"
                labelKey="name"
                valueKey="id"
                type="select"
                isClearable={false}
                required={"User type is required"}
                placeholder="Select"
                menuPlacement="auto"
                onValueChange={(val: { id: string }) => {
                  setUserType(val.id);
                }}
                options={typeOption}
              />

              <FormInput
                control={control}
                disable={true}
                required={"UserId is Required"}
                name="userId"
                label={"User Id"}
              />
              {props.type !== "edit" && (
                <FormInput
                  control={control}
                  type="password"
                  required={"Password is required"}
                  name="password"
                  label={"Password"}
                  placeholder={"Enter Password"}
                />
              )}
            </View>

            {userType === "admin" && (
              <AdminForm
                navigation={props.navigation}
                control={control}
                watch={watch}
                setValue={setValue}
                setError={setError}
              />
            )}
            {userType === "master" && (
              <MasterForm
                navigation={props.navigation}
                type={props.type}
                control={control}
                watch={watch}
                setValue={setValue}
                setError={setError}
                clearErrors={clearErrors}
              />
            )}
            {userType === "broker" && (
              <BrokerForm
                navigation={props.navigation}
                control={control}
                setValue={setValue}
              />
            )}
            {userType === "user" && (
              <UserForm
                control={control}
                type={props.type}
                watch={watch}
                setValue={setValue}
                getValues={getValues}
                setError={setError}
                clearErrors={clearErrors}
                setNseFut={setNseFut}
                setMcx={setMcx}
                setNseOption={setNseOption}
                nseFut={nseFut}
                mcx={mcx}
                nseOption={nseOption}
                allSegmentList={allSegmentList}
              />
            )}

            <View
              style={{
                borderTopWidth: 2,
                borderColor: current.bcolor,
                paddingHorizontal: 16,
              }}
            >
              <FormInput
                control={control}
                type="text"
                name="remark"
                label={"Remark"}
                placeholder={"Enter Remark"}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 16,
                  marginBottom: 16,
                  gap: 8,
                }}
              >
                <View style={{ flex: 1 }}>
                  <EButton
                    title={"CANCEL"}
                    bgColor={current.alert}
                    onPress={() => reset()}
                    height={40}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <EButton
                    title={"SUBMIT"}
                    loading={loading}
                    bgColor={current.blue}
                    height={40}
                    onPress={handleSubmit(onSubmit, onLocalError)}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <NewUserModal
        newUser={newUser}
        isVisible={newUser !== null}
        close={() => {
          props.navigation.goBack();
          setNewUser(null);
        }}
      />
    </View>
  );
};
export default AddAccount;
