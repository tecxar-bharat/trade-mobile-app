import EHeader from "@commonComponents/EHeader"
import MenuButton from "@commonComponents/MenuButton"
import { INavigation } from "@interfaces/common"
import Trades from "@pages/Trades"
import { Fragment } from "react"

const BrokerTrade = ({ navigation }: INavigation) => {
    return <Fragment>
        <EHeader
            title="Trades"
            isLeftIcon={<MenuButton navigation={navigation} />}
            showProfileButton={true}
            isHideBack={true}
        />
        <Trades />
    </Fragment>
}

export default BrokerTrade