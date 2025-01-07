import { CategoryFormData } from "@/components/admin/addCategory"
import { ADMIN_SERVICE_URL, USER_SERVICE_URL } from "@/utils/constant"
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
            console.log('e: ',error)
            if (error && error.response.status === 409) {
                throw error
            } else if(error.code === 'ERR_NETWORK'){
                throw error
            }
        }
    },

    getUsers: async (filters: {page: number, limit: number}) => {
        try {
            const response = await axios.get(`${ADMIN_SERVICE_URL}/get/users`,{
                params: filters,
                withCredentials: true
            })
            return response
        } catch (error: any) {
            console.log(error.message)
        }
    },

    getMentors: async (filters: {page: number, limit: number}) => {
        try {
            const response = await axios.get(`${ADMIN_SERVICE_URL}/get/mentors`,{
                params: filters,
                withCredentials: true
            })
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


    /* ------------------------------------ WEEK - 2 ------------------------------------*/


    getAllCategory: async (filters: {page: number, limit: number}) => {
        try{
            const response = await axios.get(`${ADMIN_SERVICE_URL}/get/categories`,{
                params: filters,
                withCredentials: true
            })
                return response
        }catch(error: any){
            console.log(error)
        }
    },


    addCategory: async (data: CategoryFormData) => {
        try{
            const response = await axios.post(`${ADMIN_SERVICE_URL}/add/category`, data,{
                headers:{
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })
            return response
        }catch(error: any){
            console.log(error)
            if(error && error.response?.status === 403 && error.response?.data?.message === 'Category Already Exist'){
                throw error
            }
        }
    },


    editCategory: async (data: CategoryFormData, categoryId: string) => {
        try{
            console.log('iddd: ', categoryId)
            const response = await axios.patch(`${ADMIN_SERVICE_URL}/edit/category?categoryId=${categoryId}`, data,{
                headers:{
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })
            return response
        }catch(error: any){
            throw error
        }
    },


    getAllCourses: async (filters: {page: number, limit: number}) => {
        try{
            const response = await axios.get(`${ADMIN_SERVICE_URL}/get/all-course`,{
                params: filters,
                withCredentials: true
            })
            return response
        }catch(error: any){
            throw error
        }
    },


    unListCategory: async (categoryId: string) => {
        try{
            const response = await axios.patch(`${ADMIN_SERVICE_URL}/unList/category?categoryId=${categoryId}`,{}, {
                withCredentials: true
            })
            return response
        }catch(error: any){
            throw error
        }
    },


    listCategory: async (categoryId: string) => {
        try{
            const response = await axios.patch(`${ADMIN_SERVICE_URL}/list/category?categoryId=${categoryId}`,{}, {
                withCredentials: true
            })
            return response
        }catch(error: any){
            throw error
        }
    },



    courseUnList: async (courseId: string): Promise<any> => {
        try{
            const response = await axios.patch(`${ADMIN_SERVICE_URL}/unlist/course?courseId=${courseId}`,{
                withCredentials: true
            })
            return response
        }catch(error: any){
            throw error
        }
    },



    courseList: async (courseId: string): Promise<any> => {
        try{
            const response = await axios.patch(`${ADMIN_SERVICE_URL}/list/course?courseId=${courseId}`,{
                withCredentials: true
            })
            return response
        }catch(error: any){
            throw error
        }
    },

}