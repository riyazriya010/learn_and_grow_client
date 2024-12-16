import { StudentLoginCredentials } from "@/components/students/login"
import { Credentials } from "@/components/students/signup"
import { USER_SERVICE_URL } from "@/utils/constant"
import axios from "axios"

export const studentApis = {

    login: async (data: StudentLoginCredentials) => {
        try {
            const response = await axios.post(`${USER_SERVICE_URL}/login`, data)
            return response
        } catch (error) {
            console.error('error while login in studentApis: ', error)
        }
    },

    signup: async (data: Credentials) => {
        try{
            const response = await axios.post(`${USER_SERVICE_URL}/signup`, data)
            return response
        }catch(error){
            console.error('error while signup in studentApis: ', error)
        }
    }
}