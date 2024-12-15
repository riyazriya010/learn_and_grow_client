import { Credentials } from "@/components/students/signup"
import { USER_SERVICE_URL } from "@/utils/constant"
import axios from "axios"

export const userApi = {
    signup: async (data: Credentials) => {
        try{
            const response = await axios.post(`${USER_SERVICE_URL}/signup`, data)
            return response
        }catch(error){
            console.error('error while signup in userApi: ', error)
        }
    }
}