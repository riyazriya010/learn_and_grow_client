

import { NextRequest, NextResponse } from "next/server";
import { tokenVerify } from "./lib/security/tokenVerify";

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone()

    if (
        req.nextUrl.pathname.startsWith("/_next/") || // Static files
        req.nextUrl.pathname.startsWith("/api/") ||  // API routes
        /\.(.*)$/.test(req.nextUrl.pathname)         // File extensions
    ) {
        return NextResponse.next();
    }

    const role = await tokenVerify("accessToken", req)
    console.log('role: ', role)


    // Students LoggedIn Route Auth
    if (role === 'student') {
        if (url.pathname.startsWith('/pages/student/login') ||
            url.pathname.startsWith('/pages/student/signup') ||
            url.pathname.startsWith('/pages/login-role') ||
            url.pathname.startsWith('/pages/signup-role')
        ) {
            if (role === 'student') {
                url.pathname = '/pages/home';
                return NextResponse.redirect(url);
            }
            return NextResponse.next();
        }
    }


    // Mentors LoggedIn Route Auth
    if (role === 'mentor') {
        if (url.pathname.startsWith('/pages/mentor/login') ||
            url.pathname.startsWith('/pages/mentor/signup') ||
            url.pathname.startsWith('/pages/login-role') ||
            url.pathname.startsWith('/pages/signup-role')
        ) {
            if (role === 'mentor') {
                url.pathname = '/pages/mentor/dashboard';
                return NextResponse.redirect(url);
            }
            return NextResponse.next();
        }
    }


    // Admin LoggedIn Route Auth
    if (role === 'admin') {
        if (url.pathname === '/pages/login') {
            if (role === 'admin') {
                url.pathname = '/pages/dashboard';
                return NextResponse.redirect(url);
            }
            return NextResponse.next();
        }
    }


    // Students LoggedOut Route Auth

    if (url.pathname.startsWith('/pages/home') ||
        url.pathname.startsWith('/pages/student/profile') ||
        url.pathname.startsWith('/pages/student/verify-alert') ||
        url.pathname.startsWith('/pages/student/verify') ||
        url.pathname.startsWith('/pages/student/course-play') ||
        url.pathname.startsWith('/pages/student/get-certificates') ||
        url.pathname.startsWith('/pages/student/payment-failure') ||
        url.pathname.startsWith('/pages/student/payment-success') ||
        url.pathname.startsWith('/pages/student/purchased-course') ||
        url.pathname.startsWith('/pages/student/quizz') ||
        url.pathname.startsWith('/pages/student/summary-page') ||
        url.pathname.startsWith('/pages/student/certificate-view') ||
        url.pathname.startsWith('/pages/student/chat')
    ) {
        if (role !== 'student') {
            url.pathname = '/pages/student/login';
            return NextResponse.redirect(url);
        }
    }


    // Mentor LoggedOut Route Auth

    if (url.pathname.startsWith('/pages/mentor/dashboard') ||
        url.pathname.startsWith('/pages/mentor/profile') ||
        url.pathname.startsWith('/pages/mentor/verify-alert') ||
        url.pathname.startsWith('/pages/mentor/verify') ||
        url.pathname.startsWith('/pages/mentor/add-chapter') ||
        url.pathname.startsWith('/pages/mentor/add-course') ||
        url.pathname.startsWith('/pages/mentor/add-quizz') ||
        url.pathname.startsWith('/pages/mentor/chapters') ||
        url.pathname.startsWith('/pages/mentor/courses') ||
        url.pathname.startsWith('/pages/mentor/edit-chapter') ||
        url.pathname.startsWith('/pages/mentor/edit-course') ||
        url.pathname.startsWith('/pages/mentor/edit-quizz') ||
        url.pathname.startsWith('/pages/mentor/quizz') ||
        url.pathname.startsWith('/pages/mentor/wallet') || 
        url.pathname.startsWith('/pages/mentor/chat')
    ) {
        if (role !== 'mentor') {
            url.pathname = '/pages/mentor/login';
            return NextResponse.redirect(url);
        }
    }


    // Admin LoggedOut Route Auth

    if (url.pathname.startsWith('/pages/dashboard') ||
        url.pathname.startsWith('/pages/userManagement') ||
        url.pathname.startsWith('/pages/mentorManagement') ||
        url.pathname.startsWith('/pages/category-management') ||
        url.pathname.startsWith('/pages/course-management') ||
        url.pathname.startsWith('/pages/wallet')
    ) {
        if (role !== 'admin') {
            url.pathname = '/pages/login';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}


export const config = {
    matcher: ["/pages/:path*"],
};
