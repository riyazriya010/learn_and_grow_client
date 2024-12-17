const DOMAIN = process.env.NEXT_PUBLIC_BACKEND_URL

const USER_SERVICE_DOAMIN = DOMAIN


//back end api services
export const USER_SERVICE_URL = `${USER_SERVICE_DOAMIN}/api/user-service`;
export const MENTOR_SERVICE_URL = `${USER_SERVICE_DOAMIN}/api/mentor-service`;



// fire base config details
export const APIKEY = process.env.NEXT_PUBLIC_APIKEY
export const AUTHDOMAIN = process.env.NEXT_PUBLIC_AUTHDOMAIN
export const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID
export const STORAGEBUCKET = process.env.NEXT_PUBLIC_STORAGEBUCKET
export const MESSAGINGSENDER_ID = process.env.NEXT_PUBLIC_MESSAGINGSENDER_ID
export const APP_ID = process.env.NEXT_PUBLIC_APP_ID
export const MEASUREMENT_ID = process.env.NEXT_PUBLIC_MEASUREMENT_ID