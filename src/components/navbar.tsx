

// "use client";

// import { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { clearUserDetials } from "@/redux/slices/userSlice"; 
// import { clearUserDetials as clearMentor } from "@/redux/slices/mentorSlice"; 

// interface User {
//   username: string;
// }

// interface Mentor {
//   username: string;
// }

// const Navbar = () => {
//   const [isDropdownOpen, setDropdownOpen] = useState(false);
//   const [isMenuOpen, setMenuOpen] = useState(false);
//   const router = useRouter();

//   const dispatch = useDispatch();
//   const Uname = useSelector((state: RootState) => state.user.username);
//   const Mname = useSelector((state: RootState) => state.mentor.username);

//   const [user, setUser] = useState<User | null>(null);
//   const [mentor, setMentor] = useState<Mentor | null>(null);

//   const toggleDropdown = () => {
//     setDropdownOpen((prev) => !prev);
//   };

//   const toggleMenu = () => {
//     setMenuOpen((prev) => !prev);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     Cookies.remove("accessToken");
//     Cookies.remove("refreshToken");
//     dispatch(clearUserDetials());
//     dispatch(clearMentor());
//     window.location.replace('/');
//   };

//   const getInitials = (name: string | undefined) => {
//     if (!name) return "U";
//     return name.split(" ").map((word) => word[0].toUpperCase()).join("");
//   };

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedMentor = localStorage.getItem("mentor");

//     if (storedUser !== undefined) {
//       try {
//         setUser(JSON.parse(String(storedUser)) as User);
//       } catch (error) {
//         console.error("Error parsing user data:", error);
//         setUser(null);
//       }
//     }

//     if (storedMentor !== undefined) {
//       try {
//         setMentor(JSON.parse(String(storedMentor)) as Mentor);
//       } catch (error) {
//         console.error("Error parsing mentor data:", error);
//         setMentor(null);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (Uname) {
//       setUser({ username: Uname });
//     }
//     if (Mname) {
//       setMentor({ username: Mname });
//     }
//   }, [Uname, Mname]);

//   const renderNavLinks = () => (
//     <nav className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-black sm:ml-4">
//       <a href="/" className="inline-block py-1 px-4 hover:bg-[#6E40FF] hover:text-white rounded-lg transition-all">Home</a>
//       {user && (
//         <a href="/pages/student/course" className="inline-block py-1 px-4 hover:bg-[#6E40FF] hover:text-white rounded-lg transition-all">Courses</a>
//       )}
//       {mentor && (
//         <a href="/pages/mentor/courses" className="inline-block py-1 px-4 hover:bg-[#6E40FF] hover:text-white rounded-lg transition-all">Courses</a>
//       )}
//       <a href="/pages/login-role" className="inline-block py-1 px-4 hover:bg-[#6E40FF] hover:text-white rounded-lg transition-all">Login</a>
//       <a href="/pages/signup-role" className="inline-block py-1 px-4 hover:bg-[#6E40FF] hover:text-white rounded-lg transition-all">Signup</a>
//     </nav>
//   );

//   const renderProfileSection = () => {
//     const initials = user ? getInitials(Uname) : mentor ? getInitials(Mname) : "G";

//     return (
//       <div className="relative">
//         <div className="flex items-center gap-2 cursor-pointer" onClick={toggleDropdown}>
//           <div className="w-8 h-8 rounded-full bg-[#6E40FF] text-white flex items-center justify-center font-bold">
//             {initials}
//           </div>
//           <span className="text-sm font-medium text-[#6E40FF]">{user ? user.username : mentor?.username}</span>
//         </div>

//         {isDropdownOpen && (
//           <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md rounded-md">
//             <a href={user ? "/pages/student/profile" : "/pages/mentor/profile"} className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#6E40FF] hover:text-white">
//               View Profile
//             </a>
//             <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#6E40FF] hover:text-white" onClick={handleLogout}>
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <header className="bg-white shadow-md py-4 px-4 sm:px-8">
//       <div className="max-w-6xl mx-auto flex items-center justify-between">
//         {/* Left Side: Logo */}
//         <div className="flex items-center justify-center space-x-2 text-xl font-bold">
//           <span className="text-[#6E40FF]">Learn</span>
//           <span className="px-3 py-1 text-white bg-[#6E40FF] rounded-full shadow-md">
//             &Grow
//           </span>
//         </div>

//         {/* Menu Toggle for Mobile */}
//         <button className="sm:hidden" onClick={toggleMenu}>
//           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-[#6E40FF]">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
//           </svg>
//         </button>

//         {/* Navigation Links */}
//         <div className={`sm:flex items-center gap-8 ${isMenuOpen ? 'flex' : 'hidden'} sm:block`}>
//           {renderNavLinks()}
//         </div>

//         {/* Profile Section */}
//         <div className="hidden sm:block">
//           {renderProfileSection()}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;



///////////////////////////////////////////////////



"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearUserDetials } from "@/redux/slices/userSlice"; // You can create this action
import { clearUserDetials as clearMentor } from "@/redux/slices/mentorSlice"; // You can create this action

interface User {
  username: string;
}

interface Mentor {
  username: string;
}

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const dispatch = useDispatch();

  // Fetch user and mentor info from Redux state
  const Uname = useSelector((state: RootState) => state.user.username);
  const Mname = useSelector((state: RootState) => state.mentor.username);

  // State to determine if the user or mentor is present
  const [user, setUser] = useState<User | null>(null);
  const [mentor, setMentor] = useState<Mentor | null>(null);

  // Handle dropdown toggle
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Handle logout
  const handleLogout = () => {
    // Clear localStorage and cookies
    localStorage.clear();
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    // Dispatch Redux actions to reset user and mentor
    dispatch(clearUserDetials());
    dispatch(clearMentor());

    // Redirect to homepage
    router.replace("/");
  };

  // Helper function to generate initials
  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name.split(" ").map((word) => word[0].toUpperCase()).join("");
  };

  useEffect(() => {
    // Check if user or mentor data is available in localStorage
    const storedUser = localStorage.getItem("user");
    const storedMentor = localStorage.getItem("mentor");

    if (storedUser !== undefined) {
      try {
        setUser(JSON?.parse(String(storedUser)) as User);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    }

    if (storedMentor !== undefined) {
      try {
        setMentor(JSON?.parse(String(storedMentor)) as Mentor);
      } catch (error) {
        console.error("Error parsing mentor data:", error);
        setMentor(null);
      }
    }
  }, []);

  // Use Redux data if available, otherwise use localStorage
  useEffect(() => {
    if (Uname) {
      setUser({ username: Uname });
    }
    if (Mname) {
      setMentor({ username: Mname });
    }
  }, [Uname, Mname]);

  if (mentor) {
    const initials = getInitials(Mname);

    return (
      <>
        {/* First Header */}

        {/* <header className="bg-[#433D8B] text-white py-4 text-center text-xl font-bold">
          Learn&Grow
        </header> */}

        {/* <header className="bg-gradient-to-r from-[#6E40FF] to-[#4A20D0] text-white py-6 text-center">
          <h1 className="text-2xl font-extrabold tracking-wide uppercase">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-white">
              Learn&Grow
            </span>
          </h1>
        </header> */}

        <header className="bg-gradient-to-r from-[#6E40FF] to-[#4A20D0] text-white py-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-xl font-bold">
            <span className="text-[#FFFFFF]">Learn</span>
            <span className="px-3 py-1 text-[#6E40FF] bg-[#FFFFFF] rounded-full shadow-md">
              &Grow
            </span>
          </div>
        </header>

        {/* Second Header */}
        <header className="bg-white shadow-md py-4 px-8">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            {/* Navigation Links */}
            <nav className="flex gap-x-8 text-black">
              <a href="/pages/mentor/dashboard" className="inline-block py-1 px-4 hover:bg-[#6E40FF] hover:text-white hover:decoration-[#6E40FF] hover:decoration-4 rounded-lg transition-all">
                Dashboard
              </a>
              <a href="/pages/mentor/courses" className="inline-block py-1 px-4 hover:bg-[#6E40FF] hover:text-white hover:decoration-[#6E40FF] hover:decoration-4 rounded-lg transition-all">
                Courses
              </a>
              <a href="/pages/mentor/wallet" className="inline-block py-1 px-4 hover:bg-[#6E40FF] hover:text-white hover:decoration-[#6E40FF] hover:decoration-4 rounded-lg transition-all">
                Wallet
              </a>
            </nav>

            {/* User Profile Section */}
            <div className="relative">
              <div className="flex items-center gap-2 cursor-pointer" onClick={toggleDropdown}>
                {/* Circle with Initials */}
                <div className="w-8 h-8 rounded-full bg-[#6E40FF] text-white flex items-center justify-center font-bold">
                  {initials}
                </div>
                <span className="text-sm font-medium text-[#6E40FF]">
                  {mentor.username}
                </span>
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md rounded-md">
                  <a href="/pages/mentor/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#6E40FF] hover:text-white">
                    View Profile
                  </a>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#6E40FF] hover:text-white" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      </>
    );
  }

  if (user) {
    const initials = getInitials(Uname);

    return (
      <header className="bg-white shadow-md py-4 pl-[4rem] pr-[1rem]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Left Side: Logo */}
          {/* <div className="text-[#433D8B] text-xl font-bold">Learn&Grow</div> */}

          <div className="flex items-center justify-center space-x-2 text-xl font-bold">
            <span className="text-[#6E40FF]">Learn</span>
            <span className="px-3 py-1 text-white bg-[#6E40FF] rounded-full shadow-md">
              &Grow
            </span>
          </div>

          {/* Right Side: Navigation */}
          <nav className="flex items-center gap-x-8 text-black ml-4">
            <a href="/pages/home" className="inline-block py-1 px-4 hover:bg-[#6E40FF] hover:text-white hover:decoration-[#6E40FF] hover:decoration-4 rounded-lg transition-all">Home</a>
            <a href="/pages/student/course" className="inline-block py-1 px-4 hover:bg-[#6E40FF] hover:text-white hover:decoration-[#6E40FF] hover:decoration-4 rounded-lg transition-all">Courses</a>

            <div className="relative">
              <div className="flex items-center gap-2 cursor-pointer" onClick={toggleDropdown}>
                {/* Circle with Initials */}
                <div className="w-8 h-8 rounded-full bg-[#6E40FF] text-white flex items-center justify-center font-bold">
                  {initials}
                </div>
                <span className="text-sm font-medium text-[#6E40FF]">
                  {user.username}
                </span>
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md rounded-md">
                  <a href="/pages/student/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#6E40FF] hover:text-white">
                    View Profile
                  </a>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#6E40FF] hover:text-white" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-md py-4 pl-[4rem] pr-[1rem]">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left Side: Logo */}
        {/* <div className="text-[#433D8B] text-xl font-bold">Learn&Grow</div> */}

        <div className="flex items-center justify-center space-x-2 text-xl font-bold">
          <span className="text-[#6E40FF]">Learn</span>
          <span className="px-3 py-1 text-white bg-[#6E40FF] rounded-full shadow-md">
            &Grow
          </span>
        </div>


        {/* Right Side: Navigation */}
        <nav className="flex items-center gap-x-8 text-black ml-4">
          <a href="/" className="inline-block py-1 px-4 hover:bg-[#6E40FF] hover:text-white hover:decoration-[#6E40FF] hover:decoration-4 rounded-lg transition-all">Home</a>
          <a href="/pages/student/course" className="inline-block py-1 px-4 hover:bg-[#6E40FF] hover:text-white hover:decoration-[#6E40FF] hover:decoration-4 rounded-lg transition-all">Courses</a>
          <a href="/pages/login-role" className="inline-block py-1 px-4 hover:bg-[#6E40FF] hover:text-white hover:decoration-[#6E40FF] hover:decoration-4 rounded-lg transition-all">Login</a>
          <a href="/pages/signup-role" className="inline-block py-1 px-4 hover:bg-[#6E40FF] hover:text-white hover:decoration-[#6E40FF] hover:decoration-4 rounded-lg transition-all">Signup</a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;




//////////////////////////////////////////////



// "use client";

// import { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";

// interface User {
//   username: string;
// }

// interface Mentor {
//   username: string;
// }

// const Navbar = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [mentor, setMentor] = useState<Mentor | null>(null);
//   const [isDropdownOpen, setDropdownOpen] = useState(false);
//   const router = useRouter();
//   const Uname = useSelector((state: RootState) => state.user.username);
//   const Mname = useSelector((state: RootState) => state.mentor.username);
//   console.log('u', Uname)
//   console.log('m', Mname)

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedMentor = localStorage.getItem("mentor");

//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser) as User);
//       } catch (error) {
//         console.error("Error parsing user data:", error);
//         setUser(null);
//       }
//     }

//     if (storedMentor) {
//       try {
//         setMentor(JSON.parse(storedMentor) as Mentor);
//       } catch (error) {
//         console.error("Error parsing mentor data:", error);
//         setMentor(null);
//       }
//     }
//   }, []);

//   const toggleDropdown = () => {
//     setDropdownOpen((prev) => !prev);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     Cookies.remove("accessToken");
//     Cookies.remove("refreshToken");
//     setUser(null);
//     setMentor(null);
//     router.push("/");
//   };

//   if (mentor) {
//     const initials = Mname
//       ? Mname
//           .split(" ")
//           .map((word) => word[0].toUpperCase())
//           .join("")
//       : "U";

//     return (
//       <>
//         {/* First Header */}
//         <header className="bg-[#433D8B] text-white py-4 text-center text-xl font-bold">
//           Learn&Grow
//         </header>

//         {/* Second Header */}
//         <header className="bg-white shadow-md py-4 px-8">
//           <div className="max-w-6xl mx-auto flex items-center justify-between">
//             {/* Navigation Links */}
//             <nav className="flex gap-x-8 text-black">
//               <a
//                 href="/pages/mentor/dashboard"
//                 className="hover:text-[#433D8B]"
//               >
//                 Dashboard
//               </a>
//             </nav>

//             {/* User Profile Section */}
//             <div className="relative">
//               <div
//                 className="flex items-center gap-2 cursor-pointer"
//                 onClick={toggleDropdown}
//               >
//                 {/* Circle with Initials */}
//                 <div className="w-8 h-8 rounded-full bg-[#433D8B] text-white flex items-center justify-center font-bold">
//                   {initials}
//                 </div>
//                 <span className="text-sm font-medium text-[#433D8B]">
//                   {mentor.username}
//                 </span>
//               </div>

//               {/* Dropdown Menu */}
//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md rounded-md">
//                   <a
//                     href="/pages/mentor/profile"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                   >
//                     View Profile
//                   </a>
//                   <button
//                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     onClick={handleLogout}
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>
//       </>
//     );
//   }

//   if (user) {
//     const initials = user.username
//       ? user.username
//           .split(" ")
//           .map((word) => word[0].toUpperCase())
//           .join("")
//       : "U";

//     return (
//       <header className="bg-white shadow-md py-4 pl-[4rem] pr-[1rem]">
//         <div className="max-w-6xl mx-auto flex items-center justify-between">
//           {/* Left Side: Logo */}
//           <div className="text-[#433D8B] text-xl font-bold">Learn&Grow</div>

//           {/* Right Side: Navigation */}
//           <nav className="flex items-center gap-x-8 text-black ml-4">
//             <a href="/pages/home" className="hover:text-[#433D8B]">Home</a>
//             <a href="#" className="hover:text-[#433D8B]">Courses</a>

//             <div className="relative">
//               <div
//                 className="flex items-center gap-2 cursor-pointer"
//                 onClick={toggleDropdown}
//               >
//                 {/* Circle with Initials */}
//                 <div className="w-8 h-8 rounded-full bg-[#433D8B] text-white flex items-center justify-center font-bold">
//                   {initials}
//                 </div>
//                 <span className="text-sm font-medium text-[#433D8B]">
//                   {user.username}
//                 </span>
//               </div>

//               {/* Dropdown Menu */}
//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md rounded-md">
//                   <a
//                     href="/pages/student/profile"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                   >
//                     View Profile
//                   </a>
//                   <button
//                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     onClick={handleLogout}
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </nav>
//         </div>
//       </header>
//     );
//   }

//   return (
//     <header className="bg-white shadow-md py-4 pl-[4rem] pr-[1rem]">
//       <div className="max-w-6xl mx-auto flex items-center justify-between">
//         {/* Left Side: Logo */}
//         <div className="text-[#433D8B] text-xl font-bold">Learn&Grow</div>

//         {/* Right Side: Navigation */}
//         <nav className="flex items-center gap-x-8 text-black ml-4">
//           <a href="/" className="hover:text-[#433D8B]">Home</a>
//           <a href="#" className="hover:text-[#433D8B]">Courses</a>
//           <a href="/pages/login-role" className="hover:text-[#433D8B]">
//             Login
//           </a>
//           <a href="/pages/signup-role" className="hover:text-[#433D8B]">
//             Signup
//           </a>
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Navbar;

