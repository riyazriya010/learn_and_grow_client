import { StudentLoginCredentials } from "@/components/students/login"
import { UserProfile } from "@/components/students/profile"
import { Credentials } from "@/components/students/signup"
import { USER_SERVICE_URL } from "@/utils/constant"
import axios from "axios"
import { User } from "firebase/auth"
import { headers } from "next/headers"

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

            throw error
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
            throw error
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
            throw error
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
            throw error
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
            throw error
        }
    },

    isBlocked: async (id: string) => {
        try {
            const response = await axios.get(`${USER_SERVICE_URL}/student/check?userId=${id}`, {
                withCredentials: true
            })
            return response
        } catch (error: any) {
            if (error && error?.response?.status === 403) {
                throw error
            }
            throw error
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
            throw error
        }
    },

    profileUpdate: async (data: FormData) => {
        try {
            const response = await axios.patch(`${USER_SERVICE_URL}/student/profile-update`, data, {
                headers: {
                    "Content-Type": "multipart/form-data"
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
            throw error
        }
    },

    /* ---------------------------- WEEK - 2 -------------------------*/

    fetchAllCourse: async (filters: { page: number; limit: number }) => {
        try {
            const { page, limit } = filters;
            const response = await axios.get(`${USER_SERVICE_URL}/get/all-course`, {
                params: { page, limit },
                withCredentials: true
            });
            return response;
        } catch (error: any) {
            throw error
        }
    },


    getCourse: async (id: string, userId: string) => {
        try {
            const response = await axios.get(`${USER_SERVICE_URL}/get/course?courseId=${id}&userId=${userId}`, {
                withCredentials: true
            })
            return response
        } catch (error: any) {
            throw error
        }
    },


    getChapters: async () => {
        try {
            const courseId = '67713238c901f382c99d8a46'
            const response = await axios.get(`${USER_SERVICE_URL}/get/course/play?courseId=${courseId}`, {
                withCredentials: true
            })
            return response
        } catch (error: any) {
            throw error
        }
    },

    filterData: async (filters: { page: number, limit: number, selectedCategory: string, selectedLevel: string, searchTerm: string }) => {
        try {
            const response = await axios.get(`${USER_SERVICE_URL}/filter/data`, {
                params: filters,
                withCredentials: true
            })
            return response
        } catch (error: any) {
            throw error
        }
    },


    payment: async (courseId: string, txnid: string, amount: number, courseName: string) => {
        try {
            const data = { courseId, txnid, amount, courseName }
            const response = await axios.post(`${USER_SERVICE_URL}/payment`, data, {
                withCredentials: true
            })
            return response
        } catch (error: any) {
            throw error
        }
    },


    isVerified: async () => {
        try {
            const response = await axios.get(`${USER_SERVICE_URL}/check/verify`, {
                withCredentials: true
            })
            return response
        } catch (error: any) {
            throw error
        }
    },


    getPurchasedCourses: async (filters: {page: number, limit: number}) => {
        try {
            const response = await axios.get(`${USER_SERVICE_URL}/get/buyedCourses`, {
                params: filters,
                withCredentials: true
            })
            return response
        } catch (error: any) {
            throw error
        }
    },


    coursePlay: async (buyedId: string) => {
        try {
            const response = await axios.get(`${USER_SERVICE_URL}/course-play?buyedId=${buyedId}`, {
                withCredentials: true
            })
            return response
        } catch (error: any) {
            throw error
        }
    },


    chapterVideoEnd: async (chapterId: string) => {
        try {
            const response = await axios.patch(`${USER_SERVICE_URL}/chapter-end?chapterId=${chapterId}`, {}, {
                withCredentials: true
            })
            return response
        } catch (error: any) {
            throw error
        }
    },


    getCertificate: async (certificateId: string) => {
        try{
            const response = await axios.get(`${USER_SERVICE_URL}/get/certificate?certificateId=${certificateId}`,{
                withCredentials: true
            })
            return response
        }catch(error: any){
            throw error
        }
    },


    getQuizz: async (courseId: string) => {
        try{
            const response = await axios.get(`${USER_SERVICE_URL}/get/quizz?courseId=${courseId}`,{
                withCredentials: true
            })
            return response
        }catch(error: any){
            throw error
        }
    },


    completeCourse: async (courseId: string) => {
        try{
            const response = await axios.get(`${USER_SERVICE_URL}/complete/course?courseId=${courseId}`, {
                withCredentials: true
            })
            return response
        }catch(error: any){
            throw error
        }
    },


    createCertificate: async (data: any) => {
        try{
            const response = await axios.post(`${USER_SERVICE_URL}/create/certificate`, data, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
             })
             return response
        }catch(error: any){
            throw error
        }
    },



    getCertificates: async () => {
        try{
            const response = await axios.get(`${USER_SERVICE_URL}/get/certificates`,{
                withCredentials: true
            })
            return response
        }catch(error: any){
            throw error
        }
    },


    getBadges: async () => {
        try{
            const response = await axios.get(`${USER_SERVICE_URL}/get/badges`,{
                withCredentials: true
            })
            return response
        }catch(error: any){
            throw error
        }
    }


}