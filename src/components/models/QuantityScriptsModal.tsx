import CloseIcon from '@commonComponents/CloseIcon';
import EText from '@commonComponents/EText';
import FormInput from '@fields/FormInput';
import FormSelect from '@fields/FormSelect';
import { themeSelector } from '@reducers/theme.reducer';
import { useAppDispatch, useAppSelector } from '@store/index';
import {
  createUserSegmentBrokerageLotsEntry,
  getAllScripts,
  getUserNameList,
  updateUserSegmentBrokerageLotsEntry,
  userSelector,
} from '@store/reducers/userReducer';
import { colors } from '@themes/index';
import { toNumber } from '@utils/constant';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const QuantityScriptsModal = (props: any) => {
  const viewData = props.viewData;
  const current = useAppSelector(state => themeSelector(state, 'current'));
  const dispatch = useAppDispatch();
  const { handleSubmit, control, setValue, reset } = useForm<any>({
    mode: 'onChange',
    defaultValues: {
      userId: viewData?.userId ?? '',
      qty: viewData?.qty ?? '',
      maxQty: viewData?.maxQty ?? '',
      scriptId: viewData?.scriptId ?? '',
    },
  });
  const allScripts = useAppSelector(state => userSelector(state, 'allScripts'));
  const allUserNameList = useAppSelector(state =>
    userSelector(state, 'allUserNameList'),
  );
  React.useEffect(() => {
    dispatch(getAllScripts());
    dispatch(getUserNameList({}));
  }, []);
  useEffect(() => {
    if (viewData && viewData) {
      setValue('userId', viewData.userId);
      setValue('qty', viewData.qty);
      setValue('maxQty', viewData.maxQty);
      setValue('scriptId', viewData.scriptId);
    } else {
      reset();
    }
  }, [props]);

  const validateForm = (formData: any) => {
    let errorCount = 0;
    if (!(formData.adminId || formData.masterId || formData.userId)) {
      ++errorCount;
      Toast.show({ type: 'error', text1: `Please select User}` });
    } else if (!formData.scriptId) {
      ++errorCount;
      Toast.show({ type: 'error', text1: `Please select Script` });
    } else if (!formData.qty) {
      ++errorCount;
      Toast.show({ type: 'error', text1: `Please enter Qty` });
    } else if (!formData.maxQty) {
      ++errorCount;
      Toast.show({ type: 'error', text1: `Please enter Max Qty` });
    } else if (toNumber(formData.qty) <= 0 || toNumber(formData.maxQty) <= 0) {
      ++errorCount;
      Toast.show({ type: 'error', text1: `Please enter value greater than 0` });
    } else if (toNumber(formData.maxQty) > toNumber(formData.qty)) {
      ++errorCount;
      Toast.show({
        type: 'error',
        text1: `Max Qty can not be greater than Qty`,
      });
    }
    if (errorCount > 0) {
      return false;
    }
    return true;
  };

  const validateFromTable = (row: any) => {
    let errorCount = 0;
    if (!row.qty) {
      ++errorCount;
      Toast.show({ type: 'error', text1: `Please enter Qty` });
    } else if (toNumber(row.qty) <= 0 || toNumber(row.maxQty) <= 0) {
      ++errorCount;
      Toast.show({ type: 'error', text1: `Please enter value greater than 0` });
    } else if (!row.maxQty) {
      ++errorCount;
      Toast.show({ type: 'error', text1: `Please enter Max Qty` });
    } else if (toNumber(row.maxQty) > toNumber(row.qty)) {
      ++errorCount;
      Toast.show({
        type: 'error',
        text1: `Max Qty can not be greater than Qty`,
      });
    }
    if (errorCount > 0) {
      return false;
    }
    return true;
  };

  const onSubmit2 = async (payload: any) => {
    if (validateForm(payload)) {
      const object = {
        payload: {
          scriptId: payload.scriptId,
          userId: payload.userId,
          qty: toNumber(payload.qty),
          maxQty: toNumber(payload.maxQty),
        },
        onSuccess2,
        onError2,
      };
      dispatch(createUserSegmentBrokerageLotsEntry(object));
      setValue('qty', '');
      setValue('maxQty', '');
    }
  };
  const onSave = async (payload: any) => {
    if (validateFromTable(payload)) {
      const object = {
        payload: {
          id: viewData?.brokerageSegmentTableRowId,
          scriptId: payload.scriptId,
          userId: payload.userId,
          qty: toNumber(payload.qty),
          maxQty: toNumber(payload.maxQty),
        },
        onSuccess2,
        onError2,
      };
      await dispatch(updateUserSegmentBrokerageLotsEntry(object));
    }
  };
  const onSuccess2 = (response: any) => {
    setTimeout(() => {
      Toast.show({
        type: 'success',
        text1: response,
      });
      props.onDismiss();
    }, 1000);
  };

  const onError2 = (err: string) => {
    setTimeout(() => {
      Toast.show({
        type: 'error',
        text1: err,
      });
    }, 1000);
  };
  const onSumbit = (FormData: any) => {
    props.onFilter(FormData);
    props.onDismiss();
  };
  return (
    <View>
      <Modal isVisible={props.isVisible} onDismiss={props.onDismiss}>
        <View
          style={{
            backgroundColor: current.cardBackround,
            borderRadius: 12,
            padding: 16,
          }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <EText style={{ color: current.white, fontSize: 18 }}>
              {`${viewData && viewData ? 'Edit Quantity' : 'Add Quantity'} `}
            </EText>
            <TouchableOpacity onPress={props.onDismiss}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.boarder} />
          <View>
            <FormSelect
              control={control}
              labelKey="name"
              valueKey="id"
              name="userId"
              placeholder="User"
              type="select"
              isClearable={true}
              menuPlacement="auto"
              options={allUserNameList}
            />
            <FormSelect
              control={control}
              labelKey="name"
              valueKey="id"
              name="scriptId"
              placeholder="Script"
              type="select"
              isClearable={true}
              menuPlacement="auto"
              options={allScripts}
            />
            <FormInput
              control={control}
              placeholder={'Qty'}
              name="qty"
              keyboardType={'numeric'}
            />
            <FormInput
              control={control}
              placeholder={'Max Qty'}
              name="maxQty"
              keyboardType={'numeric'}
            />
          </View>
          <View style={styles.boarder} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={props.onDismiss}>
              <EText
                style={{
                  color: current.textOne,
                  fontSize: 14,
                  marginRight: 10,
                }}>
                cancel
              </EText>
            </TouchableOpacity>
            {viewData && (
              <TouchableOpacity
                style={{
                  backgroundColor: current.green,
                  borderRadius: 9,
                  padding: 5,
                  marginRight: 10,
                }}
                onPress={handleSubmit(onSave)}>
                <EText style={{ color: current.white, fontSize: 14 }}>
                  Save
                </EText>
              </TouchableOpacity>
            )}
            {!viewData && (
              <>
                <TouchableOpacity
                  style={{
                    backgroundColor: current.green,
                    borderRadius: 9,
                    padding: 5,
                    marginRight: 10,
                  }}
                  onPress={handleSubmit(onSumbit)}>
                  <EText style={{ color: current.white, fontSize: 14 }}>
                    Search
                  </EText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: current.red,
                    borderRadius: 9,
                    padding: 5,
                  }}
                  onPress={handleSubmit(onSubmit2)}>
                  <EText style={{ color: current.white, fontSize: 14 }}>
                    Confirm
                  </EText>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default QuantityScriptsModal;

const styles = StyleSheet.create({
  boarder: {
    borderBottomColor: colors.dark.black,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
    marginTop: 10,
  },
});
