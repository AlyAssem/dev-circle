/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

export interface User {
  id: string;
  userName: string;
  email: string;
  password: string;
}

interface ValidationErrors {
  errorMessage: string;
}

interface UserResponse {
  user: {
    id: string;
    userName: string;
    email: string;
  };
}

interface UsersState {
  error: string | null | undefined;
  userInfo: Partial<User>;
  users: Array<User>;
}

export const getUsers = createAsyncThunk<
  // Return type of the payload creator
  Array<User>,
  undefined,
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('users/getUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<{ users: Array<User> }>('/api/users');
    return response.data.users;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const registerUser = createAsyncThunk<
  // Return type of the payload creator
  { id: string; userName: string; email: string },
  // userData object type
  User,
  // { id: string } & Partial<User>, // id is a must but the rest of User interface is optional
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('users/register', async (userData, { rejectWithValue }) => {
  try {
    const { id, userName, email, password } = userData;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post<UserResponse>(
      '/api/users',
      { id, userName, email, password },
      config
    );

    localStorage.setItem('userInfo', JSON.stringify(response.data.user));

    return response.data.user;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const loginUser = createAsyncThunk<
  // Return type of the payload creator
  { id: string; userName: string; email: string },
  // userData object type
  { email: string; password: string },
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('users/login', async (userData, { rejectWithValue }) => {
  try {
    const { email, password } = userData;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post<UserResponse>(
      '/api/users/login',
      { email, password },
      config
    );

    localStorage.setItem('userInfo', JSON.stringify(response.data.user));

    return response.data.user;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  users: [],
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = {};
    },
  },
  extraReducers: (builder) => {
    // The `builder` callback form is used here
    // because it provides correctly typed reducers from the action creators
    builder.addCase(getUsers.fulfilled, (state, { payload }) => {
      state.users = payload;
    });
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

    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.userInfo = payload;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
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

export const { logout } = usersSlice.actions;

export default usersSlice.reducer;
