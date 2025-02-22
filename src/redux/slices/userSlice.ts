'use client'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
    userId: string,
    username: string,
    email: string,
    role: string
}

// Initialize state
const initialState: User = {
    userId: '',
    username: '',
    email: '',
    role: ''
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            const { userId, username, email, role } = action.payload;
            state.userId = userId;
                state.username = username;
                state.email = email;
                state.role = role;

            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(state));
            }
        },

        clearUserDetials: (state) => {
            state.userId = ''
            state.username = ''
            state.email = ''
            state.role = ''

            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
            }
        }
    }
})

export const { setUser, clearUserDetials } = userSlice.actions
export default userSlice.reducer

