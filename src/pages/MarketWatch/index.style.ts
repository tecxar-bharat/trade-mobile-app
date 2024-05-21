import { useAppSelector } from "@store/index";
import { StyleSheet } from "react-native";
export const createStyles = () => {
    const colors = useAppSelector(state => state.theme.current);
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.backgroundColor,
            // paddingHorizontal: 16
        },
        card: {
            borderRadius: 12,
            backgroundColor: colors.backgroundColor,
            marginTop: 5,
            padding: 5,
            paddingBottom: 3,
            flexDirection: 'row',
        },
        watchlisttext: {
            fontSize: 12,
            color: colors.textColor,
            padding: 2
        },
        watchlistfont16: {
            fontSize: 12,
            color: colors.textColor
        },
        input: {
            color: colors.textColor,
            height: 40
        },
        textInput: {
            borderColor: colors.greyText,
            borderWidth: 1,
            borderRadius: 10,
            margin: 5,
            paddingHorizontal: 10,
            flex: 1,
        },
        submitandcancel: {
            fontSize: 14, fontWeight: '700', textAlign: 'right',
        },
        rowCenter: {
            flexDirection: 'row', alignItems: 'center'
        },
        flex1: {
            flex: 1
        }
    });
};