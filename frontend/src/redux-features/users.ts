/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { INotification, IUser } from '../interfaces';

interface ValidationErrors {
  errorMessage: string;
}

interface UserResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface UsersState {
  error: string | null | undefined;
  userInfo: Partial<IUser>;
  users: Array<IUser>;
}

export const getUserLikedPosts = createAsyncThunk<
  // Return type of the payload creator
  Array<string>,
  // type of userId passed as param.
  string,
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('/users/getUserLikedPosts', async (userId, { getState, rejectWithValue }) => {
  try {
    const {
      users: { userInfo },
    } = getState() as any;

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const response = await axios.get<{
      userLikedPosts: Array<string>;
    }>(`/api/users/${userId}/likedPosts`, config);

    return response.data.userLikedPosts;
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const getUserNotifications = createAsyncThunk<
  // Return type of the payload creator
  Array<INotification>,
  // type of userId passed as param.
  string,
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>(
  '/users/getUserNotifications',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const {
        users: { userInfo },
      } = getState() as any;

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const response = await axios.get<{
        notifications: Array<INotification>;
      }>(`/api/users/${userId}/notifications`, config);

      return response.data.notifications;
    } catch (err: any) {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const registerUser = createAsyncThunk<
  // Return type of the payload creator
  { id: string; name: string; email: string },
  // userData object type
  IUser,
  // { id: string } & Partial<User>, // id is a must but the rest of User interface is optional
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('users/register', async (userData, { rejectWithValue }) => {
  try {
    const { id, name, email, password } = userData;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post<UserResponse>(
      '/api/users',
      { id, name, email, password },
      config
    );

    const tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60);

    localStorage.setItem(
      'userInfo',
      JSON.stringify({
        ...response.data.user,
        tokenExpirationDate: tokenExpirationDate.toISOString(),
      })
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

export const loginUser = createAsyncThunk<
  // Return type of the payload creator
  { id: string; name: string; email: string },
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

    const tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60);

    localStorage.setItem(
      'userInfo',
      JSON.stringify({
        ...response.data.user,
        tokenExpirationDate: tokenExpirationDate.toISOString(),
      })
    );

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
      localStorage.removeItem('userInfo');
      state.userInfo = {};
    },
    addNotification: (state, action) => {
      console.log('ADD NOTIFICATION ', action.payload);
      state.userInfo.notifications?.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    // The `builder` callback form is used here
    // because it provides correctly typed reducers from the action creators
    builder.addCase(getUserLikedPosts.fulfilled, (state, { payload }) => {
      state.userInfo = {
        ...state.userInfo,
        likedPosts: payload,
      };
    });

    builder.addCase(getUserNotifications.fulfilled, (state, { payload }) => {
      state.userInfo = {
        ...state.userInfo,
        notifications: payload,
      };
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

export const { logout, addNotification } = usersSlice.actions;

export default usersSlice.reducer;
