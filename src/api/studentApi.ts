import { StudentLoginCredentials } from "@/components/students/login"
import { Credentials } from "@/components/students/signup"
import { USER_SERVICE_URL } from "@/utils/constant"
import axios from "axios"
import { User } from "firebase/auth"

export const studentApis = {

    login: async (data: StudentLoginCredentials) => {
        try {
            const response = await axios.post(`${USER_SERVICE_URL}/student/login`, data)
            return response
        } catch (error: any) {
            if(error.response.status === 401){
                throw error
            }
            console.error('error while login in studentApis: ', error.message)
        }
    },

    signup: async (data: Credentials) => {
        try{
            const response = await axios.post(`${USER_SERVICE_URL}/student/signup`, data)
            return response
        }catch(error: any){
            if (axios.isAxiosError(error)) {
                // Handle specific Axios errors
                console.error("Axios Error in signup:", error.response?.data || error.message);
                throw error.response; // Rethrow the response to handle in the calling function
            }
            console.error("Unexpected error in signup:", error);
            throw error; // Rethrow any other errors
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

        } catch (error) {
            console.error('error while signup in studentApis: ', error)
        }
    }
}