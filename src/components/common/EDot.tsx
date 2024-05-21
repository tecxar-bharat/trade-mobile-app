import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import { View } from "react-native"

const EDot = () => {
    const current = useAppSelector((state) => themeSelector(state, "current"));
    return (
        <View style={{ height: 4, width: 4, borderRadius: 2, marginHorizontal: 10, backgroundColor: current.greyDark }} />
    )
}

export default EDot