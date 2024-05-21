import images from "@assets/images";
import { getHeight } from "@common/constants";
import EButton from "@commonComponents/EButton";
import EHeader from "@commonComponents/EHeader";
import FormSelect from "@fields/FormSelect";
import {
  IAllScripts,
  IExpiry,
  ISegmentScript,
  ISegmentSummary,
  IStrikePrice,
  InstrumentQuery,
} from "@interfaces/account.interface";
import accountService from "@services/account.service";
import commonService from "@services/common.service";
import instrumentService from "@services/instrument.service";
import { useAppDispatch, useAppSelector } from "@store/index";
import { authSelector } from "@store/reducers/auth.reducer";
import { socketActions } from "@store/reducers/socketReducer";
import { themeSelector } from "@store/reducers/theme.reducer";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Image, View } from "react-native";
import Toast from "react-native-toast-message";

const Script = (props: any) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const userData = useAppSelector((state) => authSelector(state, "userData"));
  const [segments, setSegements] = useState<ISegmentSummary[]>([]);
  const [allSegmentList, setAllSegmentList] = useState<ISegmentSummary[]>([]);
  const [allScriptList, setAllScriptList] = useState<IAllScripts[]>([]);
  const [strikePrices, setStrikePrices] = useState<IStrikePrice[]>([]);
  const [expiryLoading, setExpiryLoading] = useState<boolean>(false);
  const [strikePriceLoading, setStrikePriceLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expiry, setExpiry] = useState<IExpiry[]>([]);
  const dispatch = useAppDispatch();
  const { control, handleSubmit, watch, setValue, reset, resetField } =
    useForm<InstrumentQuery>({
      defaultValues: {
        segmentId: undefined,
      },
      mode: "all",
    });
  const selectedSegmentId = watch("segmentId");
  const selectedScriptId = watch("scriptId");
  const selectedExpiry = watch("expiry");

  useEffect(() => {
    if (segments && segments.length > 0 && segments[0] && segments[0].id) {
      setValue("segmentId", segments[0].id);
    }
  }, [segments]);
  useEffect(() => {
    if (expiry && expiry.length > 0 && expiry[0] && expiry[0].expiry) {
      setValue("expiry", expiry[0].expiry);
    } else {
      setValue("expiry", undefined);
    }
  }, [expiry]);

  useEffect(() => {
    setValue("scriptId", undefined);
    setValue("expiry", undefined);
    setValue("optionType", undefined);
    setValue("strikePrice", undefined);
    if (selectedSegmentId) {
      commonService
        .getSegmentsDataById(selectedSegmentId)
        .then((e: any) => {
          let data = [];
          (data = e.data.data.scripts.map((e: ISegmentScript) => {
            return {
              id: e.scriptId,
              name: e.script.name,
            };
          })),
            setAllScriptList(data as IAllScripts[]);
        })
        .catch(() => { });
    } else {
      setAllScriptList([]);
    }
  }, [selectedSegmentId]);
  useEffect(() => {
    setValue("expiry", undefined);
    setValue("optionType", undefined);
    setValue("strikePrice", undefined);
    if (selectedScriptId) {
      setExpiryLoading(true);
      instrumentService
        .getExpiryDates(selectedSegmentId, selectedScriptId)
        .then((res) => {
          setExpiry(res.data.data as IExpiry[]);
          setExpiryLoading(false);
        })
        .catch(() => {
          setExpiryLoading(true);
        });
    } else {
      setExpiry([]);
    }
  }, [selectedScriptId]);
  useEffect(() => {
    if (selectedSegmentId == 2) {
      if (selectedSegmentId > 0 && selectedExpiry != "") {
        setStrikePriceLoading(true);
        setValue("strikePrice", undefined);
        instrumentService
          .getStrikePrices(selectedSegmentId, selectedScriptId, selectedExpiry)
          .then((res) => {
            setStrikePrices(
              res.data.data.map((e: IStrikePrice) => {
                return { value: e.strikePrice, label: `${e.strikePrice}` };
              }) as IStrikePrice[]
            );
            setStrikePriceLoading(false);
          })
          .catch(() => {
            setStrikePriceLoading(true);
          });
      }
    }
  }, [selectedExpiry]);

  useEffect(() => {
    accountService
      .getSegments()
      .then((e) => {
        setAllSegmentList(e.data.data as ISegmentSummary[]);
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (userData && allSegmentList.length > 0) {
      if (
        userData.role &&
        userData.role.slug &&
        userData.role.slug === "user"
      ) {
        setSegements(
          userData.segments.map((e: { segment: ISegmentSummary }) => e.segment)
        );
      } else {
        setSegements(allSegmentList);
      }
    }
  }, [userData, allSegmentList]);

  const onSubmit = async (payload: any) => {
    setIsLoading(true);
    instrumentService
      .getIdentifier(payload)
      .then((res) => {
        if (res.data?.statusCode === 200 || res.data?.statusCode === 201) {
          const sortName = res?.data?.data.identifier.split("_");
          Toast.show({ type: "success", text1: `Script ${sortName[1]} Added` });
          props.navigation.goBack();
        } else {
          Toast.show({ type: "error", text1: "Unable to add Symbol" });
        }
        dispatch(
          socketActions.subscribe({
            Exchange: selectedSegmentId == 3 ? "MCX" : "NFO",
            InstrumentIdentifier: res?.data?.data.identifier,
          })
        );
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: current.backgroundColor1,
      }}
    >
      <EHeader title="Script Add" />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 10,
          backgroundColor: current.backgroundColor,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <FormSelect
          control={control}
          labelKey="name"
          valueKey="id"
          placeholder="Select Segment"
          type="select"
          menuPlacement="auto"
          name="segmentId"
          options={segments}
          label={"Segment"}
          marginTop={10}
          textTransform='uppercase'
        />
        <FormSelect
          control={control}
          labelKey="name"
          valueKey="id"
          placeholder="Select Script"
          type="select"
          menuPlacement="auto"
          name="scriptId"
          options={allScriptList}
          label={"Script"}
          marginTop={10}
        />
        <FormSelect
          control={control}
          labelKey="expiry"
          valueKey="expiry"
          placeholder="Select Expiry"
          type="select"
          menuPlacement="auto"
          name="expiry"
          options={expiry}
          label={"Expiry"}
          marginTop={10}
        />
        <FormSelect
          control={control}
          labelKey="name"
          disabled={selectedSegmentId !== 2}
          valueKey="id"
          placeholder="Select CE/PE"
          type="select"
          menuPlacement="auto"
          name="optionType"
          label={"CE/PE"}
          options={[
            { id: "CE", name: "Call" },
            { id: "PE", name: "Put" },
          ]}
          marginTop={10}
        />
        <FormSelect
          control={control}
          disabled={selectedSegmentId !== 2}
          labelKey="label"
          valueKey="value"
          placeholder="Select Strike"
          type="select"
          menuPlacement="auto"
          label={"Strike"}
          name="strikePrice"
          options={strikePrices}
          marginTop={10}
        />
      </View>
      <View
        style={{
          paddingHorizontal: 10,
          backgroundColor: current.backgroundColor,
          paddingVertical: 10,
        }}
      >
        <EButton
          title={"ADD"}
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          bgColor={current.primary}
        />
      </View>
    </View>
  );
};
export default Script;
