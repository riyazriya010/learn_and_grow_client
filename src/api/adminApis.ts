import { ADMIN_SERVICE_URL } from "@/utils/constant"
import axios from "axios"


interface AdminData {
    email: string,
    password: string
}
export const adminApis = {

    login: async (data: AdminData) => {
        try {
            const response = await axios.post(`${ADMIN_SERVICE_URL}/admin/login`, data, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })
            return response
        } catch (error: any) {
            if (error && error.response.status === 409) {
                throw error
            }
        }
    },

    getUsers: async () => {
        try {
            const response = await axios.get(`${ADMIN_SERVICE_URL}/get/users`,)
            return response
        } catch (error: any) {
            console.log(error.message)
        }
    },

    getMentors: async () => {
        try {
            const response = await axios.get(`${ADMIN_SERVICE_URL}/get/mentors`,)
            return response
        } catch (error: any) {
            console.log(error.message)
        }
    },

    blockMentor: async (id: string) => {
        try {
            const response = await axios.patch(`${ADMIN_SERVICE_URL}/block/mentor?mentorId=${id}`, {}, // Include an empty object for the body
                { withCredentials: true })
            return response
        } catch (error: any) {
            if (error && error.response?.status === 401) {
                throw error
            }
        }
    },

    unBlockMentor: async (id: string) => {
        try {
            const response = await axios.patch(`${ADMIN_SERVICE_URL}/unblock/mentor?mentorId=${id}`, {}, // Include an empty object for the body
                { withCredentials: true })
            return response
        } catch (error: any) {
            if (error && error.response?.status === 401) {
                throw error
            }
        }
    },

    blockUser: async (id: string) => {
        try {
            const response = await axios.patch(`${ADMIN_SERVICE_URL}/block/user?userId=${id}`,
                {}, // Include an empty object for the body
                { withCredentials: true }
            )
            return response
        } catch (error: any) {
            if (error && error.response?.status === 401) {
                throw error
            }
        }
    },

    unBlockUser: async (id: string) => {
        try {
            const response = await axios.patch(`${ADMIN_SERVICE_URL}/unblock/user?userId=${id}`, {}, // Include an empty object for the body
                { withCredentials: true })
            return response
        } catch (error: any) {
            if (error && error.response?.status === 401) {
                throw error
            }
        }
    },
}