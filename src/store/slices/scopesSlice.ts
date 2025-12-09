import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Scope } from "../../modules/models";
import { api } from "../../api";
import { mockScopes } from "../../modules/mock";
import { setAppId, setCount } from "./CalculationsDraft";
import { returnHeaderConfig } from "./userSlice";

interface ScopesState {
    searchValue: string;
    scopes: Scope[];
    loading: boolean;
    error: string | null;
}

const initialState: ScopesState = {
    searchValue: "",
    scopes: [],
    loading: false,
    error: null,
};

export const getScopesList = createAsyncThunk(
  'scopes/getScopesList',
  async (_, { getState, rejectWithValue, dispatch }) => {
    const { scopes }: any = getState();
    try {
      const response = await api.scopes.scopesList({ search: scopes.searchValue }, returnHeaderConfig());
      
      const data = response.data as any;
      
      if (data.Star_ID !== undefined) {
        dispatch(setAppId(data.Star_ID));
      }
      
      if (data.CalcCount !== undefined) {
        dispatch(setCount(data.CalcCount));
      }
      
      if (data && data.Scopes && Array.isArray(data.Scopes)) {
        return {
          scopes: data.Scopes,
        };
      } else {
        return {
          scopes: [],
        };
      }
      
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка при загрузке данных');
    }
  }
);

const scopesSlice = createSlice({
    name: "scopes",
    initialState,
    reducers: {
        setSearchValue: (state, action) => {
            state.searchValue = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getScopesList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getScopesList.fulfilled, (state, action) => {
                state.loading = false;
                state.scopes = action.payload.scopes || [];
            })
            .addCase(getScopesList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                
                const filteredScopes = mockScopes.filter((item) =>
                    item.name.toLocaleLowerCase().startsWith(state.searchValue.toLocaleLowerCase())
                );
                state.scopes = filteredScopes;
            });
    },
});

export const { 
    setSearchValue,
} = scopesSlice.actions;

export default scopesSlice.reducer;