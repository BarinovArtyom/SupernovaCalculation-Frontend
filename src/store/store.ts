import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './slices/filtersSlice';
import scopesReducer from './slices/scopesSlice';

const store = configureStore({
    reducer: {
        filters: filtersReducer,
        scopes: scopesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;