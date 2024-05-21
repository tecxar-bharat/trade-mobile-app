import IconActive from "@assets/svgs/IconActive";
import IconDelete from "@assets/svgs/IconDelete";
import IconEdit from "@assets/svgs/IconEdit";
import IconView from "@assets/svgs/IconView";
import IconInactive from "@assets/svgs/IconInactive";
import IconLedger from "@assets/svgs/IconLedger";
import IconClose from "@assets/svgs/IconClose";
import IconRight from "@assets/svgs/IconRight";
import IconResetPassword from "@assets/svgs/IconResetPassword";
import DeleteModal from "@components/models/DeleteModal";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import EText from "./EText";
export const ActionButton = (props: any) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [isDelete, setIsDelete] = useState(false);
  return (
    <View
      style={{
        flexDirection: "row",
        display: "flex",
        width: "100%",
        padding: 5,
        justifyContent: "space-around",
        backgroundColor: current.backgroundColor1,
        borderWidth: 1,
        borderColor: current.bcolor,
        borderRadius: 6,
        marginTop: 5,
      }}
    >
      {props.ledger === "ledger" && (
        <TouchableOpacity
          style={{ alignItems: "center" }}
          onPress={props.ledgers}
        >
          <IconLedger color={current.blue} />
          <EText type="r12" color={current.textColor}>
            {"Ledger"}
          </EText>
        </TouchableOpacity>
      )}
      {props.type === "password" && (
        <TouchableOpacity
          style={{ alignItems: "center" }}
          onPress={props.password}
        >
          <IconResetPassword color={current.primary} />
          <EText type="r12" color={current.textColor}>
            {"Password"}
          </EText>
        </TouchableOpacity>
      )}
      {props.active === "active" && (
        <TouchableOpacity
          onPress={props.activate}
          style={{ alignItems: "center" }}
        >
          {props.isActive ? (
            <>
              <IconActive color={current.green} />
              <EText type="r12" color={current.textColor}>
                {"Active"}
              </EText>
            </>
          ) : (
            <>
              <IconInactive color={current.green} />
              <EText type="r12" color={current.textColor}>
                {"Inactive"}
              </EText>
            </>
          )}
        </TouchableOpacity>
      )}

      {props.edit === "edit" && (
        <TouchableOpacity
          onPress={props.Edited}
          style={{ alignItems: "center" }}
        >
          <IconEdit color={current.blue} />
          <EText type="r12" color={current.textColor}>
            {"Edit"}
          </EText>
        </TouchableOpacity>
      )}
      {props.view === "view" && (
        <TouchableOpacity
          onPress={props.viewClick}
          style={{ alignItems: "center" }}
        >
          <IconView color={current.blue} />
          <EText type="r12" color={current.textColor}>
            {props.viewLabel ?? "View"}
          </EText>
        </TouchableOpacity>
      )}
      {props.delete === "delete" && (
        <View>
          <TouchableOpacity
            onPress={() => setIsDelete(true)}
            style={{ alignItems: "center" }}
          >
            <IconDelete color={current.red} />
            <EText type="r12" color={current.textColor}>
              {"Delete"}
            </EText>
          </TouchableOpacity>
          <DeleteModal
            onPress={() => {
              props.deleted();
              setIsDelete(false);
            }}
            visible={isDelete}
            title={"Delete"}
            onDismiss={() => setIsDelete(false)}
          />
        </View>
      )}
      {props?.user === "superadmin" && props.isApproved === "pending" && (
        <>
          {props.approve === "approve" && (
            <View>
              <TouchableOpacity
                onPress={props.approved}
                style={{ alignItems: "center" }}
              >
                <IconRight color={current.red} />
                <EText type="r12" color={current.textColor}>
                  {"Approve"}
                </EText>
              </TouchableOpacity>
            </View>
          )}
          {props.reject === "reject" && (
            <View>
              <TouchableOpacity
                onPress={props.rejected}
                style={{ alignItems: "center" }}
              >
                <IconClose color={current.red} />
                <EText type="r12" color={current.textColor}>
                  {"Reject"}
                </EText>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};
