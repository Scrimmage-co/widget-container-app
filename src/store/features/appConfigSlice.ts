import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface RewarderKey {
  name: string;
  key: string;
}

export interface AppConfigState {
  token?: string;
  privateKeys: RewarderKey[];
  userId?: string;
  serverUrl?: string;
  showDebugActions?: boolean;
}

const initialState: AppConfigState = {
  token: undefined,
  privateKeys: [],
  userId: undefined,
  serverUrl: undefined,
  showDebugActions: false,
};

export const appConfigSlice = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {
    setRewarderKeys: (state, action: PayloadAction<RewarderKey[]>) => {
      state.privateKeys = action.payload;
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
  },
});

// Action creators are generated for each case reducer function
export const {
  setRewarderKeys,
  setToken,
  setUserId,
  setServerUrl,
  showDebugActions,
} = appConfigSlice.actions;

export default appConfigSlice.reducer;
