import images from "@assets/images";
import EButton from "@commonComponents/EButton";
import EHeader from "@commonComponents/EHeader";
import ELoader from "@commonComponents/ELoader";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import DeleteModal from "@components/models/DeleteModal";
import FormSelect from "@fields/FormSelect";
import { IMcxSymbols } from "@interfaces/mcxSymbols.interface";
import mcxSymbolsService from "@services/mcxSymbols.service";
import { useAppDispatch, useAppSelector } from "@store/index";
import {
  addMcxSymbol,
  deleteMcxSymbolById,
  getCurrentMcxSymbols,
  getMcxSymbols,
  mcxSymbolsSelector,
} from "@store/reducers/mcxSymbolsReducer";
import { themeSelector } from "@store/reducers/theme.reducer";
import { getLastNineWeeksDates } from "@utils/constant";
import { getSymbolNameFromIdentifier } from "@utils/helpers";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useQuery } from "react-query";
const McxSymbols = () => {
  const dispatch = useAppDispatch();
  const [rowData, setRowData] = useState<any[]>();
  const [refreshing, setRefreshing] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [mcxSymbolData, setMCXSymbolData] = useState<any>();
  const mcxSymbolsList = useAppSelector((state) =>
    mcxSymbolsSelector(state, "mcxSymbolsList")
  );
  const mcxInstrumentIdentifier = useAppSelector((state) =>
    mcxSymbolsSelector(state, "mcxInstrumentIdentifier")
  );

  const current = useAppSelector((state) => themeSelector(state, "current"));
  const { control, reset } = useForm<any>({
    defaultValues: {},
    mode: "onChange",
  });
  useEffect(() => {
    dispatch(getCurrentMcxSymbols());
    dispatch(getMcxSymbols());
  }, []);

  const onMcxAdd = async (record: any) => {
    const object = {
      payload: {
        instrumentId: record.id,
        identifier: record.identifier,
        name: record.script.name,
        symbol: record.symbol,
        refSlug: record.refSlug,
      },
      onSuccess2,
      onError2,
    };
    dispatch(addMcxSymbol(object));
    reset();
  };
  const onSuccess2 = (message: string) => {
    setTimeout(() => {
      dispatch(getCurrentMcxSymbols());
    }, 500);
    Toast.show({ type: "success", text1: message });
  };
  const onError2 = (err: any) => {
    Toast.show({ type: "error", text1: err });
  };

  const onDelete = () => {
    let object = {
      deleteId,
      onSuccess,
      onError,
    };
    dispatch(deleteMcxSymbolById(object));
    setDeleteId(null);
    setIsDelete(false);
  };
  const onSuccess = (message: string) => {
    setTimeout(() => {
      dispatch(getCurrentMcxSymbols());
    }, 500);
    Toast.show({ type: "success", text1: message });
  };
  const onError = (err: any) => {
    Toast.show({ type: "error", text1: err });
  };
  const filterfunctionclose = () => {
    setIsDelete(!isDelete);
  };

  const { data, isLoading, error, refetch } = useQuery(["mcxSymbols"], async () => {
    return await mcxSymbolsService.getMcxSymbols();
  });
  React.useEffect(() => {
    if (!isLoading && !error && data?.data?.data) {
      setRowData(data?.data?.data);
    }
  }, [data, isLoading, error]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = ({ item }: any) => {
    const deleteClick = () => {
      setIsDelete(true);
      setDeleteId(item?.id);
    };
    return (
      <View
        style={{
          backgroundColor: current.backgroundColor,
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          alignItems: "center",
          borderBottomWidth: 1,
          borderColor:
            current.value === "dark" ? current.bcolor : current.bcolor,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flex: 1,
          }}
        >
          <View style={{ flex: 1, gap: 5 }}>
            <EText type="r16">
              {getSymbolNameFromIdentifier(item?.identifier)}
            </EText>
            <EText type="r14" style={{ color: current.greyDark }}>
              {item.expiry}
            </EText>
            <EText type="m14" color={current.greyText}>
              {item?.refSlug}
            </EText>
          </View>
          <View
            style={{
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <EText type="m16" color={current.textColor}>
              {item?.symbol}
            </EText>
            <TouchableOpacity onPress={deleteClick}>
              <AntDesign name="delete" color={current.red} size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: current.backgroundColor1,
      }}
    >
      <EHeader title="Mcx Symbols" isHideBack={false} />
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 10,
          alignItems: "center",
          marginTop: 30,
          backgroundColor: current.backgroundColor,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <View style={{ flex: 1, marginTop: -30 }}>
          <FormSelect
            control={control}
            labelKey="name"
            valueKey="scriptId"
            name="scriptId"
            placeholder="Script"
            type="select"
            isClearable={true}
            onValueChange={(val: any) => {
              if (val) {
                setMCXSymbolData(val);
              } else {
                setMCXSymbolData(null);
              }
            }}
            menuPlacement="auto"
            options={mcxSymbolsList
              .filter(
                (e: any) => !mcxInstrumentIdentifier.includes(e.identifier)
              )
              .map((e: IMcxSymbols) => {
                return {
                  ...e,
                  name: `${e.symbol} ( ${e.expiry} )`,
                };
              })}
          />
        </View>
        <View style={{ marginTop: -30 }}>
          <EButton
            style={{ paddingHorizontal: 10 }}
            title={"+ Add"}
            height={40}
            onPress={() => {
              onMcxAdd(mcxSymbolData);
              setMCXSymbolData(null);
            }}
            bgColor={current.primary}
          />
        </View>
      </View>

      <View style={{ flex: 1, backgroundColor: current.backgroundColor }}>
        <FlatList
          renderItem={renderItem}
          data={rowData}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          ListEmptyComponent={ListEmptyComponent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
      <DeleteModal
        onPress={onDelete}
        title={"Delete"}
        deleteLabel={"Script"}
        visible={isDelete}
        onBackdropPress={filterfunctionclose}
        onDismiss={() => setIsDelete(false)}
      />
    </View>
  );
};
export default McxSymbols;
