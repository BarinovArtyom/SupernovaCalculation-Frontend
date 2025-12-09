import { combineReducers, configureStore } from '@reduxjs/toolkit';
import scopesReducer from './slices/scopesSlice';
import userReducer from './slices/userSlice'; 
import vacancyApplicationDraftReducer from './slices/CalculationsDraft';
import registrationReducer from './slices/registrationSlice';


const rootReducer = combineReducers({
    scopes: scopesReducer,
    user: userReducer,       
    vacancyApplicationDraft: vacancyApplicationDraftReducer, 
    registration: registrationReducer,
});

export const store = configureStore({
    reducer: rootReducer,
});

export default store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof configureStore>;
export type AppDispatch = typeof store.dispatch;