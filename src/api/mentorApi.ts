// import { AddCourseFormInputs } from "@/components/mentors/addCourse";
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
            if(error && error.response?.status === 403){
                throw error
            }
            if(error && error.response?.status === 401){
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


      
    addChapter: async (data: FormData) => {
        try {
            const courseId = '67710140df708808ce0fd712'
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
      }
      
}