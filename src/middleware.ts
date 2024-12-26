

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
    if(role === 'student'){
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
    if(role === 'mentor'){
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
    if(role === 'admin'){
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
        url.pathname.startsWith('/pages/student/verify')
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
        url.pathname.startsWith('/pages/mentor/verify')
    ) {
        if (role !== 'mentor') {
            url.pathname = '/pages/mentor/login';
            return NextResponse.redirect(url);
        }
    }


    // Admin LoggedOut Route Auth


    if (url.pathname.startsWith('/pages/dashboard') 
        || url.pathname.startsWith('/pages/userManagement') || url.pathname.startsWith('/pages/mentorManagement')) {
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


////////////////////////////////////////////////////////////////

// import { NextRequest, NextResponse } from "next/server";
// import { tokenVerify } from "./lib/security/tokenVerify";

// export async function middleware(req: NextRequest) {
//     const url = req.nextUrl.clone();
//     const role = await tokenVerify("accessToken", req);
//     const isLoggedIn = role !== null;

//     // Define routes for each role
//     const routes = {
//         student: {
//             login: '/pages/student/login',
//             signup: '/pages/student/signup',
//             dashboard: '/pages/home',
//             protected: ['/pages/home', '/pages/student/profile', '/pages/student/verify-alert', '/pages/student/verify'],
//             public: ['/pages/student/forget-password', '/pages/login-role', '/pages/signup-role']
//         },
//         mentor: {
//             login: '/pages/mentor/login',
//             signup: '/pages/mentor/signup',
//             dashboard: '/pages/mentor/dashboard',
//             protected: ['/pages/mentor/dashboard', '/pages/mentor/profile', '/pages/mentor/verify-alert', '/pages/mentor/verify'],
//             public: ['/pages/mentor/forget-password', '/pages/login-role', '/pages/signup-role']
//         },
//         admin: {
//             login: '/pages/login',
//             dashboard: '/pages/dashboard',
//             protected: ['/pages/dashboard', '/pages/userManagement', '/pages/mentorManagement'],
//             public: [] // Assign an empty array for public routes
//         }
//     };

//     // Check if the request is for static files or API routes
//     if (
//         req.nextUrl.pathname.startsWith("/_next/") || // Static files
//         req.nextUrl.pathname.startsWith("/api/") ||  // API routes
//         /\.(.*)$/.test(req.nextUrl.pathname)         // File extensions
//     ) {
//         return NextResponse.next();
//     }

//     // Redirect logged-in users away from the root page
//     if (isLoggedIn && url.pathname === '/') {
//         url.pathname = '/pages/home'; // Redirect to a default dashboard or home page
//         return NextResponse.redirect(url);
//     }

//     // Handle role-based redirection
//     for (const [key, value] of Object.entries(routes)) {
//         if (isLoggedIn && url.pathname.startsWith(value.login)) {
//             url.pathname = value.dashboard;
//             return NextResponse.redirect(url);
//         }

//         if (!isLoggedIn && value.protected.some(path => url.pathname.startsWith(path))) {
//             url.pathname = value.login;
//             return NextResponse.redirect(url);
//         }

//         if (isLoggedIn && value.public.some(path => url.pathname.startsWith(path))) {
//             return NextResponse.next();
//         }
//     }

//     // If no conditions matched, proceed to the next response
//     return NextResponse.next();
// }

// export const config = {
//     matcher: ["/pages/:path*"],
// };


////////////////////////////////////////////////////////////////

// // import { NextRequest, NextResponse } from "next/server";
// // import { tokenVerify } from "./lib/security/tokenVerify";

// // export async function middleware(req: NextRequest) {
// //     const url = req.nextUrl.clone();

// //     // Skip unnecessary paths
// //     if (
// //         req.nextUrl.pathname.startsWith("/_next/") || // Static files
// //         req.nextUrl.pathname.startsWith("/api/") ||  // API routes
// //         /\.(.*)$/.test(req.nextUrl.pathname)         // File extensions
// //     ) {
// //         return NextResponse.next();
// //     }

// //     // Verify token and get role
// //     const role = await tokenVerify("accessToken", req) as "student" | "mentor" | "admin" | null;
// //     console.log("role: ", role);

// //     // Define role-based redirects
// //     const routes = {
// //         student: {
// //             login: "/pages/home",
// //             signup: "/pages/home",
// //             "/pages/login-role": "/pages/home",
// //             "/pages/signup-role": "/pages/home",
// //         },
// //         mentor: {
// //             login: "/pages/home",
// //             signup: "/pages/home",
// //             "login-role": "/pages/home",
// //             "signup-role": "/pages/home",
// //         },
// //         admin: {
// //             login: "/pages/dashboard",
// //             dashboard: "/pages/dashboard",
// //             userManagement: "/pages/dashboard",
// //             mentorManagement: "/pages/dashboard",
// //         },
// //     };

// //     const pathSegments = url.pathname.split("/").filter(Boolean); // Extract route parts
// //     const basePath = pathSegments[1]; // E.g., "login", "signup"

// //     // Redirect based on role and path
// //     if (role && routes[role] && basePath in routes[role]) {
// //         url.pathname = routes[role][basePath as keyof typeof routes[typeof role]];
// //         return NextResponse.redirect(url);
// //     }

// //     // Default behavior for unauthorized access
// //     if (["dashboard", "userManagement", "mentorManagement"].includes(basePath) && role !== "admin") {
// //         url.pathname = "/pages/login";
// //         return NextResponse.redirect(url);
// //     }

// //     return NextResponse.next();
// // }

// // export const config = {
// //     matcher: ["/pages/:path*"],
// // };