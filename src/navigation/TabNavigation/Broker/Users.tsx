import EHeader from "@commonComponents/EHeader";
import MenuButton from "@commonComponents/MenuButton";
import { INavigation } from "@interfaces/common";
import Users from "@pages/CreateUser/User/User";
import { Fragment } from "react";

const BrokerUserList = ({ navigation }: INavigation) => {
  return (
    <Fragment>
      <EHeader
        title="Users"
        isLeftIcon={<MenuButton navigation={navigation} />}
        showProfileButton={true}
        isHideBack={true}
      />
      <Users hideHeader={true} navigation={navigation} />
    </Fragment>
  );
};

export default BrokerUserList;
