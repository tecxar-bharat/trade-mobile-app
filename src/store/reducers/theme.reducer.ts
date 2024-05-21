import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IColor, colors } from '@themes/index';
import { RootState } from '../index';
import { setAsyncStorageData } from '@utils/helpers';
import { THEME } from '@common/constants';

interface State {
  current: IColor;
}

const initialState: State = {
  current: colors.light,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeThemeAction: (state: State, action: PayloadAction<IColor>) => {
      setAsyncStorageData(THEME, action.payload.value);
      return { ...state, current: action.payload };
    },
  },
});

export const themeReducer = themeSlice.reducer;
export const themeSelector = (state: RootState, name: string) =>
  state.theme[name as keyof typeof state.theme];
export const { changeThemeAction } = themeSlice.actions;
