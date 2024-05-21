import CloseIcon from "@commonComponents/CloseIcon";
import EText from "@commonComponents/EText";
import FormSelect from "@fields/FormSelect";
import SelectCommon from "@fields/Select";
import { authSelector } from "@reducers/auth.reducer";
import {
  clearMasterList,
  getMasterNameList,
  masterSelector,
} from "@reducers/masterReducer";
import { themeSelector } from "@reducers/theme.reducer";
import {
  clearUserList,
  getBrokerNameList,
  userSelector,
} from "@reducers/userReducer";
import { useAppDispatch, useAppSelector } from "@store/index";
import { adminSelector, getAdminNameList } from "@store/reducers/adminReducer";
import {
  brokerSelector,
  getUserBrokerNameList,
} from "@store/reducers/brokerReducer";
import {
  flushState,
  ledgerSelector,
  setMasterId,
  setUserId,
  setValanId,
} from "@store/reducers/ledgerReducer";
import { colors } from "@themes/index";
import { getLastNineWeeksDates } from "@utils/constant";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import EvilIcons from "react-native-vector-icons/EvilIcons";
const MasterUserModal = (props: any) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const allUserNameList = useAppSelector((state) =>
    userSelector(state, "allUserNameList")
  );
  const allBrokerNameList = useAppSelector((state) =>
    userSelector(state, "allBrokerNameList")
  );
  const MasterId = useAppSelector((state) => ledgerSelector(state, "MasterId"));
  const UserId = useAppSelector((state) => ledgerSelector(state, "UserId"));
  const valanId = useAppSelector((state) => ledgerSelector(state, "valanId"));

  const allUserBrokerNameList = useAppSelector((state) =>
    brokerSelector(state, "allUserBrokerNameList")
  );
  const allMasterNameList = useAppSelector((state) =>
    masterSelector(state, "allMasterNameList")
  );
  const userData = useAppSelector((state) => authSelector(state, "userData"));

  const dispatch = useAppDispatch();
  const { handleSubmit, reset } = useForm<any>({
    defaultValues: {},
    mode: "onChange",
  });

  const onSumbit = () => {
    props.onFilter({
      AdminId: AdminId,
      MasterId: MasterId,
      UserId: UserId,
      valanId: props?.type === "log" ? null : valanId,
    });
    props.onDismiss();
  };
  const onClear = () => {
    dispatch(setMasterId(null));
    dispatch(setUserId(null));
    dispatch(setValanId(val));
    reset({ AdminId: "" });
    props.onFilter();
  };
  const [valanOptions, setValanOptions] = useState<any>([]);
  useEffect(() => {
    setValanOptions(getLastNineWeeksDates());
    dispatch(getBrokerNameList({}));
    return () => {
      dispatch(flushState());
      dispatch(getAdminNameList());
    };
  }, []);
  const AdminId = useAppSelector((state) => ledgerSelector(state, "AdminId"));
  const allAdminNameList = useAppSelector((state) =>
    adminSelector(state, "allAdminNameList")
  );
  const { control, setValue } = useForm<any>({
    defaultValues: {},
    mode: "onChange",
  });
  useEffect(() => {
    if (valanOptions && valanOptions.length > 0) {
      dispatch(setValanId(valanOptions[valanOptions.length - 2]));
    }
  }, [valanOptions]);

  useEffect(() => {
    if (userData?.role.slug === "admin") {
      dispatch(getMasterNameList({}));
    } else if (AdminId) {
      dispatch(getMasterNameList({ userId: AdminId }));
    } else {
      dispatch(clearMasterList());
      dispatch(clearUserList());
      dispatch(flushState());
    }
  }, [AdminId]);

  useEffect(() => {
    if (userData?.role.slug === "master") {
      dispatch(getUserBrokerNameList({}));
    } else if (MasterId) {
      dispatch(getUserBrokerNameList({ userId: MasterId }));
    } else {
      dispatch(clearUserList());
    }
  }, [MasterId]);

  return (
    <View>
      <Modal isVisible={props.visible} onDismiss={props.onDismiss}>
        <View
          style={{
            backgroundColor: current.cardBackround,
            borderRadius: 12,
            padding: 16,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <EText style={{ fontSize: 16 }}>{props.title}</EText>
            <TouchableOpacity onPress={props.onDismiss}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.boarder} />
          {props.type === "Broker Bill" ? (
            <SelectCommon
              labelKey="date"
              valueKey="date"
              type="select"
              placeholder="Select Valan"
              value={valanId}
              options={valanOptions}
              isClearable={false}
              onValueChange={(val: number | null) => {
                dispatch(setValanId(val));
              }}
            />
          ) : (
            <>
              {userData?.role?.slug === "superadmin" && (
                <FormSelect
                  control={control}
                  labelKey="name"
                  valueKey="id"
                  name="AdminId"
                  placeholder="Admin"
                  type="select"
                  isClearable={true}
                  menuPlacement="auto"
                  onValueChange={(Val: any) => {
                    setValue("userId", undefined);
                    setValue("masterId", undefined);
                    if (Val) {
                      dispatch(getMasterNameList({ userId: Val.id }));
                    } else {
                      dispatch(clearMasterList());
                      dispatch(clearUserList());
                    }
                  }}
                  options={allAdminNameList}
                />
              )}
              {["superadmin", "admin"].includes(userData?.role?.slug) && (
                <SelectCommon
                  labelKey="name"
                  valueKey="id"
                  type="select"
                  placeholder="Master"
                  value={MasterId}
                  isClearable={true}
                  onChange={(val: number) => dispatch(setMasterId(val))}
                  options={allMasterNameList}
                />
              )}
            </>
          )}
          {props.type === "Cash Ledger" && (
            <SelectCommon
              labelKey="name"
              valueKey="id"
              type="select"
              placeholder="Client"
              value={UserId}
              isClearable={true}
              onChange={(val: number) => dispatch(setUserId(val))}
              options={allUserBrokerNameList}
            />
          )}

          {props.type === "Deposit Ledger" && (
            <SelectCommon
              labelKey="name"
              valueKey="id"
              type="select"
              placeholder="Client"
              value={UserId}
              isClearable={true}
              onChange={(val: number) => {
                dispatch(setUserId(val));
              }}
              options={allUserBrokerNameList}
            />
          )}
          {props.type === "Broker Bill" && (
            <SelectCommon
              labelKey="name"
              valueKey="id"
              type="select"
              placeholder="Client"
              value={UserId}
              isClearable={true}
              onChange={(val: number) => {
                dispatch(setUserId(val));
              }}
              options={
                props.type === "Broker Bill"
                  ? allBrokerNameList
                  : allUserNameList
              }
            />
          )}

          <View style={styles.boarder} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={handleSubmit(onClear)}>
              <EText
                style={{
                  color: current.textOne,
                  fontSize: 14,
                  marginRight: 10,
                }}
              >
                Reset
              </EText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: current.red,
                borderRadius: 9,
                padding: 5,
              }}
              onPress={handleSubmit(onSumbit)}
            >
              <EText style={{ color: current.white, fontSize: 14 }}>
                Confirm
              </EText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default MasterUserModal;

const styles = StyleSheet.create({
  boarder: {
    borderBottomColor: colors.dark.black,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
    marginTop: 10,
  },
});
