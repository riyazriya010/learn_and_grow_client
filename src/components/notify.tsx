// "use client"

// import Link from 'next/link';
// import React from 'react';

// import { ToastContainer, toast, Slide, Flip, Bounce, Zoom } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function Notify(){
//   const notify1 = () => toast.error("toast 1", {
//     theme: 'colored',
//     icon:false,
//     delay: 1000
//   });
//   const notify2 = () => toast.success("toast 2", {
//     theme: "colored"
//   });

//   const CustomToastMessage = () => {
//     return(
//         <div>
//             <p>This is Custom Toast Message</p><br />
//             <Link href='/pages/student/signup'>
//             <button style={{borderRadius: '22', border:'black', backgroundColor: 'white', color: 'black'}}>Click here</button>
//             </Link>
//         </div>
//     )
//   }

//   const showCustomToast = () => {
//     toast.success(<CustomToastMessage />, {theme: 'colored'})
//   }

//   return (
//     <div>
//       <button onClick={notify1} style={{backgroundColor: 'blue', color: "white"}}>Notify!</button>
//       <button onClick={notify2} style={{backgroundColor: 'blue', color: "white"}}>Notify!</button><br />
//       <button onClick={showCustomToast} style={{borderRadius: '22', border:'solid black 2px', backgroundColor: 'white', color: 'black'}}>Notify!</button>
//       <ToastContainer 
//       position='top-center'
//       autoClose={2000}
//       pauseOnHover={false}
//       transition={Slide}
//       hideProgressBar={false}
//       closeOnClick={false}
//       limit={5}
//       theme='dark' //dark lite colour
//       pauseOnFocusLoss={true} // stay pause user on another tab
//       />
//     </div>
//   );
// }

// export default Notify