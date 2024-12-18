import { NextRequest, NextResponse } from "next/server";
import { tokenVerify } from "./lib/security/tokenVerify";

const routeGroups = {
    //students
    publicStudentRoutes: new Set([ '/pages/student/login', '/pages/student/signup' ]),
    studentProtectedRoutes: new Set([ '/pages/student/profile' ]),

    //mentors
    publicMentorRoutes: new Set([ '/pages/mentor/login', '/pages/mentor/signup' ]),
    mentorProtectedRoutes: new Set([ '/pages/mentor/profile' ]),

    //admin
    adminProtectedRoutes: new Set(['/pages/adminDashboard', '/pages/userManagement']),
};

export async function middleware (req: NextRequest) {

    const url = req.nextUrl.clone()
    const pathname = url.pathname

    const role = await tokenVerify('accessToken', req)

    //students public routes
    if(routeGroups.publicStudentRoutes.has(pathname)){
        if(role === 'student'){
            url.pathname = '/'
            return NextResponse.redirect(url)
        }
        return NextResponse.next();
    }

    //student protected routes
    if(routeGroups.studentProtectedRoutes.has(pathname)){
        if(role !== 'student'){
            url.pathname = '/pages/student/login'
            return NextResponse.redirect(url)
        }
    }


      //mentor public routes
      if(routeGroups.publicMentorRoutes.has(pathname)){
        if(role === 'mentor'){
            url.pathname = '/'
            return NextResponse.redirect(url)
        }
        return NextResponse.next()
    }

    //mentor protected routes
    if(routeGroups.mentorProtectedRoutes.has(pathname)){
        if(role !== 'mentor'){
            url.pathname = '/pages/mentor/login'
            return NextResponse.redirect(url)
        }
    }


    //     //////
    // if (url.pathname.startsWith('/pages/student/login') || url.pathname.startsWith('/pages/student/signup')) {
    //     if (role === 'student') {
    //         url.pathname = '/';
    //         return NextResponse.redirect(url);
    //     }
    //     return NextResponse.next();
    // }

    // if (url.pathname.startsWith('/pages/mentor/login') || url.pathname.startsWith('/pages/mentor/signup')) {
    //     if (role === 'mentor') {
    //         url.pathname = '/';
    //         return NextResponse.redirect(url);
    //     }
    //     return NextResponse.next();
    // }

    // if(url.pathname.startsWith('/pages/student/profile')){
    //     if(role === 'student'){
    //         url.pathname = '/pages/student/login'
    //         return NextResponse.redirect(url)
    //     }
    // }

    // if(url.pathname.startsWith('/pages/mentor/dashboard')){
    //     if(role == 'mentor'){
    //         url.pathname = '/pages/mentor/login'
    //         return NextResponse.redirect(url)
    //     }
    // }

    return NextResponse.next();
}