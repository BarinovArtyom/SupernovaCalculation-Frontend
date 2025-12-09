import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from "../../api";
import { returnHeaderConfig } from "./userSlice";

interface Calc {
  inp_dist?: number;
  inp_mass?: number;
  inp_texp?: number;
  res_en?: number;
  res_ni?: number;
  scope_id?: number;
  star_id?: number;
}

interface Scope {
  id?: number;
  delta_lamb?: number;
  description?: string;
  filter?: string;
  img_link?: string;
  lambda?: number;
  name?: string;
  status?: boolean;
  zero_point?: number;
}

interface ScopeWithCalc {
  scope: Scope;
  calc?: Calc;
  count?: number;
}

interface StarData {
  name?: string | null;
  constellation?: string | null;
}

interface CalculationDraft {
  app_id?: number;
  count: number | undefined;
  scopes: ScopeWithCalc[];
  starData: StarData;
  error: string | null;
  isDraft: boolean;
  tempCalcValues: Record<string, string>;
}

const initialState: CalculationDraft = {
  app_id: undefined,
  count: undefined,
  scopes: [],
  starData: {
    name: '',
    constellation: ''
  },
  error: null,
  isDraft: false,
  tempCalcValues: {},
};

export const getStar = createAsyncThunk(
  'vacancyApplication/getStar',
  async (starId: string, { rejectWithValue }) => {
    try {
      const response = await api.star.starDetail(starId, returnHeaderConfig());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.description || 
        error.response?.data?.message || 
        'Ошибка при загрузке заявки'
      );
    }
  }
);

export const addScopeToStar = createAsyncThunk(
  'scopes/addScopeToStar',
  async (scopeId: number, { rejectWithValue }) => {
    try {
      const response = await api.scope.addtostarCreate(
        { scope_id: scopeId.toString() }, 
        returnHeaderConfig()
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка при добавлении услуги в заявку');
    }
  }
);

export const deleteStar = createAsyncThunk(
  'vacancyApplication/deleteStar',
  async (starId: string, { rejectWithValue }) => {
    try {
      const response = await api.star.deleteDelete(starId, returnHeaderConfig());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка при удалении заявки');
    }
  }
);

export const formStar = createAsyncThunk(
  'vacancyApplication/formStar',
  async ({ starId, calcValues }: { starId: string; calcValues: Record<string, string> }, { rejectWithValue }) => {
    try {
      const requestData: { [key: string]: string } = {};
      
      Object.entries(calcValues).forEach(([scopeId, value]) => {
        if (value && value.trim() !== '') {
          requestData[`calc_values_${scopeId}`] = value;
        }
      });

      console.log('Отправляемые данные:', requestData);

      const response = await api.star.formUpdate(starId, requestData, returnHeaderConfig());
      return response.data;
    } catch (error: any) {
      console.error('Ошибка при формировании заявки:', error);
      return rejectWithValue(error.message || 'Ошибка при формировании заявки');
    }
  }
);

export const updateStarData = createAsyncThunk(
  'vacancyApplication/updateStarData',
  async ({ starId, starData }: { starId: string; starData: StarData }, { rejectWithValue }) => {
    try {
      const starDataToSend = {
        name: starData.name ?? '',
        constellation: starData.constellation ?? ''
      };
      const response = await api.star.editUpdate(starId, starDataToSend, returnHeaderConfig());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка при обновлении данных заявки');
    }
  }
);

export const deleteScopeFromStar = createAsyncThunk(
  'scopes/deleteScopeFromStar',
  async ({ starId, scopeId }: { starId: string; scopeId: number }, { rejectWithValue }) => {
    try {
      const response = await api.calc.deleteDelete(
        starId,
        scopeId.toString(),
        returnHeaderConfig()
      );
      return { starId, scopeId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка при удалении услуги из заявки');
    }
  }
);

const vacancyApplicationDraftSlice = createSlice({
  name: 'vacancyApplicationDraft',
  initialState,
  reducers: {
    setAppId: (state, action) => {
      state.app_id = action.payload;
    },
    setCount: (state, action) => {
      state.count = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearDraft: (state) => {
      state.app_id = undefined;
      state.count = undefined;
      state.scopes = [];
      state.starData = {
        name: '',
        constellation: ''
      };
      state.isDraft = false;
      state.error = null;
      state.tempCalcValues = {};
    },
    setCalcValue: (state, action) => {
      const { scopeId, value } = action.payload;
      state.tempCalcValues[scopeId] = value;
    },
    setStarData: (state, action) => {
      state.starData = {
        ...state.starData,
        ...action.payload,
      };
    },
    setScopes: (state, action) => {
      state.scopes = action.payload;
    },
    removeTempCalcValue: (state, action) => {
      const { scopeId } = action.payload;
      delete state.tempCalcValues[scopeId];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStar.fulfilled, (state, action) => {
        console.log('getStar fulfilled with payload:', action.payload);
        
        const payload = action.payload as any;
        const currentStar = payload.current_star;
        const scopesData = payload.scopes || [];
        
        console.log('Current star:', currentStar);
        console.log('Scopes data:', scopesData);
        
        if (currentStar && typeof currentStar === 'object') {
          state.app_id = currentStar.id;
          state.starData = {
            name: currentStar.name || '',
            constellation: currentStar.constellation || ''
          };
          
          state.isDraft = currentStar.status === 'active';
          
          const newTempCalcValues: Record<string, string> = { ...state.tempCalcValues };
          
          state.scopes = scopesData.map((scopeData: any) => {
            const scopeId = scopeData.id;
            const calcData = scopeData.Calc;
            
            if (calcData && newTempCalcValues[scopeId] === undefined) {
              const calcValue = `${calcData.inp_mass || ''} ${calcData.inp_texp || ''} ${calcData.inp_dist || ''}`.trim();
              newTempCalcValues[scopeId] = calcValue;
            }
            
            return {
              scope: {
                id: scopeData.id,
                name: scopeData.name,
                description: scopeData.description,
                status: scopeData.status,
                img_link: scopeData.img_link,
                filter: scopeData.filter,
                lambda: scopeData.lambda,
                delta_lamb: scopeData.delta_lamb,
                zero_point: scopeData.zero_point
              },
              calc: calcData ? {
                inp_dist: calcData.inp_dist,
                inp_mass: calcData.inp_mass,
                inp_texp: calcData.inp_texp,
                res_en: calcData.res_en,
                res_ni: calcData.res_ni,
                scope_id: calcData.scope_id,
                star_id: calcData.star_id
              } : undefined,
              count: calcData ? 1 : 0
            };
          });
          
          state.tempCalcValues = newTempCalcValues;
          state.error = null;
        } else {
          state.error = 'Неверная структура ответа от сервера';
        }
      })
      .addCase(getStar.rejected, (state, action) => {
        state.error = action.payload as string || 'Ошибка при загрузке данных заявки';
      })
      .addCase(addScopeToStar.fulfilled, (state, action) => {
        console.log('Услуга успешно добавлена в заявку', action.payload);
      })
      .addCase(addScopeToStar.rejected, (state, action) => {
        state.error = action.payload as string || 'Ошибка при добавлении услуги в заявку';
      })
      .addCase(deleteStar.fulfilled, (state) => {
        state.app_id = undefined;
        state.count = undefined;
        state.scopes = [];
        state.starData = {
          name: '',
          constellation: ''
        };
        state.isDraft = false;
        state.error = null;
        state.tempCalcValues = {};
      })
      .addCase(deleteStar.rejected, (state, action) => {
        state.error = action.payload as string || 'Ошибка при удалении заявки';
      })
      .addCase(formStar.fulfilled, (state) => {
        state.isDraft = false;
        state.tempCalcValues = {};
      })
      .addCase(formStar.rejected, (state, action) => {
        state.error = action.payload as string || 'Ошибка при формировании заявки';
      })
      .addCase(updateStarData.fulfilled, (state, action) => {
        state.starData = action.payload;
      })
      .addCase(updateStarData.rejected, (state) => {
        state.error = 'Ошибка при обновлении данных';
      })
      .addCase(deleteScopeFromStar.fulfilled, (state, action) => {
        const { scopeId } = action.payload;
        state.scopes = state.scopes.filter(item => item.scope.id !== scopeId);
        delete state.tempCalcValues[scopeId];
        console.log('Услуга успешно удалена из заявки');
      })
      .addCase(deleteScopeFromStar.rejected, (state, action) => {
        state.error = action.payload as string || 'Ошибка при удалении услуги из заявки';
      });
  }
});

export const { 
  setAppId, 
  setCount, 
  setError, 
  clearDraft, 
  setCalcValue, 
  setStarData,
  setScopes,
  removeTempCalcValue
} = vacancyApplicationDraftSlice.actions;

export default vacancyApplicationDraftSlice.reducer;