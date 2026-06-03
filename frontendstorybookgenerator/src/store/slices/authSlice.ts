import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ── User shape matches Firebase ──
interface User {
  uid:         string;
  email:       string | null;
  displayName: string | null;
  photoURL:    string | null;
}

interface AuthState {
  status:   boolean;
  userData: User | null;
  loading:  boolean;
  error:    string | null;
  authInitialized: boolean;
}

const initialState: AuthState = {
  status:   false,
  userData: null,
  loading:  false,
  error:    null,
  authInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    login: (state, action: PayloadAction<{ userData: User }>) => {
      state.status   = true;
      state.userData = action.payload.userData;
      state.loading  = false;
      state.error    = null;
    },


    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error   = action.payload;
      state.loading = false;
    },
    clearAuth: (state) => {
      state.status = false;
      state.userData    = null;
      state.loading = false;
      state.error   = null;
    },
    setAuthInitialized: (state) => {
      state.authInitialized = true;
    },

  },
});

export const { login,  setLoading, setError, clearAuth, setAuthInitialized } = authSlice.actions;
export default authSlice.reducer;