import Input from "@fields/Input";
import { isBlank } from "@utils/helpers";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { useAppSelector } from "../../store";
import { themeSelector } from "../../store/reducers/theme.reducer";
import CloseIcon from "./CloseIcon";
import EButton from "./EButton";
import EText from "./EText";
const ApproveRejectModal = (props: any) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [remark, setRemark] = useState("")
  const [error, setError] = useState(null)


  const confirm = () => {
    if (props.withRemarks) {
      if (isBlank(remark)) {
        setError({ message: "Remark is required" })
      }
      else {
        props.onPress(remark)
      }
    }
    else {
      props.onPress()
    }
  }

  const dismiss = () => {
    setError(null)
    setRemark("")
    props.onDismiss()
  }


  return (
    <View>
      <Modal isVisible={props.visible} onDismiss={dismiss}>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <EText type='b18'>{props.title}</EText>
            <TouchableOpacity onPress={dismiss}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomColor: "#FFFFFF",
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginBottom: 10,
              marginTop: 10,
            }}
          />
          <EText type='r14'>{props.message}</EText>

          {props.withRemarks ?
            <View style={{ marginTop: 8 }}>
              <Input
                onChange={(val: string) => {
                  setError(null)
                  setRemark(val)
                }}
                value={remark}
                error={error}
                required={true}
                label='Remark'
                placeholder='Enter rejection remark'
              />
            </View>
            : null
          }

          <View
            style={{
              borderBottomColor: "#FFFFFF",
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginBottom: 10,
              marginTop: 10,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 8
            }}
          >
            <TouchableOpacity onPress={dismiss}>
              <EText type='r14'>{"CANCEL"}</EText>
            </TouchableOpacity>
            <View style={{ width: 120 }}>
              <EButton
                style={{ textAlign: "center", paddingHorizontal: 10 }}
                title={"CONFIRM"}
                height={40}
                onPress={confirm}
                bgColor={current.primary}
                loading={props.confirmLoading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default ApproveRejectModal;
