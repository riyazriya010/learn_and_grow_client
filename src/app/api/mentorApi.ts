// import { AddCourseFormInputs } from "@/components/mentors/addCourse";
import { IQuizForm } from "@/components/mentors/addQuizz";
import { MentorLoginCredentials } from "@/components/mentors/login";
import { MentorProfile } from "@/components/mentors/profile";
import { MentorSignUpCredential } from "@/components/mentors/signup";
import { MENTOR_SERVICE_URL } from "@/utils/constant";
import axios from "axios";
import { User } from "firebase/auth"

export const mentorApis = {

    /* ------------------------------- WEEK 1 ---------------------------*/

    login: async (data: MentorLoginCredentials) => {
        try {
            const response = await axios.post(`${MENTOR_SERVICE_URL}/mentor/login`, data, {
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


    signUp: async (data: MentorSignUpCredential) => {
        try {
            const response = await axios.post(`${MENTOR_SERVICE_URL}/mentor/signup`, data, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })
            return response
        } catch (error: any) {
            if (error.response.status === 409) {
                throw error
            }
            console.log(error.message)
        }
    },

    forgetPass: async (data: any) => {
        try {
            const response = await axios.patch(`${MENTOR_SERVICE_URL}/mentor/forget-password`, data, {
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

    googleLogin: async (user: User) => {
        try {
            const response = await axios.post(`${MENTOR_SERVICE_URL}/mentor/google-login`, user, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            return response

        } catch (error: any) {
            if (error && error.response.status === 403) {
                throw error
            }
            console.error('error while google Login in mentorApis: ', error)
        }
    },

    googleSignup: async (user: User) => {
        try {
            const response = await axios.post(`${MENTOR_SERVICE_URL}/mentor/google-signUp`, user, {
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
            console.error('error while google signup in mentorApis: ', error)
        }
    },

    isBlocked: async (id: string) => {
        try {
            const response = await axios.get(`${MENTOR_SERVICE_URL}/mentor/check?userId=${id}`, {
                withCredentials: true
            })
            return response
        } catch (error: any) {
            if (error && error.response?.status === 403) {
                throw error
            }
        }
    },

    reVerify: async (email: string) => {
        try {
            const response = await axios.get(`${MENTOR_SERVICE_URL}/mentor/re-verify?email=${email}`, {
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

    profileUpdate: async (data: MentorProfile) => {
        try {
            const response = await axios.patch(`${MENTOR_SERVICE_URL}/mentor/profile-update`, data, {
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
    },

    /* ------------------------------- WEEK 2 ---------------------------*/

    addCourse: async (data: FormData) => {
        try {
            const response = await axios.post(`${MENTOR_SERVICE_URL}/mentor/course-upload`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Axios auto-handles this but explicit is good
                },
                withCredentials: true, // Include credentials if needed
            });
            return response.data;
        } catch (error) {
            console.error("API Error:", error);
            throw error; // Rethrow error to handle it in the calling function
        }
    },



    addChapter: async (data: FormData, courseId: string) => {
        try {
            // const courseId = '67710140df708808ce0fd712'
            const response = await axios.post(`${MENTOR_SERVICE_URL}/mentor/chapter-upload?courseId=${courseId}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Axios auto-handles this but explicit is good
                },
                withCredentials: true, // Include credentials if needed
            });
            return response.data;
        } catch (error) {
            console.error("API Error:", error);
            throw error; // Rethrow error to handle it in the calling function
        }
    },


    getAllCourses: async () => {
        try {
            const response = await axios.get(`${MENTOR_SERVICE_URL}/get/all-course`, {
                withCredentials: true
            })
            return response
        } catch (error) {
            console.log(error)
        }
    },


    getCourse: async (courseId: string) => {
        try {
            const response = await axios.get(`${MENTOR_SERVICE_URL}/get/course?courseId=${courseId}`, {
                withCredentials: true
            })
            return response
        } catch (error: any) {
            throw error
        }
    },

    getCategories: async () => {
        try {
            const response = await axios.get(`${MENTOR_SERVICE_URL}/get/categories`, {
                withCredentials: true
            })
            return response
        } catch (error: any) {
            throw error
        }
    },


    getAllChapters: async (courseId: string) => {
        try{
            const response = await axios.get(`${MENTOR_SERVICE_URL}/get/all-chapters?courseId=${courseId}`,{
                withCredentials: true
            })
            return response
        }catch(error: any){
            throw error
        }
    },

    addQuizz: async (data: IQuizForm, courseId: string) => {
        try{
            const response = await axios.post(`${MENTOR_SERVICE_URL}/add/quizz?courseId=${courseId}`, data, {
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

    getAllQuizz: async (courseId: string) => {
        try{
            const response = await axios.get(`${MENTOR_SERVICE_URL}/get/all-quizz?courseId=${courseId}`,{
                withCredentials: true
            })
            return response
        }catch(error: any){
            throw error
        }
    },


    deleteQuizz: async (quizId: string, courseId: string) => {
        try{
            const response = await axios.delete(`${MENTOR_SERVICE_URL}/delete/quizz?courseId=${courseId}&quizId=${quizId}`,{
                withCredentials: true
            })
            return response
        }catch(error: any){
            throw error
        }
    },


    editCourseWithFiles: async (formData: any, courseId: string) => {
        try{
            const response = await axios.patch(`${MENTOR_SERVICE_URL}/edit/course?courseId=${courseId}`, formData, {
                headers: {
                    "Content-Type": 'multipart/form-data'
                },
                withCredentials: true
            })
            return response
        }catch(error: any){
            throw error
        }
    },

    // editCourseWithoutFiles: async (formData: any, courseId: string) => {
    //     try{
    //         const response = await axios.patch(`${MENTOR_SERVICE_URL}/edit-data/course?courseId=${courseId}`, formData, {
    //             headers: {
    //                 "Content-Type": 'multipart/form-data'
    //             },
    //             withCredentials: true
    //         })
    //         return response
    //     }catch(error: any){
    //         throw error
    //     }
    // }

}