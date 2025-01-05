'use client';

import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import { combineReducers } from 'redux';
import userReducer from './slices/userSlice';
import mentorReducer from './slices/mentorSlice';

// Configure persistence
const persistConfig = {
  key: 'root',
  storage,
};

// Combine reducers (for scalability)
const rootReducer = combineReducers({
  user: userReducer,
  mentor: mentorReducer
});

// Wrap reducers with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist to work properly
    }),
});

// Types for store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export default store;

