import {
  AnyAction,
  AsyncThunk,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import announcementService from '@services/announcement.service';
import { RootState } from '@store/index';
import { toNumber } from '@utils/constant';

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;

export const createAnnouncement = createAsyncThunk(
  `announcement/create`,
  async (object: any) => {
    try {
      const { data } = await announcementService.createAnnouncement(
        object.payload,
      );
      return {
        data,
        onSuccess: object.onSuccess,
        onError: object.onError,
      };
    } catch (error: any) {
      if (error?.response?.data?.message) {
        object.onError(error?.response?.data?.message);
      }
      throw error;
    }
  },
);

export const getAnnouncements = createAsyncThunk(
  `announcement/get`,
  async () => {
    const { data } = await announcementService.getAnnouncements();
    return data;
  },
);
export const getAnnouncementsByCategory = createAsyncThunk(
  `announcementsByCategory/get`,
  async (category: string) => {
    const { data } = await announcementService.getAnnouncementsByCategory(
      category,
    );
    return { data, category };
  },
);

export const updateAnnouncementById = createAsyncThunk(
  `announcement/update`,
  async (object: any) => {
    const id = toNumber(object.payload.id);
    const { data } = await announcementService.updateAnnouncementById(
      id,
      object.payload,
    );
    return { data, onSuccess: object.onSuccess, onError: object.onError };
  },
);

export const deleteAnnouncementById = createAsyncThunk(
  `announcement/delete`,
  async (object: any) => {
    try {
      const res: any = await announcementService.deleteAnnouncementById(
        object.deleteId,
      );
      return {
        data: res.data,
        onSuccess: object.onSuccess,
        onError: object.onError,
      };
    } catch (error: any) {
      if (error?.response?.message) {
        object.onError(error?.response?.message);
      }
      throw error;
    }
  },
);

interface State {
  loading: boolean;

  announcementList: any;
  outerAnnouncement: null | {
    id: number;
    message: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
  };
  innerAnnouncement: null | {
    id: number;
    message: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
  };
  announcement: { message: string; category: string };
}
const initialState: State = {
  announcementList: [],
  outerAnnouncement: null,
  innerAnnouncement: null,
  loading: false,
  announcement: {
    message: '',
    category: '',
  },
};

const isPendingAction = (action: AnyAction): action is PendingAction =>
  action.type.startsWith(announcementSlice.name) &&
  action.type.endsWith('/pending');
const isRejectedAction = (action: AnyAction): action is RejectedAction =>
  action.type.startsWith(announcementSlice.name) &&
  action.type.endsWith('/rejected');

const announcementSlice = createSlice({
  name: 'announcement',
  initialState,
  reducers: {
    socketGetAnnouncement: (
      state: State,
      action: PayloadAction<{ message: string; category: string }>,
    ) => {
      return {
        ...state,
        announcement: action.payload,
      };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        if (
          action.payload.data.statusCode === 200 ||
          action.payload.data.statusCode === 201
        ) {
          action.payload.onSuccess(action.payload.data.message);
          state.loading = false;
        } else {
          action.payload.onError(action.payload.data.message);
          state.loading = false;
        }
      })
      .addCase(getAnnouncements.fulfilled, (state, action) => {
        if (
          action.payload.statusCode === 200 ||
          action.payload.statusCode === 201
        ) {
          state.loading = false;
          state.announcementList = action.payload.data;
        } else {
          state.loading = false;
          state.announcementList = initialState.announcementList;
        }
      })
      .addCase(getAnnouncementsByCategory.fulfilled, (state, action) => {
        if (
          action.payload.data.statusCode === 200 ||
          action.payload.data.statusCode === 201
        ) {
          if (action.payload.data.data.category === 'outer') {
            state.loading = false;
            state.outerAnnouncement = action.payload.data.data;
          } else if (action.payload.data.data.category === 'inner') {
            state.loading = false;
            state.innerAnnouncement = action.payload.data.data;
          }
        } else {
          state.loading = false;
          state.outerAnnouncement = initialState.outerAnnouncement;
          state.innerAnnouncement = initialState.innerAnnouncement;
        }
      })
      .addCase(updateAnnouncementById.fulfilled, (state, action) => {
        if (
          action.payload.data.statusCode === 200 ||
          action.payload.data.statusCode === 201
        ) {
          action.payload.onSuccess(action.payload.data.message);
          state.loading = false;
        } else {
          action.payload.onError(action.payload.data.message);
          state.loading = false;
        }
      })

      .addCase(deleteAnnouncementById.fulfilled, (state, action) => {
        if (
          action.payload.data.statusCode === 200 ||
          action.payload.data.statusCode === 201
        ) {
          action.payload.onSuccess(action.payload.data.message);
          state.loading = false;
        } else {
          action.payload.onError(action.payload.data.message);
          state.loading = false;
        }
      })
      .addMatcher(isPendingAction, state => {
        state.loading = true;
      })
      .addMatcher(isRejectedAction, state => {
        state.loading = false;
      });
  },
});

export const announcementReducer = announcementSlice.reducer;
export const announcementSelector = (state: RootState, name: string) =>
  state.announcement[name as keyof typeof state.announcement];
export const { socketGetAnnouncement } = announcementSlice.actions;
