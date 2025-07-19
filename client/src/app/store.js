import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer'; // or wherever your slices are combined

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,     // disable deep state immutability check
      serializableCheck: false,  // disable serializable check if needed
    }),
});
