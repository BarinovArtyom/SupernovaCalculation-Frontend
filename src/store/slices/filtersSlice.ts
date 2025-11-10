import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
    searchQuery: string;
}

const initialState: FiltersState = {
    searchQuery: "",
};

const filtersSlice = createSlice({
    name: "filters",
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
    },
});

export const { setSearchQuery } = filtersSlice.actions;
export default filtersSlice.reducer;