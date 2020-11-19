import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import UserService, { LoginDTO } from '../../services/user';
import { AppThunk } from '../../store';

interface UserState {
  user: {
    token: string;
    staff_info: any;
  };
  loading: boolean;
  error: null;
}

const initialState: UserState = {
  user: {
    token: '',
    staff_info: {},
  },
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.data;
      localStorage.setItem('token',state.user.token)
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    userLogout: (state,action) =>{
      state.user = {staff_info : {},token:""}
    }
  },
});

export const {userLogout, setUser, setLoading, setError } = userSlice.actions;
export const login = (data: LoginDTO): AppThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await UserService.login(data);
      dispatch(setUser(response));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error));
      dispatch(setLoading(false));
    }
  };
};
export const logout = () : AppThunk =>{
  return (dispatch) =>{
    dispatch(userLogout({}))
  }
}
export const userSelector = (state: { user: UserState }) => state.user;
export default userSlice.reducer;
