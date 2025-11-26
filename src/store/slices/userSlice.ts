import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from "../../api"
import type { HandlerLoginReq, DsUsers } from '../../api/Api';

interface UserState {
  uid?: number | null;
  username: string;
  role: number;
  token: string | null;
  isAuthenticated: boolean;
  error?: string | null;
}

const initialState: UserState = {
  uid: null,
  username: '',
  token: null,
  role: 0,
  isAuthenticated: false,
  error: null,
};

export function returnHeaderConfig(){
  const token = localStorage.getItem('token');
  let config = {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    }
  }
  return config
};

function decodeJwt(token: string): { Uid: number, Role: number } | null {
  try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
          Uid: payload.user_uuid,
          Role: payload.Role,
      };
  } catch (error) {
      return null;
  }
}

export const loginUserAsync = createAsyncThunk(
  'user/loginUserAsync',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const loginData: HandlerLoginReq = {
        login: credentials.username, 
        password: credentials.password,
        guest: false
      };
      
      const response = await api.user.loginCreate(loginData);
      return response.data; 
    } catch (error) {
      return rejectWithValue('Ошибка авторизации');
    }
  }
);

export const logoutUserAsync = createAsyncThunk(
  'user/logoutUserAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.user.logoutCreate(returnHeaderConfig());
      return response.data; 
    } catch (error) {
      return rejectWithValue('Ошибка при выходе из системы'); 
    }
  }
);

export const getUserProfileAsync = createAsyncThunk(
  'user/getUserProfileAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.user.profileList(returnHeaderConfig());
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при загрузке профиля');
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  'user/updateUserAsync',
  async ({ user_id, login, currentPassword, newPassword }: { 
    user_id: number; 
    login: string; 
    currentPassword: string;
    newPassword: string;
  }, { rejectWithValue }) => {
    try {
      const updateData: DsUsers = {
        login: login,
        password: newPassword || currentPassword
      };

      const response = await api.user.editUpdate(updateData, returnHeaderConfig());
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          'Ошибка при обновлении профиля';
      return rejectWithValue(errorMessage);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.token = action.payload.access_token;
        state.username = action.payload.login;
        state.role = action.payload.role;
        state.uid = decodeJwt(action.payload.access_token)?.Uid || null;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('token', action.payload.access_token);
        localStorage.setItem('username', action.payload.login);
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
        state.role = 0;
        state.isAuthenticated = false;
      })

      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.username = '';
        state.role = 0;
        state.isAuthenticated = false;
        state.token = null;
        state.uid = null;
        state.error = null;
        localStorage.removeItem('token');
        localStorage.removeItem('username');
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
        state.username = '';
        state.role = 0;
        state.isAuthenticated = false;
        state.token = null;
        state.uid = null;
        localStorage.removeItem('token');
        localStorage.removeItem('username');
      })

      .addCase(getUserProfileAsync.fulfilled, (state, action) => {
        if (action.payload.id) state.uid = action.payload.id;
        if (action.payload.login) state.username = action.payload.login;
        if (action.payload.mod_status) {
          state.role = action.payload.mod_status === 'moderator' ? 1 : 0;
        }
      })
      .addCase(getUserProfileAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(updateUserAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        if (action.payload.login) {
          state.username = action.payload.login;
          localStorage.setItem('username', action.payload.login);
        }
        state.error = null;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;