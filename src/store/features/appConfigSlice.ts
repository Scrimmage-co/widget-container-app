import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface AppConfigState {
  token?: string;
  privateKey?: string;
  userId?: string;
  serverUrl?: string;
  namespace?: string;
  userTags?: string[];
  showDebugActions?: boolean;
}

const initialState: AppConfigState = {
  token: undefined,
  privateKey: undefined,
  userId: undefined,
  serverUrl: undefined,
  namespace: undefined,
  userTags: undefined,
  showDebugActions: false,
};

export const appConfigSlice = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {
    setRewarderKey: (state, action: PayloadAction<string>) => {
      state.privateKey = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setServerUrl: (state, action: PayloadAction<string>) => {
      state.serverUrl = action.payload;
    },
    showDebugActions: (state, action: PayloadAction<boolean>) => {
      state.showDebugActions = action.payload;
    },
    setNamespace: (state, action: PayloadAction<string>) => {
      state.namespace = action.payload;
    },
    setUserTags: (state, action: PayloadAction<string[]>) => {
      state.userTags = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setRewarderKey,
  setToken,
  setUserId,
  setServerUrl,
  showDebugActions,
  setNamespace,
  setUserTags,
} = appConfigSlice.actions;

export default appConfigSlice.reducer;
