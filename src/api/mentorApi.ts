import { MentorSignUpCredential } from "@/components/mentors/signup";
import { MENTOR_SERVICE_URL } from "@/utils/constant";
import axios from "axios";

export const mentorApis = {
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
            if(error.response.status === 409){
                throw error
            }
            console.log(error.message)
        }
    }
}