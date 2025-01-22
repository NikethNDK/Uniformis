// import { createSlice } from '@reduxjs/toolkit';
// import { apiHelpers } from '../../axiosconfig';

// const initialState = {
//   products: [],
//   categories: [],
//   loading: false,
//   error: null,
//   lastFetched: null
// };

// const userProductSlice = createSlice({
//   name: 'userProducts',
//   initialState,
//   reducers: {
//     fetchProductsStart(state) {
//       state.loading = true;
//       state.error = null;
//     },
//     fetchProductsSuccess(state, action) {
//       state.products = action.payload.products;
//       state.categories = action.payload.categories;
//       state.loading = false;
//       state.lastFetched = Date.now();
//     },
//     fetchProductsFailure(state, action) {
//       state.loading = false;
//       state.error = action.payload;
//     },
//     clearProducts(state) {
//       state.products = [];
//       state.categories = [];
//       state.lastFetched = null;
//     }
//   }
// });

// export const {
//   fetchProductsStart,
//   fetchProductsSuccess,
//   fetchProductsFailure,
//   clearProducts
// } = userProductSlice.actions;

// // Thunk for fetching products
// export const fetchProducts = () => async (dispatch, getState) => {
//   const { lastFetched } = getState().userProducts;
//   const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

//   // Return cached data if it's still fresh
//   if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
//     return;
//   }

//   dispatch(fetchProductsStart());
//   try {
//     const [productsResponse, categoriesResponse] = await Promise.all([
//       apiHelpers.get('/products/items/'),
//       apiHelpers.get('/products/categories/')
//     ]);

//     dispatch(fetchProductsSuccess({
//       products: productsResponse,
//       categories: categoriesResponse
//     }));
//   } catch (error) {
//     dispatch(fetchProductsFailure(error.message));
//   }
// };

// export default userProductSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// import { apiHelpers } from "../../axiosconfig"

// const initialState = {
//   products: [],
//   categories: [],
//   loading: false,
//   error: null,
//   lastFetched: null,
// }

// export const fetchProducts = createAsyncThunk("userProducts/fetchProducts", async (_, { getState }) => {
//   const { lastFetched } = getState().userProducts
//   const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

//   if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
//     return null // Return null to skip updating if cache is still valid
//   }

//   const [productsResponse, categoriesResponse] = await Promise.all([
//     apiHelpers.get("/products/items/"),
//     apiHelpers.get("/products/categories/"),
//   ])

//   return {
//     products: productsResponse,
//     categories: categoriesResponse,
//   }
// })

// const userProductSlice = createSlice({
//   name: "userProducts",
//   initialState,
//   reducers: {
//     clearProducts: (state) => {
//       state.products = []
//       state.categories = []
//       state.lastFetched = null
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProducts.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(fetchProducts.fulfilled, (state, action) => {
//         if (action.payload) {
//           state.products = action.payload.products
//           state.categories = action.payload.categories
//           state.lastFetched = Date.now()
//         }
//         state.loading = false
//       })
//       .addCase(fetchProducts.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.error.message
//       })
//   },
// })

// export const { clearProducts } = userProductSlice.actions

// export default userProductSlice.reducer

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { apiHelpers } from "../../axiosconfig"

const initialState = {
  products: [],
  categories: [],
  loading: false,
  error: null,
  nextPage: null,
  count: 0,
  lastFetched: null,
}

export const fetchProducts = createAsyncThunk("userProducts/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      apiHelpers.get("/products/items/"),
      apiHelpers.get("/products/categories/"),
    ])

    console.log("Raw Products API response:", productsResponse)
    console.log("Raw Categories API response:", categoriesResponse)

    return {
      products: productsResponse.results || [],
      categories: categoriesResponse || [],
      nextPage: productsResponse.next,
      count: productsResponse.count,
    }
  } catch (error) {
    console.error("API Error:", error)
    return rejectWithValue(error.message || "An error occurred while fetching products")
  }
})

export const fetchMoreProducts = createAsyncThunk(
  "userProducts/fetchMoreProducts",
  async (url, { rejectWithValue }) => {
    try {
      const response = await apiHelpers.get(url)
      console.log("More products API response:", response)
      return {
        products: response.results || [],
        nextPage: response.next,
      }
    } catch (error) {
      console.error("API Error:", error)
      return rejectWithValue(error.message || "An error occurred while fetching more products")
    }
  },
)

const userProductsSlice = createSlice({
  name: "userProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.categories = action.payload.categories
        state.nextPage = action.payload.nextPage
        state.count = action.payload.count
        state.lastFetched = Date.now()
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchMoreProducts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMoreProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = [...state.products, ...action.payload.products]
        state.nextPage = action.payload.nextPage
      })
      .addCase(fetchMoreProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default userProductsSlice.reducer

