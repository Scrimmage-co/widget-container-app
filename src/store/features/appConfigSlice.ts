import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface AppConfigState {
  token?: string;
  rewarderKeys: string[];
  userId?: string;
}

const initialState: AppConfigState = {
  token: undefined,
  rewarderKeys: [],
  userId: undefined,
};

export const appConfigSlice = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {
    setRewarderKeys: (state, action: PayloadAction<string[]>) => {
      state.rewarderKeys = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setRewarderKeys, setToken, setUserId} = appConfigSlice.actions;

export default appConfigSlice.reducer;
