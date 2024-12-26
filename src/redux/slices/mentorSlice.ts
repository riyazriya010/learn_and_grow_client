'use client'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Mentor {
    userId: string,
    username: string,
    email: string,
    role: string
}

// Initialize state
const initialState: Mentor = {
    userId: '',
    username: '',
    email: '',
    role: ''
};

const mentorSlice = createSlice({
    name: 'mentor',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<Mentor>) => {
            console.log('Previous State:', state); // Log previous state
            console.log('Action Payload:', action.payload); // Log action payload
            const { userId, username, email, role } = action.payload;
            state.userId = userId,
                state.username = username,
                state.email = email,
                state.role = role
                
            console.log('Updated State:', state); // Log updated state
            
            if (typeof window !== 'undefined') {
                localStorage.setItem('mentor', JSON.stringify(state));
            }
        },

        clearUserDetials: (state) => {
            state.userId = ''
            state.username = ''
            state.email = ''
            state.role = ''

            if (typeof window !== 'undefined') {
                localStorage.removeItem('mentor');
            }
        }
    }
})

export const { setUser, clearUserDetials } = mentorSlice.actions
export default mentorSlice.reducer

