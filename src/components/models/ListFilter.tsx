import CloseIcon from "@commonComponents/CloseIcon";
import EButton from "@commonComponents/EButton";
import EText from "@commonComponents/EText";
import { FilterButton } from "@commonComponents/FilterButton";
import { LoggedUser } from "@db/schemas/loggedUser.model";
import FormSwitchButton from "@fields/FormSwitchButton";
import FormInput from "@fields/FormInput";
import FormMultiRadio from "@fields/FormMultiRadio";
import FormSelect from "@fields/FormSelect";
import { ISegmentSummary } from "@interfaces/account.interface";
import {
  IAllScripts,
  IFilter,
  IFilterConfig,
  ISegmentScript,
  Status,
} from "@interfaces/common";
import accountService from "@services/account.service";
import commonService from "@services/common.service";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import { colors } from "@themes/index";
import { getLastNineWeeksDates } from "@utils/constant";
import { checkPermission, getOptions } from "@utils/helpers";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import { Fragment, useEffect, useState } from "react";
import React = require("react");
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import Modal from "react-native-modal";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { useQuery } from "react-query";

// import Button from './button';
// import { SelectBox } from './selectBox';

dayjs.extend(weekday);
dayjs.extend(localeData);

interface IGridFilter {
  handleChangeFilter: (e: IFilter) => void;
  config: IFilterConfig[];
  defaultValue?: IFilter;
  title: string;
  style?: ViewStyle;
}

const GridFilter = (props: IGridFilter) => {
  const userData = LoggedUser.getActiveUser(globalThis.realm);
  const [filterCard, setFilterCard] = useState(false);

  const onSubmit = async (formData: any) => {
    if (formData.pedingOrder && !formData.executedOrders) {
      formData.searchByTradeStatus = "open";
    }
    if (formData.executedOrders && !formData.pedingOrder) {
      formData.searchByTradeStatus = "completed";
    }
    if (formData.pedingOrder && formData.executedOrders) {
      formData.searchByTradeStatus = "completedAndopen";
    }
    if (props.handleChangeFilter) {
      props.handleChangeFilter(formData as IFilter);
      setFilterCard(false);
    }
  };

  const current = useAppSelector((state) => themeSelector(state, "current"));

  const { control, handleSubmit, watch, setValue, reset } = useForm<{
    userId: number | undefined;
    masterId: number | undefined;
    adminId: number | undefined;
    brokerId: number | undefined;
    segmentId: number | undefined;
    fromDate: Date;
    toDate: Date;
    tradeDate: string;
    status: Status;
    valanId: string;
    startDate: string | undefined;
    endDate: string | undefined;
    pedingOrder: string;
    executedOrders: string;
  }>({
    defaultValues: {
      adminId: props.defaultValue?.adminId
        ? props.defaultValue?.adminId
        : undefined,
      brokerId: props.defaultValue?.brokerId
        ? props.defaultValue?.brokerId
        : undefined,
      userId: props.defaultValue?.userId
        ? props.defaultValue?.userId
        : undefined,
      masterId: props.defaultValue?.masterId
        ? props.defaultValue?.masterId
        : undefined,
      segmentId: props.defaultValue?.segmentId
        ? props.defaultValue?.segmentId
        : undefined,
      status: props.defaultValue?.status
        ? props.defaultValue?.status
        : undefined,
      startDate: props.defaultValue?.startDate
        ? props.defaultValue?.startDate
        : undefined,
      endDate: props.defaultValue?.endDate
        ? props.defaultValue?.endDate
        : undefined,
      valanId: props.defaultValue?.valanId
        ? props.defaultValue?.valanId
        : undefined,
    },
    mode: "onBlur",
  });

  const valanId = watch("valanId");

  useEffect(() => {
    if (valanId) {
      const data = getLastNineWeeksDates().find((e) => e.date === valanId);
      setValue("startDate", new Date(data?.start_date));
      setValue("endDate", new Date(data?.end_date));
    }
  }, [valanId]);

  const isFieldEnable = (field: string) => {
    return props?.config?.some((item: IFilterConfig) => item.name === field);
  };

  const { data: adminList }: any = useQuery(
    ["adminList"],
    async () => {
      return commonService.getAdminNameList();
    },
    {
      enabled: isFieldEnable("adminId"),
    }
  );
  const { data: masterList }: any = useQuery(
    ["masterList"],
    async () => {
      return commonService.getMasterNameList();
    },
    {
      enabled: isFieldEnable("masterId"),
    }
  );

  const { data: brokerList }: { data: any } = useQuery(
    ["brokerList"],
    async () => {
      return commonService.getBrokerNameList();
    },
    {
      enabled: isFieldEnable("brokerId"),
    }
  );

  const { data: clientList }: any = useQuery(
    ["clientList"],
    async () => {
      return commonService.getUserNameList();
    },
    {
      enabled: isFieldEnable("userId"),
    }
  );

  const { data: segmentList }: any = useQuery(
    ["segmentList"],
    async () => {
      if (
        userData &&
        userData.role &&
        userData.role.slug &&
        userData.role.slug === "user"
      ) {
        return {
          data: {
            data: userData?.segments.map(
              (e: { segment: ISegmentSummary }) => e.segment
            ),
          },
        };
      }
      return accountService.getSegments();
    },
    {
      enabled: isFieldEnable("segmentId"),
    }
  );
  const [allScriptList, setAllScriptList] = useState<IAllScripts[]>([]);
  const [segmentId, setSegmentId] = useState<number>();

  useEffect(() => {
    if (
      segmentList &&
      segmentList.data &&
      segmentList.data.data &&
      segmentList.data.data.length > 0 &&
      segmentList.data.data[0].id
    ) {
      setValue("segmentId", segmentList.data.data[0].id);

      setSegmentId(segmentList.data.data[0].id);

    }
  }, [segmentList]);

  useEffect(() => {
    if (segmentId) {
      commonService
        .getSegmentsDataById(segmentId)
        .then((e: any) => {
          let data = [];
          (data = e?.data?.data.scripts.map((ee: ISegmentScript) => {
            return {
              id: ee.scriptId,
              name: ee.script.name,
            };
          })),
            setAllScriptList(data as any[]);
        })
        .catch((error: any) => {
          console.error(error);
        });
    } else {
      commonService
        .getSegmentsDataById(1)
        .then((e: any) => {
          let data = [];
          (data = e?.data?.data.scripts.map((ee: ISegmentScript) => {
            return {
              id: ee.scriptId,
              name: ee.script.name,
            };
          })),
            setAllScriptList(data as any[]);
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
  }, [segmentId]);

  const CommonSelect = (props: any) => {
    return (
      <FormSelect
        control={control}
        labelKey="label"
        label={props.label}
        isClearable={props.clearable ? true : false}
        valueKey="value"
        type="select"
        menuPlacement="auto"
        name={props.name}
        options={props.options}
        textTransform={props.name === "segmentId" ? 'uppercase' : 'none'}
        onValueChange={(e: any) => {
          if (props.name === "segmentId") {
            if (e) {
              setSegmentId(e.value);
            } else {
              setSegmentId(undefined);
            }
          }
        }}
      />
    );
  };

  const CommonInput = (props: any) => {
    return (
      <View style={{ marginBottom: -10, marginTop: -10 }}>
        <FormInput
          label={props.label}
          control={control}
          type={props.type}
          name={props.name}
          max={props.max}
          maximumDate={props.maximumDate}
        />
      </View>
    );
  };

  const CommonRadio = (props: any) => {
    return (
      <FormMultiRadio
        noLabelClassName="gap-0"
        name={props.name}
        label={props.label}
        control={control}
        direction={"row"}
        type="radio"
        options={props.options}
        labelKey="label"
        valueKey="value"
      />
    );
  };
  const CommonCheckbox = (props: any) => {
    return (
      <FormSwitchButton
        control={control}
        type="checkbox"
        name={props.name}
        label={props.label}
      />
    );
  };

  const selectItems = {
    brokerId: {
      options: getOptions(brokerList?.data?.data, "id", "name", 1),
    },
    masterId: {
      options: getOptions(masterList?.data?.data, "id", "name", 2),
    },
    adminId: {
      options: getOptions(adminList?.data?.data, "id", "name", 3),
    },
    valanId: {
      options: getLastNineWeeksDates().map((item) => {
        return { label: item.date, value: item.date };
      }),
    },
    status: {
      options: [
        {
          label: "Enabled",
          value: "active",
        },
        {
          label: "Disabled",
          value: "inActive",
        },
      ],
    },
    all: {
      options: [
        { value: "all", label: "ALL" },
        { value: "outstanding", label: "OUTSTANDING" },
      ],
    },
    all1: {
      options: [
        {
          label: "CLIENT W",
          value: "active",
        },
        {
          label: "SCRIPT W",
          value: "inActive",
        },
      ],
    },
    approvedStatus: {
      options: [
        {
          label: "Approved",
          value: "approved",
        },
        {
          label: "Pending",
          value: "pending",
        },
        {
          label: "Rejected",
          value: "rejected",
        },
      ],
    },
    paymentStatus: {
      options: [
        {
          label: "Completed",
          value: "completed",
        },
        {
          label: "In Progress",
          value: "inProgress",
        },
        {
          label: "Pending",
          value: "pending",
        },
      ],
    },
    paymentMethod: {
      options: [
        {
          label: "Bank",
          value: "bank",
        },
        {
          label: "UPI",
          value: "upiId",
        },
        {
          label: "QR-Code",
          value: "qrCode",
        },
      ],
    },
    withdrawalType: {
      options: [
        {
          label: "Bank",
          value: "bank",
        },
        {
          label: "UPI",
          value: "upiId",
        },
      ],
    },
    userId: {
      options: getOptions(clientList?.data?.data, "id", "name", 4),
    },
    segmentId: {
      options: getOptions(segmentList?.data?.data, "id", "name", 5),
    },
    scriptId: {
      options: getOptions(allScriptList, "id", "name", 6),
    },
    userType: {
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "Master",
          value: "master",
        },
        {
          label: "Broker",
          value: "broker",
        },
        {
          label: "User",
          value: "user",
        },
      ],
    },
    tradePositionSubType: {
      options: [
        {
          label: "BUY LIMIT",
          value: "buy limit",
        },
        {
          label: "SELL LIMIT",
          value: "sell limit",
        },
        {
          label: "CF",
          value: "cf",
        },
        {
          label: "BF",
          value: "bf",
        },
        {
          label: "EXIT AUTO SQUARE",
          value: "exit auto square",
        },
        {
          label: "EXIT POSITION",
          value: "exit position",
        },
        {
          label: "MARKET",
          value: "market",
        },
      ],
    },
  };

  const renderComponent = (item: IFilterConfig, index: number) => {
    switch (item.type) {
      case "select":
        const data = selectItems[item.name as keyof typeof selectItems];
        return (
          <CommonSelect
            name={item.name}
            options={data.options}
            label={item.label}
            clearable={item.clearable}
            key={index}
          />
        );
      case "text":
        return (
          <CommonInput
            name={item.name}
            label={item.label}
            type={item.type}
            key={index}
          />
        );
      case "date":
        return (
          <CommonInput
            name={item.name}
            label={item.label}
            type={item.type}
            key={index}
            maximumDate={item.maximumDate}
          />
        );
      case "radio":
        const dataRadio = selectItems[item.name as keyof typeof selectItems];
        return (
          <CommonRadio
            name={item.name}
            options={dataRadio.options}
            label={item.label}
            type={item.type}
            key={index}
          />
        );
      case "checkbox":
        return (
          <CommonCheckbox name={item.name} label={item.label} key={index} />
        );

      default:
        break;
    }
  };

  const onClose = () => {
    setFilterCard(false);
  };

  return (
    <Fragment>
      <FilterButton
        onPress={() => setFilterCard(!filterCard)}
        style={props.style}
      />
      <Modal
        isVisible={filterCard}
        onDismiss={onClose}
        onBackdropPress={onClose}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View
          style={{
            backgroundColor: current.cardBackround,
            borderRadius: 12,
            padding: 20,
            maxHeight: '70%'
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <EText type='s16'>{props.title}</EText>
            <TouchableOpacity onPress={onClose}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.boarder} />
          <ScrollView>
            {props &&
              checkPermission(props.config).map(
                (item: IFilterConfig, index: number) => {
                  return (
                    <View style={{ marginBottom: 12 }}>
                      {renderComponent(item, index)}
                    </View>
                  );
                }
              )}
          </ScrollView>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              // borderBottomWidth: StyleSheet.hairlineWidth,
              backgroundColor: current.backgroundColor,
              marginVertical: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <EButton
                title={"CLEAR"}
                type="b16"
                bgColor={current.red}
                onPress={() => {
                  reset({});
                  props.handleChangeFilter &&
                    props.handleChangeFilter({ userId: undefined });
                }}
                borderRadius={6}
                height={40}
              />
            </View>
            <View style={{ flex: 1 }}>
              <EButton
                onPress={handleSubmit(onSubmit)}
                title="APPLY"
                bgColor={current.green}
                type="b16"
                borderRadius={6}
                height={40}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Fragment>
  );
};

export default GridFilter;

const styles = StyleSheet.create({
  boarder: {
    borderBottomColor: colors.dark.black,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
    marginTop: 10,
  },
});
