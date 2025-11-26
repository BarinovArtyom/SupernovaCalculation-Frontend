import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from '../../api';
import { returnHeaderConfig } from "./userSlice";

interface RegistrationState {
    isLoading: boolean;
    error: string | null;
}

const initialState: RegistrationState = {
    isLoading: false,
    error: null,
};

interface RegisterRequest {
    login: string;
    password: string;
}

interface RegisterResponse {
    ok: boolean;
}

export const registerUser = createAsyncThunk(
    "registration/registerUser",
    async (userData: { login: string; password: string; repeat_password: string }, { rejectWithValue }) => {
        try {
            if (userData.password !== userData.repeat_password) {
                return rejectWithValue('Пароли не совпадают');
            }

            const requestData: RegisterRequest = {
                login: userData.login,
                password: userData.password
            };

            const response = await api.user.registerCreate(requestData, returnHeaderConfig());
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               error.response?.data?.description ||
                               'Ошибка при регистрации';
            return rejectWithValue(errorMessage);
        }
    }
);

const registrationSlice = createSlice({
    name: "registration",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = registrationSlice.actions;
export default registrationSlice.reducer;