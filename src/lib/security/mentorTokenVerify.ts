import { JWT_SECRET } from "@/utils/constant";
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

export const mentorTokenVerify = async (mentorToken: string, req: NextRequest): Promise<boolean>  => {
    const secret = JWT_SECRET
    const token = req.cookies.get(mentorToken)
    if(!token?.value){
        return false
    }

    try{
        const { payload } = await jwtVerify(token.value, new TextEncoder().encode(secret))
        return !!payload
    }catch(error){
        console.error('Token verification failed:', error);
        return false;
    }
}