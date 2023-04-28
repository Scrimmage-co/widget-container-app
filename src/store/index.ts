import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {appConfigSlice} from './features/appConfigSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import {PersistConfig} from 'redux-persist/es/types';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist/es/constants';
import thunk from 'redux-thunk';

const persistConfig: PersistConfig<any> = {
  key: 'store::root',
  keyPrefix: '',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
};

const reducers = {
  [appConfigSlice.name]: appConfigSlice.reducer,
};

const rootReducer = combineReducers(reducers);

export const store = configureStore({
  reducer: persistReducer(persistConfig, combineReducers(reducers)),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(thunk),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
export type RootState = ReturnType<typeof rootReducer>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
