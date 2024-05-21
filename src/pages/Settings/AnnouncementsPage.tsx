import { ActionButton } from "@commonComponents/ActionButtons";
import EHeader from "@commonComponents/EHeader";
import EListLayout from "@commonComponents/EListLayout";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import AnnouncementModal from "@components/models/AnnouncementModal";
import { IAccount } from "@interfaces/account.interface";
import announcementService from "@services/announcement.service";
import { useAppDispatch, useAppSelector } from "@store/index";
import { deleteAnnouncementById } from "@store/reducers/announcementReducer";
import { getCurrentMcxSymbols } from "@store/reducers/mcxSymbolsReducer";
import { themeSelector } from "@store/reducers/theme.reducer";
import { dateFormat } from "@utils/constant";
import moment from "moment";
import React, { Fragment, useState } from "react";
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-toast-message";
import { useQuery } from "react-query";
const Announcements = () => {
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState(-1);
  const [rowData, setRowData] = useState<any[]>();
  const [refreshing, setRefreshing] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showOpenTradeModal, setShowOpenTradeModal] = useState(false);
  const [openTradeModalData, setOpenTradeModalData] = useState<IAccount>();
  const current = useAppSelector((state) => themeSelector(state, "current"));

  const onDelete = async (deleteId: number) => {
    let object = {
      deleteId,
      onSuccess,
      onError,
    };
    await dispatch(deleteAnnouncementById(object));
    setRefresh((prev) => !prev);
  };

  const onSuccess = (message: string) => {
    setTimeout(() => {
      Toast.show({ type: "success", text1: message });
    }, 1000);
  };

  const onError = (err: any) => {
    setTimeout(() => {
      Toast.show({ type: "error", text1: err });
    }, 1000);
  };

  const { data, isLoading, error, refetch } = useQuery(["announcements", refresh], async () => {
    return await announcementService.getAnnouncements();
  });

  React.useEffect(() => {
    if (!isLoading && !error && data?.data?.data) {
      setRowData(data.data.data);
    }
  }, [data, isLoading, error]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = ({ item, index }: any) => {
    const deleteClick = () => {
      setIsDelete(true);
      setDeleteId(item?.id);
    };
    return (
      <TouchableOpacity
        style={{
          backgroundColor: current.backgroundColor,
          padding: 10,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderColor:
            current.value === "dark" ? current.bcolor : current.bcolor,
        }}
        onPress={() => setExpanded((prev) => prev === index ? -1 : index)}
      >
        <View
          style={{
            // flexDirection: "row",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <View
            style={{ justifyContent: "space-between", flexDirection: "row" }}
          >
            <EText type="s16" style={{ textTransform: 'capitalize' }} >{item?.category}</EText>
            <EText type="r14" color={current.greyText} >
              {moment(item.createdAt).format(dateFormat)}
            </EText>
          </View>
          <EText color={current.greyDark} type="m16" ellipsizeMode={"tail"} numberOfLines={2}>
            {item?.message}
          </EText>
        </View>
        {expanded === index ?

          <ActionButton
            edit='edit'
            delete='delete'
            Edited={() => { setOpenTradeModalData(item); setShowOpenTradeModal(true) }}
            deleted={() => onDelete(item.id)}

          /> : null

        }

      </TouchableOpacity>
    );
  };
  return (
    <Fragment>
      <EHeader title="Announcements" isHideBack={false} />
      <EListLayout addButtonLabel="ADD" onAddNew={() => setShowOpenTradeModal(true)}>
        <FlatList
          renderItem={renderItem}
          data={rowData}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          ListEmptyComponent={ListEmptyComponent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </EListLayout>
      {showOpenTradeModal && (
        <AnnouncementModal
          isVisible={showOpenTradeModal}
          data={openTradeModalData}
          refreshList={() => setRefresh((prev) => !prev)}
          onDismiss={() => {
            setShowOpenTradeModal(false), setOpenTradeModalData(undefined);
          }}
        />
      )}
    </Fragment>
  );
};
export default Announcements;
