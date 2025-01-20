import { createSlice } from '@reduxjs/toolkit';
import { apiHelpers } from '../../axiosconfig';

const initialState = {
  products: [],
  categories: [],
  loading: false,
  error: null,
  lastFetched: null
};

const userProductSlice = createSlice({
  name: 'userProducts',
  initialState,
  reducers: {
    fetchProductsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess(state, action) {
      state.products = action.payload.products;
      state.categories = action.payload.categories;
      state.loading = false;
      state.lastFetched = Date.now();
    },
    fetchProductsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearProducts(state) {
      state.products = [];
      state.categories = [];
      state.lastFetched = null;
    }
  }
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  clearProducts
} = userProductSlice.actions;

// Thunk for fetching products
export const fetchProducts = () => async (dispatch, getState) => {
  const { lastFetched } = getState().userProducts;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Return cached data if it's still fresh
  if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
    return;
  }

  dispatch(fetchProductsStart());
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      apiHelpers.get('/products/items/'),
      apiHelpers.get('/products/categories/')
    ]);

    dispatch(fetchProductsSuccess({
      products: productsResponse,
      categories: categoriesResponse
    }));
  } catch (error) {
    dispatch(fetchProductsFailure(error.message));
  }
};

export default userProductSlice.reducer;