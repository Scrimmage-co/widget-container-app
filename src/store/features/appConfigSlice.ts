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
}

const initialState: AppConfigState = {
  token: undefined,
  privateKeys: [],
  userId: undefined,
  serverUrl: undefined,
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
  },
});

// Action creators are generated for each case reducer function
export const {setRewarderKeys, setToken, setUserId, setServerUrl} =
  appConfigSlice.actions;

export default appConfigSlice.reducer;
