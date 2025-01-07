// // 'use client'

// // import Navbar from "../navbar";
// // import { ToastContainer, toast, Slide, Flip, Zoom, Bounce } from 'react-toastify';
// // import 'react-toastify/dist/ReactToastify.css';
// // import Footer from "../loggedoutNav/footer";
// // import { useState } from "react";

// // const SummaryPage = () => {
// //     const[courseId, setCourseId] = useState();
// //     const[isLoading, setIsLoading] = useState(true);

// //     return(
// //         <>
// //          <div className="flex flex-col min-h-screen">
// //         <Navbar />

// //         <ToastContainer
// //           autoClose={2000}
// //           pauseOnHover={false}
// //           transition={Slide}
// //           hideProgressBar={false}
// //           closeOnClick={false}
// //           pauseOnFocusLoss={true}
// //         />

// //         <div className="min-h-screen bg-white-100 flex items-center justify-center py-10">
// //             {/* Main Content */}

// //         </div>

// //         <Footer />
// //         </div>
// //         </>
// //     )
// // }

// // export default SummaryPage



// //////////////////////////
// // 'use client';

// // import Navbar from "../navbar";
// // import { ToastContainer, toast, Slide } from 'react-toastify';
// // import 'react-toastify/dist/ReactToastify.css';
// // import Footer from "../loggedoutNav/footer";
// // import { useEffect, useState } from "react";
// // import { studentApis } from "@/api/studentApi";
// // import { useSelector } from "react-redux";
// // import { RootState } from "@/redux/store";
// // import { useSearchParams } from "next/navigation";

// // const SummaryPage = () => {
// //     const [courseId, setCourseId] = useState<string | null>(null);
// //     const [isLoading, setIsLoading] = useState<boolean>(true);
// //     const [course, setCourse] = useState<any>(null)
// //     const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
// //     const [transactionId, setTransactionId] = useState<string | null>(null)
// //     const [hash, setHash] = useState<string | null>(null)
// //     const [toggle, setToggle] = useState<number>(1)
// //     const searchParams = useSearchParams()

// //     const userName = useSelector((state: RootState) => state.user.username);


// //     function generateTransactionId() {
// //         const timeStamp = Date.now()
// //         const randomNum = Math.floor(Math.random() * 1000000)
// //         const companyPrefix = 'L'
// //         const transactionId = `${companyPrefix}${timeStamp}${randomNum}`
// //         return setTransactionId(transactionId)
// //     }

// //     const handleSubmit = (e: FormDataEvent) => {
// //         e.preventDefault()
// //         if (!paymentMethod) {
// //             toast.error("Please select a payment method!", { transition: Slide });
// //             return;
// //         }
// //         getHash()
// //         setToggle(2)
// //     }


// //     const getHash = async () => {

// //         try {
// //             //Api logic here
// //             // send course data and transactionId here
// //             const response: any = await studentApis
// //             if (response) {
// //                 setHash(response.data.hash)
// //                 setTransactionId(response.data.transactionId)
// //             }
// //         } catch (error: any) {
// //             console.log(error)
// //         }
// //     }

// //     useEffect(() => {
// //         generateTransactionId()
// //     }, [])


// //     useEffect(() => {
// //         const getCourseId = searchParams.get('courseId')

// //         if (getCourseId) {
// //             setCourseId(courseId)

// //             const fetchCourse = async () => {
// //                 try {
// //                     const response = await studentApis.getCourse(getCourseId)
// //                     if (response) {
// //                         console.log('response: ', response)
// //                         setCourse(response.data.data)
// //                     }
// //                 } catch (error: any) {

// //                 } finally {
// //                     setIsLoading(false)
// //                 }
// //             }
// //             fetchCourse()
// //         } else {
// //             setIsLoading(false)
// //         }
// //     }, [searchParams])


// //     return (
// //         <>
// //             {toggle === 1 &&
// //                 <div className="flex flex-col min-h-screen bg-white">
// //                     <Navbar />

// //                     <ToastContainer
// //                         autoClose={2000}
// //                         pauseOnHover={false}
// //                         transition={Slide}
// //                         hideProgressBar={false}
// //                         closeOnClick={false}
// //                         pauseOnFocusLoss={true}
// //                     />

// //                     <div className="min-h-screen flex justify-center items-center py-10">
// //                         {/* Main Content */}
// //                         <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-8 flex flex-col md:flex-row space-y-6 md:space-y-0">
// //                             {/* Left side - Course details */}
// //                             <div className="flex-1 bg-[#6E40FF] text-white rounded-lg p-6 shadow-md">
// //                                 <h1 className="text-3xl font-bold text-center mb-6">Course Summary</h1>
// //                                 <div className="space-y-4">
// //                                     <div className="flex justify-between text-lg">
// //                                         <span className="font-medium">Course Name:</span>
// //                                         <span>{course?.courseName}</span>
// //                                     </div>
// //                                     <div className="flex justify-between text-lg">
// //                                         <span className="font-medium">Category:</span>
// //                                         <span>{course?.category}</span>
// //                                     </div>
// //                                 </div>
// //                             </div>

// //                             {/* Right side - Price and Payment */}
// //                             <div className="flex-1 bg-white rounded-lg p-6 shadow-md">
// //                                 <h2 className="text-2xl font-semibold text-[#6E40FF] mb-6">Payment Details</h2>
// //                                 <div className="space-y-4">
// //                                     <div className="flex justify-between text-lg font-medium">
// //                                         <span>Price:</span>
// //                                         <span>₹ {course?.price}</span>
// //                                     </div>

// //                                     {/* Payment Method Selection */}
// //                                     <div className="mt-6">
// //                                         <label className="block text-lg font-medium mb-2">
// //                                             Select Payment Method:
// //                                         </label>
// //                                         <div className="flex items-center space-x-6">
// //                                             <label className="flex items-center">
// //                                                 <input
// //                                                     type="radio"
// //                                                     name="paymentMethod"
// //                                                     value="PayU"
// //                                                     checked={paymentMethod === "PayU"}
// //                                                     onChange={() => setPaymentMethod("PayU")}
// //                                                     className="mr-2"
// //                                                 />
// //                                                 PayU
// //                                             </label>
// //                                             <label className="flex items-center">
// //                                                 <input
// //                                                     type="radio"
// //                                                     name="paymentMethod"
// //                                                     value="Wallet"
// //                                                     checked={paymentMethod === "Wallet"}
// //                                                     onChange={() => setPaymentMethod("Wallet")}
// //                                                     className="mr-2"
// //                                                 />
// //                                                 Wallet
// //                                             </label>
// //                                         </div>
// //                                         {/* Error Message for Validation */}
// //                                         {!paymentMethod && (
// //                                             <div className="text-red-500 text-sm mt-2">
// //                                                 Please select a payment method.
// //                                             </div>
// //                                         )}
// //                                     </div>
// //                                 </div>

// //                                 {/* Payment Button */}
// //                                 <div className="mt-6 text-center">
// //                                     <button
// //                                         onClick={(e) => handleSubmit(e)}
// //                                         className="bg-[#6E40FF] text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-[#4A20D0] transition-all"
// //                                     >
// //                                         Pay Now
// //                                     </button>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     </div>

// //                     <Footer />
// //                 </div>
// //             }
// //             {/* if toggle is 2 then show product detail page that toggle 2 will make from another page, */}
// //         </>
// //     );
// // };

// // export default SummaryPage;




// 'use client';

// import Navbar from "../navbar";
// import Footer from "../loggedoutNav/footer";
// import { ToastContainer, toast, Slide } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useEffect, useState } from "react";
// import { studentApis } from "@/app/api/studentApi";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { useRouter, useSearchParams } from "next/navigation";
// import CryptoJS from 'crypto-js'

// const SummaryPage = () => {
//     const [courseId, setCourseId] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [course, setCourse] = useState<any>(null);
//     const [paymentMethod, setPaymentMethod] = useState<string | null>("PayU");
//     const [txnid, setTxnid] = useState<string | null>(null);
//     const [hash, setHash] = useState<string | null>(null);
//     const searchParams = useSearchParams();
//     const router = useRouter();

//     // const userName = useSelector((state: RootState) => state.user.username);
//     const firstName = 'Leo'
//     const lastName = 'Das'
//     const email = 'riyas@gmail.com'
//     const phone = '8525010630'
//     const userId = '67710140df708808ce0fd712'
//     const price = '509'
//     // const userId = '12423t24t44wfswef43wf'

//     const generateTxnid = () => 'txn' + new Date().getTime();

//     useEffect(() => {
//         setTxnid(generateTxnid());
//     }, []);

//     useEffect(() => {
//         if (!txnid) return;



//         const key = 'hLAGgn';
//         const amount = '999';
//         const productinfo = userId;
//         const firstname = firstName || '';
//         const userEmail = email || '';
//         const udf1 = '';
//         const udf2 = '';
//         const udf3 = '';
//         const udf4 = '';
//         const udf5 = '';
//         const salt = 'r9i1EoMfQy968ezHT4wch5ouStEp8o1l'

//         const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${userEmail}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
//         const generatedHash = CryptoJS.SHA512(hashString).toString();

//         setHash(generatedHash);
//     }, [txnid]);

//     const handlePayment = async () => {


//         if(){

//         }else if(){

//         const response = await studentApis.payment(userId, String(txnid))



//         const formData = {
//             key: 'hLAGgn',
//             txnid: txnid,
//             productinfo: userId,
//             amount: '999',
//             email: email,
//             firstname: firstName,
//             lastname: lastName,
//             surl: 'http://localhost:3000/api/paymentSuccess',
//             furl: 'http://localhost:3000/api/paymentFailure',
//             phone: phone,
//             hash: hash,
//         };

//         const form = document.createElement('form');
//         console.log(form)
//         form.method = 'POST';
//         form.action = 'https://test.payu.in/_payment';


//         Object.keys(formData).forEach((key) => {
//             const input = document.createElement('input');
//             input.type = 'hidden';
//             input.name = key;
//             input.value = formData[key as keyof typeof formData] || '';
//             form.appendChild(input);
//         });


//         document.body.appendChild(form);
//         form.submit();

//     }
//     };


//     return (
//         <div className="flex flex-col min-h-screen bg-white">
//             <Navbar />

//             <ToastContainer autoClose={2000} transition={Slide} />

//             {isLoading ? (
//                 <div>Loading...</div>
//             ) : (
//                 <div className="min-h-screen flex justify-center items-center py-10">
//                     <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-8 flex flex-col md:flex-row space-y-6 md:space-y-0">
//                         <div className="flex-1 bg-[#6E40FF] text-white rounded-lg p-6 shadow-md">
//                             <h1 className="text-3xl font-bold text-center mb-6">Course Summary</h1>
//                             <div className="space-y-4">
//                                 <div className="flex justify-between text-lg">
//                                     <span className="font-medium">Course Name:</span>
//                                     <span>{course?.courseName}</span>
//                                 </div>
//                                 <div className="flex justify-between text-lg">
//                                     <span className="font-medium">Category:</span>
//                                     <span>{course?.category}</span>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="flex-1 bg-white rounded-lg p-6 shadow-md">
//                             <h2 className="text-2xl font-semibold text-[#6E40FF] mb-6">Payment Details</h2>
//                             <div className="space-y-4">
//                                 <div className="flex justify-between text-lg font-medium">
//                                     <span>Price:</span>
//                                     <span>₹ {course?.price}</span>
//                                 </div>
//                                 <div className="mt-6">
//                                     <label className="block text-lg font-medium mb-2">
//                                         Select Payment Method:
//                                     </label>
//                                     <label className="flex items-center">
//                                         <input
//                                             type="radio"
//                                             name="paymentMethod"
//                                             value="PayU"
//                                             checked={paymentMethod === "PayU"}
//                                             onChange={() => setPaymentMethod("PayU")}
//                                             className="mr-2"
//                                         />
//                                         PayU
//                                     </label>
//                                 </div>
//                                 <div className="mt-6 text-center">
//                                     <button
//                                         onClick={handlePayment}
//                                         className="bg-[#6E40FF] text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-[#4A20D0] transition-all"
//                                     >
//                                         Pay Now
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <Footer />
//         </div>
//     );
// };

// export default SummaryPage;


////////////////////////////////////////////////////



// 'use client';

// import Navbar from "../navbar";
// import Footer from "../loggedoutNav/footer";
// import { ToastContainer, toast, Slide } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useEffect, useState } from "react";
// import { studentApis } from "@/app/api/studentApi";
// import CryptoJS from 'crypto-js';

// const SummaryPage = () => {
//     const [courseId, setCourseId] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [course, setCourse] = useState<any>(null);
//     const [paymentMethod, setPaymentMethod] = useState<string | null>("PayU");
//     const [txnid, setTxnid] = useState<string | null>(null);
//     const [hash, setHash] = useState<string | null>(null);

//     const firstName = 'Leo';
//     const lastName = 'Das';
//     const email = 'riyas@gmail.com';
//     const phone = '8525010630';
//     const userId = '67710140df708808ce0fd712';
//     const price = '509';

//     const generateTxnid = () => 'txn' + new Date().getTime();

//     useEffect(() => {
//         setTxnid(generateTxnid());
//     }, []);

//     useEffect(() => {
//         if (!txnid) return;

//         const key = 'hLAGgn';
//         const amount = price;
//         const productinfo = userId;
//         const firstname = firstName || '';
//         const userEmail = email || '';
//         const udf1 = '';
//         const udf2 = '';
//         const udf3 = '';
//         const udf4 = '';
//         const udf5 = '';
//         const salt = 'r9i1EoMfQy968ezHT4wch5ouStEp8o1l';

//         const hashString = ${key}|${txnid}|${amount}|${productinfo}|${firstname}|${userEmail}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt};
//         const generatedHash = CryptoJS.SHA512(hashString).toString();

//         setHash(generatedHash);
//     }, [txnid]);

//     const handleWalletPayment = async () => {
//         try {
//             toast.success("Payment successful via Wallet!", { transition: Slide });
//             // const response = await studentApis.walletPayment(userId, price, txnid);
//             // if (response?.status === 200) {

//             //     // Redirect to success page or perform additional actions
//             // } else {
//             //     toast.error("Wallet payment failed!", { transition: Slide });
//             // }
//         } catch (error) {
//             console.error("Wallet payment error:", error);
//             toast.error("An error occurred during wallet payment.", { transition: Slide });
//         }
//     };

//     const handlePayUPayment = async () => {
//         const formData = {
//             key: 'hLAGgn',
//             txnid: txnid,
//             productinfo: userId,
//             amount: price,
//             email: email,
//             firstname: firstName,
//             lastname: lastName,
//             surl: 'http://localhost:3000/api/paymentSuccess',
//             furl: 'http://localhost:3000/api/paymentFailure',
//             phone: phone,
//             hash: hash,
//         };

//         const form = document.createElement('form');
//         form.method = 'POST';
//         form.action = 'https://test.payu.in/_payment';

//         Object.keys(formData).forEach((key) => {
//             const input = document.createElement('input');
//             input.type = 'hidden';
//             input.name = key;
//             input.value = formData[key as keyof typeof formData] || '';
//             form.appendChild(input);
//         });

//         document.body.appendChild(form);
//         form.submit();
//     };

//     const handlePayment = () => {
//         if (paymentMethod === "Wallet") {
//             handleWalletPayment();
//         } else if (paymentMethod === "PayU") {
//             handlePayUPayment();
//         } else {
//             toast.error("Please select a valid payment method.", { transition: Slide });
//         }
//     };

//     return (
//         <div className="flex flex-col min-h-screen bg-white">
//             <Navbar />

//             <ToastContainer autoClose={2000} transition={Slide} />

//             {isLoading ? (
//                 <div>Loading...</div>
//             ) : (
//                 <div className="min-h-screen flex justify-center items-center py-10">
//                     <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-8 flex flex-col md:flex-row space-y-6 md:space-y-0">
//                         <div className="flex-1 bg-[#6E40FF] text-white rounded-lg p-6 shadow-md">
//                             <h1 className="text-3xl font-bold text-center mb-6">Course Summary</h1>
//                             <div className="space-y-4">
//                                 <div className="flex justify-between text-lg">
//                                     <span className="font-medium">Course Name:</span>
//                                     <span>{course?.courseName}</span>
//                                 </div>
//                                 <div className="flex justify-between text-lg">
//                                     <span className="font-medium">Category:</span>
//                                     <span>{course?.category}</span>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="flex-1 bg-white rounded-lg p-6 shadow-md">
//                             <h2 className="text-2xl font-semibold text-[#6E40FF] mb-6">Payment Details</h2>
//                             <div className="space-y-4">
//                                 <div className="flex justify-between text-lg font-medium">
//                                     <span>Price:</span>
//                                     <span>₹ {price}</span>
//                                 </div>
//                                 <div className="mt-6">
//                                     <label className="block text-lg font-medium mb-2">
//                                         Select Payment Method:
//                                     </label>
//                                     <div className="flex items-center space-x-6">
//                                         <label className="flex items-center">
//                                             <input
//                                                 type="radio"
//                                                 name="paymentMethod"
//                                                 value="PayU"
//                                                 checked={paymentMethod === "PayU"}
//                                                 onChange={() => setPaymentMethod("PayU")}
//                                                 className="mr-2"
//                                             />
//                                             PayU
//                                         </label>
//                                         <label className="flex items-center">
//                                             <input
//                                                 type="radio"
//                                                 name="paymentMethod"
//                                                 value="Wallet"
//                                                 checked={paymentMethod === "Wallet"}
//                                                 onChange={() => setPaymentMethod("Wallet")}
//                                                 className="mr-2"
//                                             />
//                                             Wallet
//                                         </label>
//                                     </div>
//                                 </div>
//                                 <div className="mt-6 text-center">
//                                     <button
//                                         onClick={handlePayment}
//                                         className="bg-[#6E40FF] text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-[#4A20D0] transition-all"
//                                     >
//                                         Pay Now
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <Footer />
//         </div>
//     );
// };

// export default SummaryPage;



//////////////////////////




// 'use client';

// import Navbar from "../navbar";
// import Footer from "../loggedoutNav/footer";
// import { ToastContainer, toast, Slide } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useEffect, useState } from "react";
// import CryptoJS from 'crypto-js';

// const SummaryPage = () => {
//     const [paymentMethod, setPaymentMethod] = useState<string | null>("PayU");
//     const [txnid, setTxnid] = useState<string | null>(null);
//     const [hash, setHash] = useState<string | null>(null);

//     const firstName = 'Leo';
//     const email = 'riyas@gmail.com';
//     const phone = '8525010630';
//     const userId = '67710140df708808ce0fd712';
//     const price = '509';

//     const generateTxnid = () => 'txn' + new Date().getTime();

//     useEffect(() => {
//         setTxnid(generateTxnid());
//     }, []);

//     useEffect(() => {
//         if (!txnid) return;

//         const key = 'hLAGgn';
//         const amount = price;
//         const productinfo = userId;
//         const firstname = firstName || '';
//         const userEmail = email || '';
//         const udf1 = '';
//         const salt = 'r9i1EoMfQy968ezHT4wch5ouStEp8o1l';

//         const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${userEmail}|${udf1}|||||||||||${salt}`;
//         const generatedHash = CryptoJS.SHA512(hashString).toString();

//         setHash(generatedHash);
//     }, [txnid]);

//     const handlePayUPayment = () => {
//         const formData = {
//             key: 'hLAGgn',
//             txnid: txnid,
//             productinfo: userId,
//             amount: price,
//             email: email,
//             firstname: firstName,
//             phone: phone,
//             hash: hash,
//             surl: 'http://localhost:3000/api/paymentSuccess',
//             furl: 'http://localhost:3000/api/paymentFailure',
//         };

//         const form = document.createElement('form');
//         form.method = 'POST';
//         form.action = 'https://test.payu.in/_payment';

//         Object.keys(formData).forEach((key) => {
//             const input = document.createElement('input');
//             input.type = 'hidden';
//             input.name = key;
//             input.value = formData[key as keyof typeof formData] || '';
//             form.appendChild(input);
//         });

//         document.body.appendChild(form);
//         form.submit();
//     };

//     const handleWalletPayment = () => {
//         toast.success("Payment successful via Wallet!", { transition: Slide });
//     };

//     const handlePayment = () => {
//         if (paymentMethod === "Wallet") {
//             handleWalletPayment();
//         } else if (paymentMethod === "PayU") {
//             handlePayUPayment();
//         } else {
//             toast.error("Please select a valid payment method.", { transition: Slide });
//         }
//     };

//     return (
//         <div className="min-h-screen flex flex-col">
//             <Navbar />

//             <ToastContainer autoClose={2000} transition={Slide} />

//             <div className="flex-1 bg-white py-16 px-6">
//                 <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
//                     <div className="md:flex">
//                         {/* Course Summary */}
//                         <div className="md:w-1/2 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white p-8 flex flex-col justify-between">
//                             <h2 className="text-3xl font-bold mb-4">Course Summary</h2>
//                             <div className="space-y-4">
//                                 <div className="flex justify-between">
//                                     <span className="font-medium">Course Name:</span>
//                                     <span>Advanced JavaScript</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="font-medium">Category:</span>
//                                     <span>Programming</span>
//                                 </div>
//                             </div>
//                             <div className="mt-6 text-center">
//                                 <span className="text-lg font-semibold">Total: ₹ {price}</span>
//                             </div>
//                         </div>

//                         {/* Payment Section */}
//                         <div className="md:w-1/2 p-8">
//                             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Details</h2>
//                             <div className="space-y-4">
//                                 <div className="text-lg font-medium text-gray-600">
//                                     Select Payment Method:
//                                 </div>
//                                 <div className="flex items-center space-x-4">
//                                     <label className="flex items-center space-x-2">
//                                         <input
//                                             type="radio"
//                                             name="paymentMethod"
//                                             value="PayU"
//                                             checked={paymentMethod === "PayU"}
//                                             onChange={() => setPaymentMethod("PayU")}
//                                             className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
//                                         />
//                                         <span>PayU</span>
//                                     </label>
//                                     <label className="flex items-center space-x-2">
//                                         <input
//                                             type="radio"
//                                             name="paymentMethod"
//                                             value="Wallet"
//                                             checked={paymentMethod === "Wallet"}
//                                             onChange={() => setPaymentMethod("Wallet")}
//                                             className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
//                                         />
//                                         <span>Wallet</span>
//                                     </label>
//                                 </div>

//                                 <button
//                                     onClick={handlePayment}
//                                     className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
//                                 >
//                                     Pay Now
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <Footer />
//         </div>
//     );
// };

// export default SummaryPage;





'use client';

import Navbar from "../navbar";
import Footer from "../loggedoutNav/footer";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import { studentApis } from "@/app/api/studentApi";
import CryptoJS from 'crypto-js';
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface CourseDetails {
    courseName: string;
    level: string;
    category: string;
    price:string;
}

const SummaryPage = () => {
    const [courseId, setCourseId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [course, setCourse] = useState<CourseDetails | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string | null>("PayU");
    const [txnid, setTxnid] = useState<string | null>(null);
    const [hash, setHash] = useState<string | null>(null);

    const searchParams = useSearchParams()

    const userDetails = useSelector((state: RootState) => state.user)
    const { userId, username, email } = userDetails

    const phone = '8525010630';

    const generateTxnid = () => 'txn' + new Date().getTime();


    useEffect(() => {

        setTxnid(generateTxnid());

        const getCourseDetails = localStorage.getItem('courseDetails')
        if(getCourseDetails){
            setCourse(JSON.parse(getCourseDetails))
        }
        const getCourseId = searchParams.get('courseId')

        if(getCourseId){
            setCourseId(String(getCourseId))
        }
    }, []);


    useEffect(() => {
        if (!txnid) return;

        const key = 'hLAGgn';
        const amount = course?.price;
        const productinfo = courseId;
        const firstname = username || '';
        const userEmail = email || '';
        const udf1 = '';
        const udf2 = '';
        const udf3 = '';
        const udf4 = '';
        const udf5 = '';
        const salt = 'r9i1EoMfQy968ezHT4wch5ouStEp8o1l';

        const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${userEmail}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
        const generatedHash = CryptoJS.SHA512(hashString).toString();

        setHash(generatedHash);
    }, [txnid]);

    const handleWalletPayment = async () => {
        try {
            toast.success("Payment successful via Wallet!", { transition: Slide });
        } catch (error) {
            console.error("Wallet payment error:", error);
            toast.error("An error occurred during wallet payment.", { transition: Slide });
        }
    };

    const handlePayUPayment = async () => {
        const formData = {
            key: 'hLAGgn',
            txnid: txnid,
            productinfo: courseId,
            amount: course?.price,
            email: email,
            firstname: username,
            lastname: course?.courseName,
            surl: 'http://localhost:3000/api/paymentSuccess',
            furl: 'http://localhost:3000/api/paymentFailure',
            phone: phone,
            hash: hash,
        };

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://test.payu.in/_payment';

        Object.keys(formData).forEach((key) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = formData[key as keyof typeof formData] || '';
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
    };

    const handlePayment = () => {
        if (paymentMethod === "Wallet") {
            handleWalletPayment();
        } else if (paymentMethod === "PayU") {
            handlePayUPayment();
        } else {
            toast.error("Please select a valid payment method.", { transition: Slide });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
    <Navbar />

    <ToastContainer autoClose={2000} transition={Slide} />

    <div className="flex-1 bg-white-100 py-16 px-6">

        <div className="max-w-5xl mx-auto bg-gradient-to-r from-white rounded-lg shadow-lg overflow-hidden border border-gray-500">
            <div className="md:flex">
                {/* Combined Container */}
                <div className="md:w-full p-8">
                    <div className="md:flex rounded-[0px] shadow-[0_4px_10px_rgba(0,0,0,10)]">
                        {/* Course Summary */}
                        <div className="md:w-1/2 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white p-8 flex flex-col justify-between">
                            <h3 className="text-2xl font-bold mb-4">Course Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="font-bold">Course Name:</span>
                                    <span>{course?.courseName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold">Category:</span>
                                    <span>{course?.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold">Level:</span>
                                    <span>{course?.level}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold">Price:</span>
                                    <span>₹ {course?.price}.00</span>
                                </div>
                            </div>
                            
                            <div className="mt-6 text-center">
                                <span className="text-lg font-semibold">Total Amount: ₹ {course?.price}.00</span>
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="md:w-1/2 p-8">
                            {/* Wallet Balance */}
                            <div className="bg-gray-100 rounded-lg shadow-md p-4 mb-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">Wallet Balance</h4>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Available Balance:</span>
                                    <span className="text-indigo-600 font-bold">₹ 1,200</span>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Payment Details</h3>
                            <div className="space-y-4">

                            <div className="flex justify-between">
                                    <span className="font-bold">Total Amount:</span>
                                    <span>₹ {course?.price}.00</span>
                                </div>

                                <div className="text-[15px] text-gray-400">
                                    Select Payment Method:
                                </div>
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="PayU"
                                            checked={paymentMethod === "PayU"}
                                            onChange={() => setPaymentMethod("PayU")}
                                            className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                        />
                                        <span>PayU</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="Wallet"
                                            checked={paymentMethod === "Wallet"}
                                            onChange={() => setPaymentMethod("Wallet")}
                                            className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                        />
                                        <span>Wallet</span>
                                    </label>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    className="mt-6 w-full bg-[#6E40FF] text-white py-3 rounded-[0px] shadow-lg"
                                >
                                    Pay Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <Footer />
</div>

    );
};

export default SummaryPage;