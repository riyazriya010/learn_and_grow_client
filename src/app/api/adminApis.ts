import { CategoryFormData } from "@/components/admin/addCategory"
import { ADMIN_SERVICE_URL } from "@/utils/constant"
import axios, { AxiosError } from "axios"


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
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error && error?.response?.status === 409) {
                    throw error
                } else if (error.code === 'ERR_NETWORK') {
                    throw error
                }
            }
            throw error
        }
    },

    getUsers: async (filters: { page: number, limit: number }) => {
        try {
            const response = await axios.get(`${ADMIN_SERVICE_URL}/get/users`, {
                params: filters,
                withCredentials: true
            })
            return response
        } catch (error: unknown) {
            throw error
        }
    },

    getMentors: async (filters: { page: number, limit: number }) => {
        try {
            const response = await axios.get(`${ADMIN_SERVICE_URL}/get/mentors`, {
                params: filters,
                withCredentials: true
            })
            return response
        } catch (error: unknown) {
            throw error
        }
    },

    blockMentor: async (id: string) => {
        try {
            const response = await axios.patch(`${ADMIN_SERVICE_URL}/block/mentor?mentorId=${id}`, {}, // Include an empty object for the body
                { withCredentials: true })
            return response
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error && error?.response?.status === 401) {
                    throw error
                }
            }
            throw error
        }
    },

    unBlockMentor: async (id: string) => {
        try {
            const response = await axios.patch(`${ADMIN_SERVICE_URL}/unblock/mentor?mentorId=${id}`, {}, // Include an empty object for the body
                { withCredentials: true })
            return response
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error && error.response?.status === 401) {
                    throw error
                }
            }
            throw error
        }
    },

    blockUser: async (id: string) => {
        try {
            const response = await axios.patch(`${ADMIN_SERVICE_URL}/block/user?userId=${id}`,
                {}, // Include an empty object for the body
                { withCredentials: true }
            )
            return response
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error && error.response?.status === 401) {
                    throw error
                }
            }
            throw error
        }
    },

    unBlockUser: async (id: string) => {
        try {
            const response = await axios.patch(`${ADMIN_SERVICE_URL}/unblock/user?userId=${id}`, {}, // Include an empty object for the body
                { withCredentials: true })
            return response
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error && error.response?.status === 401) {
                    throw error
                }
            }
            throw error
        }
    },


    /* ------------------------------------ WEEK - 2 ------------------------------------*/


    getAllCategory: async (filters: { page: number, limit: number }) => {
        try {
            const response = await axios.get(`${ADMIN_SERVICE_URL}/get/categories`, {
                params: filters,
                withCredentials: true
            })
            return response
        } catch (error: unknown) {
            throw error
        }
    },


    addCategory: async (data: CategoryFormData) => {
        try {
            const response = await axios.post(`${ADMIN_SERVICE_URL}/add/category`, data, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })
            return response
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error && error.response?.status === 403 &&
                    error.response?.data?.message === 'Category Already Exist') {
                    throw error
                }
            }
            throw error
        }
    },


    editCategory: async (data: CategoryFormData, categoryId: string) => {
        try {
            console.log('iddd: ', categoryId)
            const response = await axios.patch(`${ADMIN_SERVICE_URL}/edit/category?categoryId=${categoryId}`, data, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })
            return response
        } catch (error: unknown) {
            throw error
        }
    },


    getAllCourses: async (filters: { page: number, limit: number }) => {
        try {
            const response = await axios.get(`${ADMIN_SERVICE_URL}/get/all-course`, {
                params: filters,
                withCredentials: true
            })
            return response
        } catch (error: unknown) {
            throw error
        }
    },


    unListCategory: async (categoryId: string) => {
        try {
            const response = await axios.patch(`${ADMIN_SERVICE_URL}/unList/category?categoryId=${categoryId}`, {}, {
                withCredentials: true
            })
            return response
        } catch (error: unknown) {
            throw error
        }
    },


    listCategory: async (categoryId: string) => {
        try {
            const response = await axios.patch(`${ADMIN_SERVICE_URL}/list/category?categoryId=${categoryId}`, {}, {
                withCredentials: true
            })
            return response
        } catch (error: unknown) {
            throw error
        }
    },



    courseUnList: async (courseId: string) => {
        try {
            const response = await axios.patch(`${ADMIN_SERVICE_URL}/unlist/course?courseId=${courseId}`, {}, {
                withCredentials: true
            })
            return response
        } catch (error: unknown) {
            throw error
        }
    },



    courseList: async (courseId: string) => {
        try {
            const response = await axios.patch(`${ADMIN_SERVICE_URL}/list/course?courseId=${courseId}`, {}, {
                withCredentials: true
            })
            return response
        } catch (error: unknown) {
            throw error
        }
    },


    getWallet: async (filters: { page: number, limit: number }) => {
        try {
            const response = await axios.get(`${ADMIN_SERVICE_URL}/get/wallet`, {
                params: filters,
                withCredentials: true
            })
            return response
        } catch (error: unknown) {
            throw error
        }
    },


    /////////////////////// week - 3 ///////////////////////
    addBadge: async (data: { badgeName: string, description: string, value: string }) => {
        try {
            const response = await axios.post(`${ADMIN_SERVICE_URL}/add/badge`, data, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })
            return response
        } catch (error: unknown) {
            throw error
        }
    },

    getAllBadge: async (filters: { page: number, limit: number }) => {
        try {
            const response = await axios.get(`${ADMIN_SERVICE_URL}/get/badges`, {
                params: filters,
                withCredentials: true
            })
            return response
        } catch (error: unknown) {
            throw error
        }
    },

    editBadge: async (data: { badgeName: string, description: string, value: string }, badgeId: string) => {
        try {
            const response = await axios.patch(`${ADMIN_SERVICE_URL}/edit/badge/${badgeId}`, data, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })
            return response
        } catch (error: unknown) {
            throw error
        }
    },






    //////////////////////////////////// Studnet Apis /////////////////////////////////




    /////////////////////////////////// Mentor Apis ////////////////////////////////




    ///////////////////////////////// Course Apis ///////////////////////////////





    //////////////////////////////// Category Apis //////////////////////////////////////





    //////////////////////////////// Badge Apis //////////////////////////////





    /////////////////////////////// Sales Apis /////////////////////////////////////



}