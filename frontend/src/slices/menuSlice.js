import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/menu`;

export const fetchMenu = createAsyncThunk('menu/fetchAll', async () => {
    const [menuRes, catRes] = await Promise.all([
        axios.get(`${API_URL}`),
        axios.get(`${API_URL}/categories`),
    ]);
    return { dishes: menuRes.data, categories: catRes.data };
});

const menuSlice = createSlice({
    name: 'menu',
    initialState: { dishes: [], categories: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMenu.pending, (state) => { state.loading = true; })
            .addCase(fetchMenu.fulfilled, (state, action) => {
                state.loading = false;
                state.dishes = action.payload.dishes || [];
                state.categories = action.payload.categories || [];
            })
            .addCase(fetchMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default menuSlice.reducer;
