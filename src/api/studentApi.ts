import { StudentLoginCredentials } from "@/components/students/login"
import { UserProfile } from "@/components/students/profile"
import { Credentials } from "@/components/students/signup"
import { USER_SERVICE_URL } from "@/utils/constant"
import axios from "axios"
import { User } from "firebase/auth"

export const studentApis = {

    login: async (data: StudentLoginCredentials) => {
        try {
            console.log(data)
            const response = await axios.post(`${USER_SERVICE_URL}/student/login`, data, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })
            return response
        } catch (error: any) {
            if (error.response.status === 401) {
                throw error
            } else if (error.response.status === 403) {
                throw error
            }

            console.error('error while login in studentApis: ', error.message)
        }
    },

    signup: async (data: Credentials) => {
        try {
            const response = await axios.post(`${USER_SERVICE_URL}/student/signup`, data, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })
            return response
        } catch (error: any) {
            if (error && error.response?.status === 409) {
                throw error
            }
            console.error("Unexpected error in signup:", error);
        }
    },

    googleLogin: async (user: User) => {
        try {
            const response = await axios.post(`${USER_SERVICE_URL}/student/google-login`, user, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            return response

        } catch (error: any) {
            if (error.response.status === 403) {
                throw error
            }
            console.error('error while signup in studentApis: ', error)
        }
    },

    googleSignup: async (user: User) => {
        try {
            const response = await axios.post(`${USER_SERVICE_URL}/student/google-signUp`, user, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            return response

        } catch (error: any) {
            if (error && error.response?.status === 409) {
                throw error
            }
            console.error('error while signup in studentApis: ', error)
        }
    },

    forgetPass: async (data: any) => {
        try {
            const response = await axios.patch(`${USER_SERVICE_URL}/student/forget-password`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            })
            return response
        } catch (error: any) {
            if (error && error.response.status === 401) {
                throw error
            }
        }
    },

    isBlocked: async (id: string) => {
        try {
            const response = await axios.get(`${USER_SERVICE_URL}/student/check?userId=${id}`, {
                withCredentials: true
            })
            return response
        } catch (error: any) {
            if (error && error.response.status === 403) {
                throw error
            }
        }
    },

    reVerify: async (email: string) => {
        try {
            const response = await axios.get(`${USER_SERVICE_URL}/student/re-verify?email=${email}`, {
                withCredentials: true
            })
            return response
        } catch (error: any) {
            if (error && error.response?.status === 403) {
                throw error
            }
            if (error && error.response?.status === 401) {
                throw error
            }
        }
    },

    profileUpdate: async (data: UserProfile) => {
        try {
            const response = await axios.patch(`${USER_SERVICE_URL}/student/profile-update`, data, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })
            return response
        } catch (error: any) {
            if (error && error.response?.status === 403) {
                throw error
            }
            if (error && error.response?.status === 401) {
                throw error
            }
        }
    }
}