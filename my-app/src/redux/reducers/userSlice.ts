import { createSlice } from '@reduxjs/toolkit'

const initialState = false

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLogin(state, action) {      
      return state = true;      
    },
    userLogout(state, action) {
      return state = false;
    }
  }
})

export const { userLogin, userLogout } = userSlice.actions

export default userSlice.reducer