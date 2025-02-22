"use client";

import { useEffect, useState } from "react";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { mentorApis } from "@/app/api/mentorApi";
import Navbar from "../navbar";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/mentorSlice";
import Footer from "../loggedoutNav/footer";


export interface MentorProfile {
  username: string,
  phone: string
  profile: File | null;
}

const MentorProfile = () => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [localUser, setLocalUser] = useState({
    email: "",
    username: "",
    phone: "",
    profileImage: "",
  });

  const router = useRouter()
  const dispatch = useDispatch()

  const { register, handleSubmit, setValue, reset, formState: { errors }, } = useForm<MentorProfile>()


  useEffect(() => {
    const cookieData = Cookies.get("accessToken");

    if (cookieData) {
      try {
        const decodedToken = jwt.decode(cookieData);

        if (decodedToken && typeof decodedToken === "object" && "user" in decodedToken) {
          const userId = decodedToken.user;

          // check the user is Blocked or not
          const checkUser = async () => {
            try {
              const response = await mentorApis.isBlocked(userId)
              if (response && response.data && response.data.result) {
                const fetchedUser = response.data.result;
                setLocalUser({
                  email: fetchedUser.email || "",
                  username: fetchedUser.username || "",
                  phone: fetchedUser.phone || "",
                  profileImage: fetchedUser.profilePicUrl || "", 
                });
                setIsVerified(fetchedUser.isVerified);

                //setting values in the useForm
                setValue("username", fetchedUser.username || "");
                setValue("phone", fetchedUser.phone || "");
              }
            } catch (error: any) {
              if (error && error.response?.status === 401) {
                toast.warn(error.response.data.message);
                Cookies.remove('accessToken');
                localStorage.clear();
                setTimeout(() => {
                  window.location.replace('/pages/mentor/login');
                }, 3000);
                return;
              }
              if (
                error &&
                error?.response?.status === 403 &&
                error?.response?.data?.message === 'Mentor Blocked'
              ) {
                toast.warn(error?.response?.data?.message);
                Cookies.remove('accessToken');
                localStorage.clear();
                setTimeout(() => {
                  window.location.replace('/pages/mentor/login');
                }, 3000);
                return;
              }
              if (error && error.response.status === 403) {
                toast.warn(error.response.data.message)
                Cookies.remove('accessToken')
                localStorage.clear()
                router.push('/')
              }
              console.error("Error checking user:", error);
            } finally {
              setLoading(false);
            }
          };

          checkUser();
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);


  const handleVerify = async () => {
    const userJson = localStorage.getItem("mentor");
    if (!userJson) {
      toast.error("Mentor not found in localStorage");
      return;
    }
    const user = JSON.parse(userJson);
    if (!user.email) {
      toast.error("Mentor email not found");
      return;
    }

    try {
      const response = await mentorApis.reVerify(user.email)
      if (response && response.data.success) {
        toast.success('Mail sent your email')
        router.push('/pages/mentor/verify-alert')
      }
    } catch (error: any) {
      if (error && error.response?.status === 403) {
        toast.warn(error.response?.data.message)
        return
      }
      if (error && error.response?.status === 401) {
        toast.warn(error.response.data.message);
        Cookies.remove('accessToken');
        localStorage.clear();
        setTimeout(() => {
          window.location.replace('/pages/mentor/login');
        }, 3000);
        return;
      }
      if (
        error &&
        error?.response?.status === 403 &&
        error?.response?.data?.message === 'Mentor Blocked'
      ) {
        toast.warn(error?.response?.data?.message);
        Cookies.remove('accessToken');
        localStorage.clear();
        setTimeout(() => {
          window.location.replace('/pages/mentor/login');
        }, 3000);
        return;
      }
    }
  };


  // update profile
  const onSubmit: SubmitHandler<MentorProfile> = async (data: any) => {
    try {
      console.log('d: ', data)

      const formData = new FormData();

      // Check if profile image exists and append it to form data
      if (data.profile && data.profile) {
        formData.append("profile", data.profile);
      }

      // Append other fields
      for (const key of Object.keys(data)) {
        if (key !== "profile") {
          formData.append(key, data[key]);
        }
      }

      // Log form data for debugging
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }


      const response = await mentorApis.profileUpdate(formData)
      
      console.log('profile update: ', response)

      if (response && response.data && response.data.success) {
        toast.success('Profile Updated')
        dispatch(setUser({
          userId: response.data.result._id,
          username: response.data.result.username,
          email: response.data.result.email,
          role: response.data.result.role,
        }));

        setLocalUser({
          email: response.data.result.email,
          username: response.data.result.username,
          phone: response.data.result.phone,
          profileImage: response.data.result.profilePicUrl, // Update the profile picture
        });

        reset({
          username: response.data.result.username,
          phone: response.data.result.phone,
          profile: response.data.result.profilePicUrl,
        });
      }
    } catch (error: any) {
      if (error && error.response?.status === 401 && error.response.data.message === 'Mentor Not Verified') {
        console.log('401 log', error.response.data.message)
        toast.warn(error.response.data.message);
        return;
    }
      if (error && error.response?.status === 401) {
        toast.warn(error.response.data.message);
        Cookies.remove('accessToken');
        localStorage.clear();
        setTimeout(() => {
          window.location.replace('/pages/mentor/login');
        }, 3000);
        return;
      }
      if (
        error &&
        error?.response?.status === 403 &&
        error?.response?.data?.message === 'Mentor Blocked'
      ) {
        toast.warn(error?.response?.data?.message);
        Cookies.remove('accessToken');
        localStorage.clear();
        setTimeout(() => {
          window.location.replace('/pages/mentor/login');
        }, 3000);
        return;
      }
      if (error && error.response?.status === 403) {
        console.log('403')
        toast.warn(error.response?.data.message)
        Cookies.remove('accessToken')
        localStorage.clear()
        setTimeout(() => {
          // router.push('/pages/mentor/login')
          window.location.replace('/pages/mentor/login')
        },3000)
        return
      }
      if (error && error.response?.status === 401) {
        console.log('401')
        toast.warn(error.response.data.message)
        return
      }
    }
  }


   // Handle profile image change
   const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
    if (file) {
      // Create a URL for the selected image
      const imageUrl = URL.createObjectURL(file);

      // Update the localUser state with the new profile image URL
      setLocalUser((prev) => ({
        ...prev,
        profileImage: imageUrl, // Store the image URL for display
      }));

      // Set the profile image in the form data for upload
      setValue("profile", file); // Correctly set the file object here, not a string
    }
  };


  return (
    <>
      <div className="flex min-h-screen flex-col bg-white">
        {/* Mentor Header */}
        {/* <MentorHeader /> */}
        <Navbar />

        <ToastContainer
          autoClose={2000}
          pauseOnHover={false}
          transition={Slide}
          hideProgressBar={false}
          closeOnClick={false}
          pauseOnFocusLoss={true}
        />

        {/* Profile Section */}
        <div className="flex-1 p-6 flex justify-center items-start">
          <form
            className="bg-white border-2 border-[#D6D1F0] shadow-lg w-[500px] p-6 rounded-lg"
            onSubmit={handleSubmit(onSubmit)}
          >
           <div className="flex flex-col items-center mb-6 relative">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center ${isVerified ? "border-4 border-[#22177A]" : "bg-gray-300"}`}
                onClick={() => document.getElementById('profile-input')?.click()}
              >
                {localUser.profileImage || "" ? (
                  <img
                    src={localUser.profileImage || ""} 
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                    width={96}  
                    height={96}
                  />
                ) : (
                  <span className="text-white-500 text-sm">No Profile</span>
                )}
                <input
                  id="profile-input"
                  type="file"
                  {...register('profile')}
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
                {isVerified && (
                  <div className="absolute top-0 right-0 w-8 h-8 bg-[#22177A] rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-white text-xl font-bold">✔</span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              {/* Email Field - Read-Only */}
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  value={localUser.email}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-md cursor-not-allowed"
                />
              </div>

              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-md"
                  {...register("username", {
                    required: "Username is required",
                    pattern: {
                      value: /^(?!.* {2})[A-Za-z0-9._]+(?: [A-Za-z0-9._]+)*$/,
                      message: "Username can only contain letters, numbers, periods, and underscores. It must start with a letter.",
                    },
                  })}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">
                  Phone
                </label>
                <input
                  id="phone"
                  type="text"
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-md"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/, // Matches a 10-digit phone number
                      message: "Please enter a valid phone number (10 digits)",
                    },
                  })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Verify Button (if not verified) */}
              {!loading && !isVerified && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={handleVerify}
                    className="bg-[#ffffff] border border-[#22177A] text-black px-6 py-2 rounded-[13px] hover:bg-gray-100 transition-colors"
                  >
                    Verify Your Account !!!
                  </button>
                </div>
              )}

              {/* Update Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-[#22177A] text-white px-14 py-2 rounded-[13px] focus:outline-none focus:ring-2 focus:ring-[#433D8B]"
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      {/* <MentorFooter /> */}

      <Footer />
    </>
  );
};

export default MentorProfile;
