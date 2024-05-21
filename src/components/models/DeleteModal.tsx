import { themeSelector } from "@reducers/theme.reducer";
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { colors } from "@themes/index";
import EText from "@commonComponents/EText";
import { useAppSelector } from "@store/index";
import EButton from "@commonComponents/EButton";
import CloseIcon from "@commonComponents/CloseIcon";
const DeleteModal = (props: any) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  return (
    <View>
      <Modal
        onBackdropPress={props.onBackdropPress}
        onBackButtonPress={props.onBackButtonPress}
        isVisible={props.visible}
        onDismiss={props.onDismiss}
      >
        <View
          style={{
            backgroundColor: current.backgroundColor,
            borderRadius: 12,
            padding: 16,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <EText type="r14" style={{ color: current.red, fontSize: 18 }}>
              {props.title}
            </EText>
            <TouchableOpacity onPress={props.onDismiss}>
              <CloseIcon />
            </TouchableOpacity>
          </View>

          <EText
            type="r14"
            style={{ marginVertical: 10 }}
          >{`Are you sure you want to Delete ${
            props.deleteLabel ? props.deleteLabel : ""
          }?`}</EText>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={props.onDismiss}>
                <EText type="r14" style={{ color: "grey", marginRight: 10 }}>
                  {"CANCEL"}
                </EText>
              </TouchableOpacity>
              <EButton
                style={{ textAlign: "center", paddingHorizontal: 10 }}
                title={"CONFIRM"}
                height={30}
                onPress={props.onPress}
                bgColor={current.red}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default DeleteModal;

const styles = StyleSheet.create({
  boarder: {
    borderBottomColor: colors.dark.black,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
    marginTop: 10,
  },
});
