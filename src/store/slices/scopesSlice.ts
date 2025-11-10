import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Scope } from "../../modules/models";

interface ScopesState {
    scopes: Scope[];
    loading: boolean;
    error: string | null;
    starId: number;
    calcCount: number;
}

const initialState: ScopesState = {
    scopes: [],
    loading: false,
    error: null,
    starId: 1,
    calcCount: 0,
};

const scopesSlice = createSlice({
    name: "scopes",
    initialState,
    reducers: {
        setScopes: (state, action: PayloadAction<Scope[]>) => {
            state.scopes = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setStarId: (state, action: PayloadAction<number>) => {
            state.starId = action.payload;
        },
        setCalcCount: (state, action: PayloadAction<number>) => {
            state.calcCount = action.payload;
        },
        incrementCalcCount: (state) => {
            state.calcCount += 1;
        },
    },
});

export const { 
    setScopes, 
    setLoading, 
    setError, 
    setStarId, 
    setCalcCount, 
    incrementCalcCount 
} = scopesSlice.actions;

export default scopesSlice.reducer;