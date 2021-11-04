/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

interface User {
  id: string;
  userName: string;
  email: string;
}

interface ValidationErrors {
  errorMessage: string;
}

interface RegisterUserResponse {
  user: User;
}

interface UsersState {
  error: string | null | undefined;
  userInfo: Partial<User>;
}

export const registerUser = createAsyncThunk<
  // Return type of the payload creator
  User,
  // First argument to the payload creator
  User,
  // { id: string } & Partial<User>, // id is a must but the rest of User interface is optional
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('users/register', async (userData, { rejectWithValue }) => {
  try {
    const { id, userName, email } = userData;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post<RegisterUserResponse>(
      '/api/users',
      { id, userName, email },
      config
    );

    return response.data.user;
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

const initialState: UsersState = {
  userInfo: {},
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // The `builder` callback form is used here
    // because it provides correctly typed reducers from the action creators
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      state.userInfo = payload;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      if (action.payload) {
        // Being that we passed in ValidationErrors to rejectType
        // in `createAsyncThunk`, the payload will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });
  },
});

export default usersSlice.reducer;
