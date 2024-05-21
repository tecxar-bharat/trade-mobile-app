import images from "@assets/images";
import EHeader from "@commonComponents/EHeader";
import ELoader from "@commonComponents/ELoader";
import EText from "@commonComponents/EText";
import { useRoute } from "@react-navigation/native";
import payInPayoutService from "@services/payInPayout.service";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";

const ImageShow = () => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [imageDialogId, setImageDialogId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const { id, type } = route?.params;

  useEffect(() => {
    setLoading(true);
    if (type === "deposit") {
      payInPayoutService.getPaymentAttachmentById(id).then((res: any) => {
        setImageDialogId(res.data);
        setLoading(false);
      });
    } else {
      payInPayoutService.getPaymentAttachmentByWpId(id).then((res: any) => {
        setImageDialogId(res.data);
        setLoading(false);
      });
    }
  }, [id, type]);
  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor1 }}>
      <EHeader title="Image" />
      {loading ? (
        <ELoader loading={true} size="medium" mode={"fullscreen"} />
      ) : imageDialogId ? (
        <Image
          source={{ uri: imageDialogId }}
          style={{ flex: 1 }}
          resizeMode="contain"
        />
      ) : (
        <View
          style={{
            backgroundColor: current.backgroundColor,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <EText color={current?.textColor} type="m16">
            No Data Found
          </EText>
        </View>
      )}
    </View>
  );
};
export default ImageShow;
