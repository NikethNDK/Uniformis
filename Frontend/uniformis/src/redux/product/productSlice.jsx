import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productApi } from '../../adminaxiosconfig';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await productApi.get('/items/');
    return response.data;
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id) => {
    const response = await productApi.get(`/items/${id}/`);
    return response.data;
  }
);

export const updateProductStatus = createAsyncThunk(
  'products/updateStatus',
  async ({ id, is_deleted }) => {
    const response = await productApi.patch(`/items/${id}/`, { is_deleted });
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ id, data }) => {
        console.log('Update request payload:', data); 
      // Use PATCH instead of PUT for partial updates
      const response = await productApi.patch(`/items/${id}/`, data);
      return response.data;
    }
  );

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id) => {
    await productApi.delete(`/items/${id}/`);
    return id;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    currentProduct: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
      })
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(product => product.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(product => product.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.currentProduct = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(product => product.id !== action.payload);
      });
  },
});

export default productSlice.reducer;

