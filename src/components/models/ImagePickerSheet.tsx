// Library import
import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import ActionSheet from "react-native-actions-sheet";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImagePicker, { ImageOrVideo } from "react-native-image-crop-picker";

// Custom import
import { moderateScale } from "@common/constants";
import { styles } from "@themes/index";
import EText from "@components/common/EText";
import strings from "@i18n/strings";
import { useAppDispatch, useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import { upload } from "@store/reducers/file.reducer";
import { Image } from "react-native-compressor";
import moment from "moment";

interface IProps {
  SheetRef: any;
  onSelect: (path: string, img: ImageOrVideo) => void;
  label?: string;
  mediaType: "any" | "photo" | "video";
}

export const getFileName = (image: ImageOrVideo) => {
  const date = moment().format("DD-MM-YY");
  const time = moment().format("HH:MM:SS");
  return image.filename
    ? image.filename!.split(".").shift()
    : `${date}-${time}`;
};

const ImagePickerSheet = (props: IProps) => {
  const { SheetRef, onSelect, label, mediaType, setLoading } = props;
  const { current: colors } = useAppSelector(themeSelector);
  const dispatch = useAppDispatch();

  const onPressCamera = () => {
    ImagePicker.openCamera({
      mediaType,
      includeBase64: true,
    }).then(async (img) => {
      img.filename = getFileName(img);
      Image.compress(img.path, {
        compressionMethod: "auto",
      }).then(async (compressedPath) => {
        SheetRef?.current?.hide();

        if (setLoading) {
          setLoading(true);
        }
        const { payload } = await dispatch(upload(compressedPath));
        if (payload) {
          onSelect(payload.Location, img);
        }
        if (setLoading) {
          setLoading(false);
        }
      });
    });
  };

  const onPressGallery = () => {
    ImagePicker.openPicker({
      mediaType,
    })
      .then(async (img) => {
        try {
          img.filename = getFileName(img);
          Image.compress(img.path, {
            compressionMethod: "auto",
          })
            .then(async (compressedPath) => {
              SheetRef?.current?.hide();
              if (setLoading) {
                setLoading(true);
              }
              const { payload } = await dispatch(upload(compressedPath));
              if (payload) {
                onSelect(payload.Location, img);
              }
              if (setLoading) {
                setLoading(false);
              }
            })
            .catch((e) => {
              // console.log("----------e", e);
            });
        } catch (error) {
          // console.log("----------error1", error);
        }
      })
      .catch((e) => {
        // console.log("---------err1", e);
      });
  };

  return (
    <ActionSheet
      ref={SheetRef}
      gestureEnabled={true}
      indicatorStyle={{
        backgroundColor:
          colors.value === "dark" ? colors.dark3 : colors.grayScale3,
        ...styles.actionSheetIndicator,
      }}
      containerStyle={[
        localStyles.actionSheetContainer,
        { backgroundColor: colors.backgroundColor },
      ]}
    >
      <View style={localStyles.bottomContainer}>
        {label && <EText type={"M24"}>{label}</EText>}
        <TouchableOpacity
          style={[
            localStyles.contextContainer,
            {
              borderColor:
                colors.value === "dark" ? colors.grayScale8 : colors.grayScale3,
            },
          ]}
          onPress={onPressCamera}
        >
          <Ionicons
            name="ios-camera"
            size={moderateScale(26)}
            color={colors.textColor}
            style={styles.mr5}
          />
          <EText type={"s18"} style={styles.ml10}>
            {strings.takeAPicture}
          </EText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            localStyles.contextContainer,
            {
              borderColor:
                colors.value === "dark" ? colors.grayScale8 : colors.grayScale3,
            },
          ]}
          onPress={onPressGallery}
        >
          <Ionicons
            name="ios-images"
            size={moderateScale(26)}
            color={colors.textColor}
            style={styles.mr5}
          />
          <EText type={"s18"} style={styles.ml10}>
            {strings.chooseFromGallery}
          </EText>
        </TouchableOpacity>
      </View>
    </ActionSheet>
  );
};

const localStyles = StyleSheet.create({
  actionSheetContainer: {
    ...styles.ph20,
  },
  contextContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.mt20,
    ...styles.p15,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(15),
  },
  bottomContainer: {
    width: "100%",
    ...styles.selfCenter,
    paddingHorizontal: moderateScale(40),
    ...styles.mv30,
  },
});

export default ImagePickerSheet;
