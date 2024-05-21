import EHeader from "@commonComponents/EHeader";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import config from "@config/index";
import { useRoute } from "@react-navigation/native";
import ledgerService from "@services/ledger.service";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import { formatIndianAmount, pdfFunction } from "@utils/helpers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
const LedgerBroker = (props: any) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const { id, name, userId } = route?.params;

  useEffect(() => {
    ledgerService
      .ledgerModel(id)
      .then((e) => {
        setRowData(e.data.data.rows);
      })
      .catch(() => {});
  }, [id]);

  const onRefresh = () => {
    setLoading(true);
    ledgerService
      .ledgerModel(id)
      .then((e) => {
        setRowData(e.data.data.rows);
      })
      .catch(() => {});
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor1 }}>
      <EHeader title={`${name} (${userId})`} />

      <View
        style={{
          flex: 1,
          backgroundColor: current.backgroundColor,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}
      >
        <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 5 }}>
          <FlatList
            data={rowData}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            renderItem={({ item }: any) => {
              return (
                <View
                  style={{
                    backgroundColor: current.backgroundColor,
                    padding: 8,
                    borderBottomWidth: 1,
                    borderColor:
                      current.value === "dark"
                        ? current.bcolor
                        : current.bcolor,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        alignItems: "flex-start",
                        marginRight: 10,
                      }}
                    >
                      {item?.credit > 0 && (
                        <View style={{ flexDirection: "row" }}>
                          <EText type="r14" color={current.greyText}>
                            Credit:
                          </EText>
                          <EText type="r14" color={current.textColor}>
                            {formatIndianAmount(item?.credit)}
                          </EText>
                        </View>
                      )}
                      {item?.debit > 0 && (
                        <View style={{ flexDirection: "row" }}>
                          <EText type="r14" color={current.greyText}>
                            Debit:
                          </EText>
                          <EText type="r14" color={current.textColor}>
                            {formatIndianAmount(item?.debit)}
                          </EText>
                        </View>
                      )}
                      {item.description && (
                        <EText
                          type="r12"
                          color={current.greyDark}
                          style={{ marginTop: 4 }}
                        >
                          {item.description}
                        </EText>
                      )}
                    </View>
                    <View
                      style={{
                        flex: 1,
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                      }}
                    >
                      <EText
                        type="b16"
                        color={current.textColor}
                        style={{ padding: 2 }}
                      >
                        {formatIndianAmount(item?.balance)}
                      </EText>
                      {item?.valanId && (
                        <TouchableOpacity
                          onPress={() => {
                            pdfFunction(
                              `${config.baseUrl}/valans/${item.valanId}`,
                              item.description,
                              props.navigation,
                              `${item.user.user_id}_${moment(
                                item.valan.startDate,
                                "YYYY-MM-DD"
                              ).format("DD-MMM")}_${moment(
                                item.valan.endDate,
                                "YYYY-MM-DD"
                              ).format("DD-MMM")}_ledger`
                            );
                          }}
                        >
                          <MaterialIcons
                            name={"picture-as-pdf"}
                            color={current?.primary}
                            size={26}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={
              <ListEmptyComponent message="There are no ledgers" />
            }
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={onRefresh} />
            }
          />
        </View>
      </View>
    </View>
  );
};
export default LedgerBroker;
