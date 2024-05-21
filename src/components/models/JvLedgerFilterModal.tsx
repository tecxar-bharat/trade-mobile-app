import CloseIcon from '@commonComponents/CloseIcon';
import EText from '@commonComponents/EText';
import FormInput from '@fields/FormInput';
import FormSelect from '@fields/FormSelect';
import { authSelector } from '@reducers/auth.reducer';
import {
  clearMasterList,
  getMasterNameList,
  masterSelector,
} from '@reducers/masterReducer';
import { themeSelector } from '@reducers/theme.reducer';
import {
  clearUserList,
  getUserNameList,
  userSelector,
} from '@reducers/userReducer';
import { useAppDispatch, useAppSelector } from '@store/index';
import { adminSelector } from '@store/reducers/adminReducer';
import { colors } from '@themes/index';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
const JvLedgerFilterModal = (props: any) => {
  const current = useAppSelector(state => themeSelector(state, 'current'));
  const allUserNameList = useAppSelector(state =>
    userSelector(state, 'allUserNameList'),
  );
  const allMasterNameList = useAppSelector(state =>
    masterSelector(state, 'allMasterNameList'),
  );
  const allAdminNameList = useAppSelector(state =>
    adminSelector(state, 'allAdminNameList'),
  );
  const userData = useAppSelector(state => authSelector(state, 'userData'));
  const dispatch = useAppDispatch();

  const { handleSubmit, control, reset, setValue } = useForm<any>({
    defaultValues: {},
    mode: 'onChange',
  });

  const onSumbit = (FormData: any) => {
    props.onFilter(FormData);
    props.onDismiss();
  };
  const onClear = () => {
    reset();
    setValue('adminId', '');
    setValue('masterId', '');
    setValue('userId', '');
    setValue('startDate', '');
    setValue('endDate', '');
    props.onFilter();
  };
  useEffect(() => {
    if (userData?.role.slug === 'admin') {
      dispatch(getMasterNameList({}));
    }
  }, [userData]);
  useEffect(() => {
    if (userData?.role.slug === 'master') {
      dispatch(getUserNameList({}));
    }
  }, [userData]);
  return (
    <View>
      <Modal isVisible={props.visible} onDismiss={props.onDismiss}>
        <View
          style={{
            backgroundColor: current.cardBackround,
            borderRadius: 12,
            padding: 16,
          }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <EText style={{ color: current.white, fontSize: 16 }}>
              {props.title}
            </EText>
            <TouchableOpacity onPress={props.onDismiss}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.boarder} />
          {userData?.role?.slug === 'superadmin' && (
            <FormSelect
              control={control}
              labelKey="name"
              valueKey="id"
              name="adminId"
              placeholder="Admin"
              type="select"
              isClearable={true}
              menuPlacement="auto"
              onValueChange={(Val: any) => {
                setValue('userId', undefined);
                setValue('masterId', undefined);
                if (Val) {
                  dispatch(getMasterNameList({ userId: Val.id }));
                } else {
                  dispatch(clearMasterList());
                  dispatch(clearUserList());
                }
              }}
              options={allAdminNameList}
            />
          )}
          {['superadmin', 'admin'].includes(userData?.role?.slug) && (
            <FormSelect
              control={control}
              labelKey="name"
              valueKey="id"
              name="masterId"
              placeholder="Master"
              type="select"
              isClearable={true}
              menuPlacement="auto"
              onValueChange={(Val: any) => {
                setValue('userId', undefined);
                if (Val) {
                  dispatch(getUserNameList({ userId: Val.id }));
                } else {
                  dispatch(clearUserList());
                }
              }}
              options={allMasterNameList}
            />
          )}

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
          <FormInput
            control={control}
            name="startDate"
            type="date"
            keyBoardType={'default'}
          />
          <FormInput
            control={control}
            name="endDate"
            type="date"
            keyBoardType={'default'}
          />
          <View style={styles.boarder} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={handleSubmit(onClear)}>
              <EText
                style={{
                  color: current.textOne,
                  fontSize: 14,
                  marginRight: 10,
                }}>
                Reset
              </EText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: current.red,
                borderRadius: 9,
                padding: 5,
              }}
              onPress={handleSubmit(onSumbit)}>
              <EText style={{ color: current.white, fontSize: 14 }}>
                Confirm
              </EText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default JvLedgerFilterModal;

const styles = StyleSheet.create({
  boarder: {
    borderBottomColor: colors.dark.black,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
    marginTop: 10,
  },
});
