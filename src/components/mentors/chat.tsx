// "use client";

// import React, { useEffect, useState } from "react";
// import socket from "@/utils/socket";
// import axios from "axios";
// import Image from "next/image";
// import Navbar from "./navbar";
// import { ToastContainer, toast, Slide } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Footer from "./loggedoutNav/footer";

// interface Data {
//   _id: string;
//   studentData: {
//     _id: string;
//     username: string;
//     profilePicUrl: string;
//     isOnline: boolean;
//     lastSeen: string;
//   };
//   mentorData: {
//     _id: string;
//     username: string;
//     profilePicUrl: string;
//   };
//   lastMessage: string;
// }

// interface SelectedUser {
//   username: string;
//   profilePicUrl: string;
//   isOnline: boolean;
//   lastSeen: string;
// }

// const MentorChat = () => {
//   const [data, setData] = useState<Data[] | []>([]);
//   const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
//   const [message, setMessage] = useState<string | null>(null);

//   useEffect(() => {
//     let isMounted = true; // Track if the component is mounted

//     // Retrieve selected user from localStorage
//     const getUser = localStorage.getItem("selectedUser");
//     if (getUser) {
//       const parsedUser = JSON.parse(getUser);
//       if (isMounted) setSelectedUser(parsedUser);
//     }

//     const fetchData = async () => {
//       try {
//         const response = await axios.get("http://localhost:8001/get/rooms");
//         const serverData = response?.data?.data || [];
//         if (isMounted) {
//           setData(serverData);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();

//     return () => {
//       isMounted = false; // Set flag to false on unmount
//     };
//   }, []);

//   useEffect(() => {
//     let isMounted = true; // Track if the component is mounted

//     socket.on("receiveMessage", (msg) => {
//       if (isMounted) {
//         console.log("Message received:", msg);
//         setMessage(msg.message); // Update state only if component is mounted
//       }
//     });

//     return () => {
//       isMounted = false; // Prevent updates on unmounted components
//       socket.off("reciveMessage");
//     };
//   }, []);


//   const createRoom = async (userId: string, mentorId: string) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8001/create/room/${userId}/${mentorId}`
//       );
//       const roomId = response?.data?.data?._id;
//       socket.emit('joinRoom', roomId)
//     //   const fetchMessage = await axios.get(
//     //     `http://localhost:8001/get/message/${roomId}`
//     //   );
//     //   console.log("Messages:", fetchMessage);
//     } catch (error) {
//       console.error("Error creating room:", error);
//     }
//   };

//   return (
//     <>
//       <div className="flex flex-col h-screen bg-white">
//         <header>
//           <Navbar />
//         </header>

//         <ToastContainer autoClose={2000} transition={Slide} />

//         <div className="flex flex-1 w-full justify-center items-center py-16 px-6">
//           {/* Chat List Section */}
//           <div className="w-1/3 border-r border-gray-300 overflow-y-auto rounded-md shadow-md">
//             <h2 className="text-lg font-bold text-center py-4 border-b">Chats</h2>
//             {data.map((val, index) => (
//               <div
//                 key={index}
//                 className="flex items-center p-3 border-b border-gray-300 cursor-pointer hover:bg-gray-100"
//                 onClick={() => {
//                   createRoom(val.studentData._id, val.mentorData._id);
//                   const user = {
//                     username: val.mentorData.username,
//                     profilePicUrl: val.studentData.profilePicUrl,
//                     isOnline: val.studentData.isOnline,
//                     lastSeen: val.studentData.lastSeen,
//                   };
//                   setSelectedUser(user);
//                   localStorage.setItem("selectedUser", JSON.stringify(user));
//                 }}
//               >
//                 <Image
//                   className="w-12 h-12 rounded-full border border-gray-400"
//                   src={val.studentData.profilePicUrl}
//                   alt={`${val.mentorData.username}'s profile picture`}
//                   width={48}
//                   height={48}
//                 />
//                 <div className="ml-4">
//                   <p className="text-lg font-medium text-gray-800">
//                     {val.mentorData.username}
//                   </p>
//                   <p className="text-sm text-gray-500">Tap to start a chat</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Chat Section */}
//           <div className="flex flex-col w-2/3 rounded-md shadow-md">
//             {selectedUser ? (
//               <>
//                 {/* Chat Header */}
//                 <div className="flex items-center px-4 py-3 border-b border-gray-300 bg-gray-100">
//                   <Image
//                     className="w-10 h-10 rounded-full border border-gray-400"
//                     src={selectedUser.profilePicUrl || "/default-profile.png"}
//                     alt={`${selectedUser.username}'s profile picture`}
//                     width={40}
//                     height={40}
//                   />
//                   <div className="ml-4">
//                     <p className="text-lg font-medium text-gray-800">
//                       {selectedUser.username}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       {selectedUser.isOnline
//                         ? "Online"
//                         : `Last seen: ${selectedUser.lastSeen || "N/A"}`}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Chat Messages */}
//                 <div className="flex-1 p-4 overflow-y-auto bg-white">
//                   <div className="flex flex-col space-y-4">
//                     {/* Example Message */}
//                     <div className="self-start bg-gray-200 px-4 py-2 rounded-md max-w-sm">
//                       <p className="text-sm">
//                         {message || `Hello! How can I help you? `}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1 text-right">
//                         10:30 AM
//                       </p>
//                     </div>

//                     <div className="self-end bg-blue-500 text-white px-4 py-2 rounded-md max-w-sm">
//                       <p className="text-sm">
//                         I have a question about the course.
//                       </p>
//                       <p className="text-xs text-gray-300 mt-1 text-right">
//                         10:32 AM
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Message Input */}
//                 <div className="flex items-center p-4 border-t border-gray-300 bg-gray-100">
//                   <input
//                     className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     type="text"
//                     placeholder="Type a message"
//                   />
//                   <button
//                     type="submit"
//                     className="ml-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                   >
//                     Send
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
//                 <p className="text-lg">Select a user to start chatting</p>
//               </div>
//             )}
//           </div>
//         </div>
//         <Footer />
//       </div>
//     </>
//   );
// };

// export default MentorChat;




// "use client";

// import React, { useEffect, useRef, useState } from 'react';
// import socket from '@/utils/socket';
// import axios from 'axios';
// import Image from 'next/image';
// import Navbar from '../navbar';
// import { ToastContainer, toast, Slide } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Footer from '../loggedoutNav/footer';
// import { MENTOR_SERVICE_URL } from '@/utils/constant';

// interface Data {
//   _id: string;
//   studentData: {
//     _id: string;
//     username: string;
//     profilePicUrl: string;
//     isOnline: boolean;
//     lastSeen: string;
//   };
//   mentorData: {
//     _id: string;
//     username: string;
//     profilePicUrl: string;
//   };
//   lastMessage: string;
// }

// interface Message {
//     senderId?: string;
//     message: string;
//     receiverId?: string;
//     createdAt: string;
//     // isDeleted?: boolean;
// }

// interface Chat {
//     _id: string;
//     mentorId: string;
//     courseId: string;
// }

// // interface Data {
// //     lastMessage?: string;
// //     userData: { _id: string, username: string, profilePicUrl: string };
// //     mentorData: { _id: string, username: string, profilePicUrl: string, isOnline: boolean; lastSeen: string; };
// // }

// interface SelectedUser {
//     id: string;
//     username: string;
//     profilePicUrl: string;
//     isOnline: boolean;
//     lastSeen: string;
// }

// const MentoChat = () => {
//     const [message, setMessage] = useState<string>('');
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [data, setData] = useState<Data[] | []>([]);
//     const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
//     const [roomId, setRoomId] = useState<string | null>(null);
//     const messagesContainerRef = useRef<HTMLDivElement | null>(null);
//     const [instantMsg, setInstantMsg] = useState<string | null>(null)

//     useEffect(() => {
//         // Fetch mentors list
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get(`${MENTOR_SERVICE_URL}/get/rooms`,{
//                     withCredentials: true
//                 })
//                 console.log('ser: ', response)
//                 const serverData = response?.data?.result;
//                 if(serverData){
//                     const existingStudentIds = new Set(data.map((item) => item.studentData._id));
//                 const uniqueStudents = serverData.filter(
//                     (item: Data) => !existingStudentIds.has(item.studentData._id)
//                 );
//                 setData((prevState) => [
//                     ...prevState,
//                     ...uniqueStudents.filter(
//                         (newItem: any, index: any, self: any) =>
//                             index === self.findIndex((i: any) => i.studentData._id === newItem.studentData._id)
//                     ),
//                 ]);
//                 }else{
//                     setData([])
//                 }

//             } catch (error) {
//                 console.log('Error fetching users:', error);
//             }
//         };
//         fetchData();

//         // Retrieve selected user and roomId from localStorage
//         const getUser = localStorage.getItem('selectedUser');
//         const getRoom = localStorage.getItem('roomId');
//         if (getUser && getRoom) {
//             const parsedUser = JSON.parse(getUser);
//             const parsedRoom = JSON.parse(getRoom);
//             socket.emit('joinRoom', parsedRoom[0]);
//             setSelectedUser(parsedUser);
//             setRoomId(parsedRoom[0]);
//         }
//     }, []);

//     useEffect(() => {
//         if (roomId) {
//             // Fetch messages for the roomId
//             const fetchMessages = async () => {
//                 const response = await axios.get(`${MENTOR_SERVICE_URL}/get/message/${roomId}`,{
//                     withCredentials: true
//                 });
//                 console.log('ress msg', response)
//                 setMessages(response.data.result || []);
//             };

//             fetchMessages();

//             socket.on('receiveMessage', (newMessage: Message) => {
//                 console.log('Received message:', newMessage);

//                 // Append the new message to the `messages` state
//                 setMessages((prevMessages) => [...prevMessages, newMessage]);

//                 // Optionally, update the UI to display the latest message instantly
//                 setInstantMsg(newMessage.message);
//             });

//             return () => {
//                 socket.off('receiveMessage');
//             };
//         }
//     }, [roomId]);

//     // no need to scroll for new messages
//     useEffect(() => {
//         if (messagesContainerRef.current) {
//             messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
//         }
//     }, [messages]);



//     const handleSend = async () => {
//         if (!message || !roomId || !selectedUser) return;

//         const senderId = data.find((user: any) => user.studentData._id === selectedUser.id)?.mentorData._id;

//         const newMessage = {
//             message,
//             senderId: String(senderId), // Assuming sender is the selected user
//             createdAt: new Date().toISOString(),
//             isDeleted: false,
//         };

//         // Add the message to the state (right side - your side)
//         setMessages((prevMessages) => [...prevMessages, newMessage]);


//         const datas = {
//             message,
//             roomId,
//             receiverId: selectedUser.id
//         };

//         socket.emit('sendMessage', datas);

//         try {
//             await axios.post(`${MENTOR_SERVICE_URL}/save/message`, datas, {
//                 withCredentials: true
//             });
//             setMessage('');
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     };

//     const createRoom = async (userId: string, mentorId: string) => {
//         console.log('createRoom')
//         try {
//             const Ids = {userId, mentorId}
//             // const response = await axios.get(`http://localhost:8001/create/room/${userId}/${mentorId}`);
//             const response = await axios.post(`${MENTOR_SERVICE_URL}/create/room`,Ids, {
//                 withCredentials: true
//             });
//             const roomId = response?.data?.result?._id;
//             localStorage.setItem('roomId', JSON.stringify([roomId]));
//             socket.emit('joinRoom', roomId);
//             setRoomId(roomId);
//             // setSelectedUser({
//             //     id: mentorId,
//             //     username: 'Mentor User', // replace with actual name from response
//             //     profilePicUrl: 'path-to-profile-image', // replace with actual URL
//             //     isOnline: true, // replace with actual online status
//             //     lastSeen: 'N/A', // replace with actual last seen data
//             // });
//         } catch (error) {
//             console.error('Error creating room:', error);
//         }
//     };

//     return (
//         <div className="flex flex-col h-screen bg-white">
//             <header>
//                 <Navbar />
//             </header>

//             <ToastContainer autoClose={2000} transition={Slide} />

//             <div className="flex flex-1 w-full justify-center items-start py-16 px-6">
//                 {/* Chat List Section */}
//                 <div className="w-1/3 flex flex-col border-r border-gray-300 rounded-md shadow-md max-h-[calc(100vh-150px)]">
//                     <div className="py-3 px-4 border-b bg-gray-100">
//                         <h2 className="text-lg font-bold text-center">Chats</h2>
//                     </div>
//                     <div className="flex-1 overflow-y-auto">
//                         {data && data.map((val, index) => (
//                             <div
//                                 key={index}
//                                 className="flex items-center p-3 border-b border-gray-300 cursor-pointer hover:bg-gray-100"
//                                 onClick={() => {
//                                     createRoom(val.studentData._id, val.mentorData._id);
//                                     const user = {
//                                         id: val.studentData._id,
//                                         username: val.studentData.username,
//                                         profilePicUrl: val.studentData.profilePicUrl,
//                                         isOnline: val.studentData.isOnline,
//                                         lastSeen: val.studentData.lastSeen,
//                                     };
//                                     setSelectedUser(user);
//                                     localStorage.setItem('selectedUser', JSON.stringify(user));
//                                 }}
//                             >
//                                 <Image
//                                     className="w-12 h-12 rounded-full border border-gray-400"
//                                     src={val.studentData.profilePicUrl}
//                                     alt={`${val.mentorData.username}'s profile picture`}
//                                     width={48}
//                                     height={48}
//                                 />
//                                 <div className="ml-4">
//                                     <p className="text-lg font-medium text-gray-800">{val.studentData.username}</p>
//                                     <p className="text-sm text-gray-500">{val.lastMessage}</p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Chat Section */}
//                 <div className="flex flex-col w-2/3 rounded-md shadow-md">
//                     {selectedUser ? (
//                         <>
//                             {/* Chat Header */}
//                             <div className="flex items-center px-4 py-3 border-b border-gray-300 bg-gray-100">
//                                 <Image
//                                     className="w-10 h-10 rounded-full border border-gray-400"
//                                     src={selectedUser.profilePicUrl || '/default-profile.png'}
//                                     alt={`${selectedUser.username}'s profile picture`}
//                                     width={40}
//                                     height={40}
//                                 />
//                                 <div className="ml-4">
//                                     <p className="text-lg font-medium text-gray-800">{selectedUser.username}</p>
//                                     <p className="text-sm text-gray-500">{selectedUser.isOnline ? 'Online' : `Last seen: ${selectedUser.lastSeen}`}</p>
//                                 </div>
//                             </div>

//                             {/* Chat Messages */}
//                             <div
//                                 ref={messagesContainerRef}
//                                 className="flex-1 p-4 overflow-y-auto bg-white max-h-[calc(100vh-200px)]"
//                             >
//                                 <div className="flex flex-col space-y-4">
//                                     {messages.map((msg, index) => (
//                                         <div
//                                             key={index}
//                                             className={`max-w-xs rounded-md p-3 ${msg.senderId !== selectedUser.id ? 'self-end bg-blue-500 text-white' : 'self-start bg-gray-200'}`}
//                                         >
//                                             <p className="text-sm">{instantMsg || msg.message}</p>
//                                             <p className="text-xs text-black-300 mt-1 text-right">
//                                                 {new Date(msg.createdAt).toLocaleTimeString('en-US', {
//                                                     hour: '2-digit',
//                                                     minute: '2-digit',
//                                                     hour12: true,
//                                                 })}
//                                             </p>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Message Input */}
//                             <div className="flex items-center p-4 border-t border-gray-300 bg-gray-100">
//                                 <input
//                                     className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     type="text"
//                                     placeholder="Type a message"
//                                     value={message}
//                                     onChange={(e) => setMessage(e.target.value)}
//                                 />
//                                 <button
//                                     type="submit"
//                                     className="ml-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                                     onClick={handleSend}
//                                 >
//                                     Send
//                                 </button>
//                             </div>
//                         </>
//                     ) : (
//                         <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
//                             <p className="text-lg">Select a user to start chatting</p>
//                         </div>
//                     )}
//                 </div>
//             </div>


//             <Footer />
//         </div>
//     );
// };

// export default MentoChat;




// "use client";

// import React, { useEffect, useRef, useState } from 'react';
// import socket from '@/utils/socket';
// import axios from 'axios';
// import Image from 'next/image';
// import Navbar from '../navbar';
// import { ToastContainer, toast, Slide } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Footer from '../loggedoutNav/footer';
// import { MENTOR_SERVICE_URL } from '@/utils/constant';

// interface MentorData {
//   _id: string;
//   username: string;
//   profilePicUrl: string;
//   isOnline: boolean;
//   lastSeen: string;
// }

// interface Data {
//   _id: string;
//   studentData: MentorData;
//   mentorData: MentorData;
//   lastMessage: string;
// }

// interface Message {
//   senderId: string;
//   message: string;
//   receiverId: string;
//   createdAt: string;
// }

// interface SelectedUser {
//   id: string;
//   username: string;
//   profilePicUrl: string;
//   isOnline: boolean;
//   lastSeen: string;
// }

// const MentoChat = () => {
//   const [message, setMessage] = useState<string>('');
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [data, setData] = useState<Data[]>([]);
//   const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
//   const [roomId, setRoomId] = useState<string | null>(null);
//   const messagesContainerRef = useRef<HTMLDivElement | null>(null);
//   // const notification = new Audio('/Audio/text-message.mp3')

//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const response = await axios.get(`${MENTOR_SERVICE_URL}/get/rooms`, {
//           withCredentials: true,
//         });
//         setData(response.data.result || []);
//       } catch (error) {
//         console.error('Error fetching rooms:', error);
//       }
//     };

//     const getUserAndRoom = () => {
//       const storedUser = localStorage.getItem('selectedUser');
//       const storedRoom = localStorage.getItem('roomId');
//       if (storedUser && storedRoom) {
//         const parsedUser = JSON.parse(storedUser);
//         const parsedRoom = JSON.parse(storedRoom);
//         socket.emit('joinRoom', parsedRoom[0]);
//         setSelectedUser(parsedUser);
//         setRoomId(parsedRoom[0]);
//       }
//     };

//     fetchRooms();
//     getUserAndRoom();
//   }, []);

//   useEffect(() => {
//     if (roomId) {
//       const fetchMessages = async () => {
//         try {
//           const response = await axios.get(`${MENTOR_SERVICE_URL}/get/message/${roomId}`, {
//             withCredentials: true,
//           });
//           setMessages(response.data.result || []);
//         } catch (error) {
//           console.error('Error fetching messages:', error);
//         }
//       };

//       fetchMessages();

//       socket.on('receiveMessage', (newMessage: Message) => {
//         // notification.play()
//         setMessages((prevMessages) => [...prevMessages, newMessage]);

//         setData((prevData) => {
//             return prevData.map((chat) => {
//                 if (chat.studentData._id === selectedUser?.id) {
//                     return {
//                         ...chat,
//                         lastMessage: newMessage.message,
//                     };
//                 }
//                 return chat;
//             });
//         });

//       });

//       return () => {
//         socket.off('receiveMessage');
//       };
//     }
//   }, [roomId]);

//   useEffect(() => {
//     if (messagesContainerRef.current) {
//       messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   useEffect(() => {
//     // Listen for notification
//     socket.on('notification', (data) => {
//       console.log('Notification received: ', data);
//       // Play a notification sound
//       // notification.play();

//       // Show a toast or any visual notification
//       toast.info(`you got a message: ${data.message}`);
//     });

//     return () => {
//       socket.off('notification');
//     };
//   }, []);

//   //send message
//   const handleSend = async () => {
//     if (!message || !roomId || !selectedUser) return;

//     const senderId = data.find((user) => user.studentData._id === selectedUser.id)?.mentorData._id;

//     const newMessage: Message = {
//       message,
//       senderId: String(senderId),
//       receiverId: selectedUser.id,
//       createdAt: new Date().toISOString(),
//     };

//     // setMessages((prevMessages) => [...prevMessages, newMessage]);

//     try {
//       await axios.post(`${MENTOR_SERVICE_URL}/save/message`, {
//         message,
//         roomId,
//         receiverId: selectedUser.id,
//       }, {
//         withCredentials: true,
//       });

//       // Message will be added automatically when socket emits "receiveMessage"
//       socket.emit('sendMessage', {
//         ...newMessage,
//         roomId,
//         receiverId: selectedUser.id
//     });

//       setMessage('');

//       setData((prevData) => {
//         return prevData.map((chat) => {
//             if (chat.studentData._id === selectedUser?.id) {
//                 return {
//                     ...chat,
//                     lastMessage: newMessage.message,
//                 };
//             }
//             return chat;
//         });
//     });

//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   const createRoom = async (studentId: string, mentorId: string) => {
//     try {
//       const response = await axios.post(`${MENTOR_SERVICE_URL}/create/room`, {
//         userId: studentId,
//         mentorId,
//       }, {
//         withCredentials: true,
//       });
//       const newRoomId = response.data.result?._id;
//       localStorage.setItem('roomId', JSON.stringify([newRoomId]));
//       socket.emit('joinRoom', newRoomId);
//       setRoomId(newRoomId);
//     } catch (error) {
//       console.error('Error creating room:', error);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-white">
//       <header>
//         <Navbar />
//       </header>

//       <ToastContainer autoClose={2000} transition={Slide} />

//       <div className="flex flex-1 w-full justify-center items-start py-16 px-6">
//         {/* Chat List Section */}
//         <div className="w-1/3 flex flex-col border-r border-gray-300 rounded-md shadow-md max-h-[calc(100vh-150px)]">
//           <div className="py-3 px-4 border-b bg-gray-100">
//             <h2 className="text-lg font-bold text-center">Chats</h2>
//           </div>
//           <div className="flex-1 overflow-y-auto">
//             {data.map((val, index) => (
//               <div
//                 key={index}
//                 className="flex items-center p-3 border-b border-gray-300 cursor-pointer hover:bg-gray-100"
//                 onClick={() => {
//                   createRoom(val.studentData._id, val.mentorData._id);
//                   const user = {
//                     id: val.studentData._id,
//                     username: val.studentData.username,
//                     profilePicUrl: val.studentData.profilePicUrl,
//                     isOnline: val.studentData.isOnline,
//                     lastSeen: val.studentData.lastSeen,
//                   };
//                   setSelectedUser(user);
//                   localStorage.setItem('selectedUser', JSON.stringify(user));
//                 }}
//               >
//                 <Image
//                   className="w-12 h-12 rounded-full border border-gray-400"
//                   src={val.studentData.profilePicUrl}
//                   alt={`${val.studentData.username}'s profile picture`}
//                   width={48}
//                   height={48}
//                 />
//                 <div className="ml-4">
//                   <p className="text-lg font-medium text-gray-800">{val.studentData.username}</p>
//                   <p className="text-sm text-gray-500">{val.lastMessage}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Chat Section */}
//         <div className="flex flex-col w-2/3 rounded-md shadow-md">
//           {selectedUser ? (
//             <>
//               <div className="flex items-center px-4 py-3 border-b border-gray-300 bg-gray-100">
//                 <Image
//                   className="w-10 h-10 rounded-full border border-gray-400"
//                   src={selectedUser.profilePicUrl || '/default-profile.png'}
//                   alt={`${selectedUser.username}'s profile picture`}
//                   width={40}
//                   height={40}
//                 />
//                 <div className="ml-4">
//                   <p className="text-lg font-medium text-gray-800">{selectedUser.username}</p>
//                   <p className="text-sm text-gray-500">
//                     {selectedUser.isOnline ? 'Online' : `Last seen: ${selectedUser.lastSeen}`}
//                   </p>
//                 </div>
//               </div>

//               <div
//                 ref={messagesContainerRef}
//                 className="flex-1 p-4 overflow-y-auto bg-white max-h-[calc(100vh-200px)]"
//               >
//                 <div className="flex flex-col space-y-4">
//                   {messages.map((msg, index) => (
//                     <div
//                       key={index}
//                       className={`max-w-xs rounded-md p-3 ${
//                         msg.senderId !== selectedUser.id
//                           ? 'self-end bg-blue-500 text-white'
//                           : 'self-start bg-gray-200'
//                       }`}
//                     >
//                       <p className="text-sm">{msg.message}</p>
//                       <p className="text-xs text-black mt-1 text-right">
//                         {new Date(msg.createdAt).toLocaleTimeString('en-US', {
//                           hour: '2-digit',
//                           minute: '2-digit',
//                           hour12: true,
//                         })}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="flex items-center p-4 border-t border-gray-300 bg-gray-100">
//                 <input
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   type="text"
//                   placeholder="Type a message"
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                 />
//                 <button
//                   type="submit"
//                   className="ml-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                   onClick={handleSend}
//                 >
//                   Send
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
//               <p className="text-lg">Select a user to start chatting</p>
//             </div>
//           )}
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default MentoChat;




///////////////////////////////////////////////////////////////////////


// "use client";
// import axios from "axios";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import socket from "@/utils/socket";
// import Swal from "sweetalert2";

// interface StudentData {
//   _id: string;
//   username: string;
//   profilePicUrl: string;
//   lastMessage: string;
// }

// interface MessageData {
//   _id: string
//   message: string;
//   senderId: string;
//   receiverId: string;
//   roomId: string;
//   deletedForSender: boolean;
//   deletedForReceiver: boolean;
// }

// const MentoChat = () => {
//   const [students, setStudents] = useState<StudentData[]>([]);
//   const [inputData, setInputData] = useState<string>('')
//   const [lastMessage, setLastMessage] = useState<string | null>(null)
//   const [messages, setMessages] = useState<MessageData[] | []>([])
//   const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
//   const [roomId, setRoomId] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8001/get/students/`, {
//           withCredentials: true,
//         });
//         console.log("get students: ", response);
//         if (response?.data?.result) {
//           const studentData = response.data.result.map(
//             (data: { studentData: StudentData }) => data.studentData
//           );

//           setStudents((prev) => {
//             const existingIds = prev.map((student) => student._id);
//             const uniqueStudents = studentData.filter(
//               (student: any) => !existingIds.includes(student._id)
//             );
//             return [...prev, ...uniqueStudents];
//           });
//         }
//       } catch (error: any) {
//         console.error("error: ", error);
//       }
//     };
//     fetchData();
//   }, []);


//   //fetch message
//   useEffect(() => {
//     const student = localStorage.getItem('selectedStudent');
//     if (student) {
//       const parsedStudent = JSON.parse(student)
//       setSelectedStudent(parsedStudent);
//       console.log(parsedStudent)
//       const fetchMessage = async (studentId: string) => {
//         try {
//           console.log('studentId: ', studentId)
//           const response = await axios.get(`http://localhost:8001/get/mentor/messages/${studentId}`, {
//             withCredentials: true
//           })
//           console.log('get msg: ', response)
//           if (response && response?.data?.result) {
//             setMessages(response?.data?.result)
//           } else {
//             setMessages([])
//           }
//         } catch (error: any) {

//         }
//       }
//       fetchMessage(String(parsedStudent?._id))
//     } else {
//       setSelectedStudent(null)
//       setRoomId(null)
//     }
//   }, [roomId])


//   // Create Room
//   const createRoom = async (studnet: StudentData) => {
//     setSelectedStudent(studnet)
//     localStorage.setItem('selectedStudent', JSON.stringify(studnet))
//     try {
//       const respose = await axios.post(`http://localhost:8001/create/mentor/room/`, { studentId: studnet._id }, {
//         withCredentials: true
//       })
//       console.log('create room: ', respose)
//       setRoomId(respose?.data?.result?._id)
//     } catch (error: any) {
//       console.log(error)
//     }
//   }

//   //save message
//   const sendMessage = async () => {
//     if (!inputData) return
//     setLastMessage(inputData)
//     setInputData('')
//     try {
//       const data = {
//         message: inputData,
//         studentId: selectedStudent?._id
//       }
//       const response = await axios.post(`http://localhost:8001/save/mentor/message`, data, {
//         withCredentials: true
//       })
//       console.log('save message: ', response)
//     } catch (error: any) {
//       console.log(error)
//     }
//   }

//   // Delete Message
//   const deleteMessage = async (messageId: string) => {
//     const result = await Swal.fire({
//       title: "Delete Message?",
//       text: "Choose an option to delete the message.",
//       icon: "warning",
//       showCancelButton: true,
//       showDenyButton: true,
//       confirmButtonColor: "#d33",
//       denyButtonColor: "#3085d6",
//       cancelButtonColor: "#aaa",
//       confirmButtonText: "Delete for Everyone",
//       denyButtonText: "Delete for Me",
//       cancelButtonText: "Cancel",
//       reverseButtons: true,
//     });

//     if (result.isConfirmed) {
//       try {
//         const response = await axios.patch(`http://localhost:8001/delete/message/everyone/${messageId}`)
//         if (response) {
//           console.log('delete ', response)
//           setMessages((prevMessages) =>
//             prevMessages.map((msg) =>
//               msg._id === messageId
//                 ? { ...msg, deletedForSender: true, deletedForReceiver: true }
//                 : msg
//             )
//           );
//         }
//         console.log("Message deleted for everyone. Message ID:", messageId);
//       } catch (error: any) {
//         console.error("Error deleting for everyone:", error);
//       }
//     } else if (result.isDenied) {
//       try {
//         const response = await axios.patch(`http://localhost:8001/delete/message/me/${messageId}`)
//         if (response) {
//           console.log('delete ', response)
//           setMessages((prevMessages) =>
//             prevMessages.map((msg) =>
//               msg._id === messageId
//                 ? { ...msg, deletedForSender: true }
//                 : msg
//             )
//           );
//         }
//         console.log("Message deleted for me. Message ID:", messageId);
//         // Add your logic to delete the message for the current user here
//       } catch (error: any) {
//         console.error("Error deleting for me:", error);
//       }
//     } else {
//       console.log("Delete action canceled.");
//     }
//   };


//   return (
//     <div className="flex justify-between items-start p-5">
//       {/* Left Section */}
//       <div className="w-1/2">
//         <h1 className="text-xl font-bold mb-5">Mentor Chat</h1>
//         <ul>
//           {students.map((student) => (
//             <li
//               key={student._id}
//               className="border border-gray-500 p-3 mb-5 rounded-lg flex items-center cursor-pointer"
//               onClick={() => createRoom(student)}
//             >
//               <img
//                 src={student?.profilePicUrl}
//                 alt={`profile`}
//                 className="w-12 h-12 rounded-full mr-3"
//               />
//               <div>
//                 <p className="font-medium">{student.username}</p>
//                 {
//                   selectedStudent?._id === student._id ?
//                     <p className="text-sm text-gray-600">
//                       Last Message: {lastMessage || student.lastMessage}
//                     </p>
//                     :
//                     <p className="text-sm text-gray-600">
//                       Last Message: {student.lastMessage}
//                     </p>
//                 }

//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Right Section */}
//       <div className="w-1/2 flex flex-col items-start">
//         {/* Render messages */}
//         {messages && messages.map((data: MessageData, index: number) => {
//           // Check if the message is from the student or the mentor
//           const isStudentMessage = data.senderId === selectedStudent?._id;

//           return (
//             <div
//               key={index}
//               className={`flex ${isStudentMessage ? "justify-start" : "justify-end"}`}
//             >
//               {/* Message from Student (Left Side) */}
//               {isStudentMessage ? (
//                 <p
//                   onClick={() => deleteMessage(data._id)}
//                   className="p-2 mb-2 bg-blue-100 text-gray-800 rounded-lg mt-2 shadow-sm hover:bg-blue-200 transition duration-200 cursor-pointer"
//                 >
//                   {data.message}
//                 </p>
//               ) : (
//                 /* Message from Mentor (Right Side) */
//                 <p
//                   onClick={() => deleteMessage(data._id)}
//                   className="p-2 mb-2 bg-green-100 text-gray-800 rounded-lg mt-2 shadow-sm hover:bg-green-200 transition duration-200 cursor-pointer"
//                 >
//                   {data.message}
//                 </p>
//               )}
//             </div>
//           );
//         })}

//         <p className="mb-3 p-2 bg-blue-100 text-gray-800 rounded-lg mt-2 shadow-sm hover:bg-blue-200 transition duration-200 cursor-pointer">
//           {lastMessage}
//         </p>

//         {/* Input Field and Send Button */}
//         <input
//           type="text"
//           value={inputData}
//           className="border border-gray-500 p-2 mb-3 w-full rounded-lg"
//           onChange={(e) => setInputData(e.target.value)}
//           placeholder="Type your message..."
//         />
//         <button
//           type="submit"
//           className="border border-gray-500 bg-blue-500 text-white px-4 py-2 rounded-lg"
//           onClick={sendMessage}
//         >
//           Send
//         </button>
//       </div>

//     </div>

//   );
// };

// export default MentoChat;

/////////////////////////////////////////// my done up ///////////////////


"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import socket from "@/utils/socket";

interface StudentData {
  _id: string;
  username: string;
  profilePicUrl: string;
  lastMessage: string;
}

interface MessageData {
  _id: string;
  message: string;
  senderId: string;
  receiverId: string;
  roomId: string;
  deletedForSender: boolean;
  deletedForReceiver: boolean;
}

interface Mentor {
  userId: string;
  username: string;
  phone: string;
  profile: File | null;
}

const MentoChat = () => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [inputData, setInputData] = useState<string>('');
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageData[] | []>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const [isTyping, setIsTyping] = useState(false); // State to track typing status
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

   const [user, setUser] = useState<Mentor | null>(null)
      useEffect(() => {
          const getUser = localStorage.getItem('mentor');
          if (getUser) {
              const parsedUser = JSON.parse(getUser);
              setUser(parsedUser);
          }
      }, []);

  // get users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8001/get/students/`, {
          withCredentials: true,
        });
        if (response?.data?.result) {
          const studentData = response.data.result.map(
            (data: { studentData: StudentData }) => data.studentData
          );

          setStudents((prev) => {
            const existingIds = prev.map((student) => student._id);
            const uniqueStudents = studentData.filter(
              (student: any) => !existingIds.includes(student._id)
            );
            return [...prev, ...uniqueStudents];
          });
        }
      } catch (error: any) {
        console.error("error: ", error);
      }
    };
    fetchData();
  }, []);

  // Emit typing event when user types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData(e.target.value);

    if (e.target.value) {
        // Emit typing event
        socket.emit('mentorTyping', { roomId, userId: user?.userId });
        // setIsTyping(true);

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set a timeout to emit stop typing after 1 second of inactivity
        // typingTimeoutRef.current = setTimeout(() => {
        //     socket.emit('mentorStopTyping', { roomId, userId: user?.userId });
        //     setIsTyping(false);
        // }, 1000);
    } else {
        // If input is cleared, emit stop typing
        socket.emit('mentorStopTyping', { roomId, userId: user?.userId });
        setIsTyping(false);
    }
};

// Listen for typing events from the server
useEffect(() => {
    const handleTyping = (data: { userId: string }) => {
        // Logic to show typing indicator for the specific user
        if (data.userId !== user?.userId) {
            setIsTyping(true);
        }
    };

    const handleStopTyping = (data: { userId: string }) => {
        // Logic to hide typing indicator for the specific user
        if (data.userId !== user?.userId) {
            setIsTyping(false);
        }
    };

    socket.on('studentTyping', handleTyping);
    socket.on('studentStopTyping', handleStopTyping);

    return () => {
        socket.off('studentTyping', handleTyping);
        socket.off('studentStopTyping', handleStopTyping);
    };
}, [user]);

  //connect to server socket
  socket.on("connect", () => {
    console.log(`you have connected with socket io ${socket.id}`)
  })

  //scroll top
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch messages
  useEffect(() => {
    const student = localStorage.getItem('selectedStudent');
    if (student) {
      const parsedStudent = JSON.parse(student);
      setSelectedStudent(parsedStudent);
      const fetchMessage = async (studentId: string) => {
        try {
          const response = await axios.get(`http://localhost:8001/get/mentor/messages/${studentId}`, {
            withCredentials: true
          });
          if (response?.data?.result) {
            setMessages(response?.data?.result);
            // Set the last message from the fetched messages
            const lastMsg = response.data.result[response.data.result.length - 1];
            setLastMessage(lastMsg?.message || "");
          } else {
            setMessages([]);
          }
        } catch (error: any) {
          console.error("Error fetching messages:", error);
        }
      }
      fetchMessage(String(parsedStudent?._id));
    } else {
      setSelectedStudent(null);
      setRoomId(null);
    }
  }, [roomId]);

  // Create Room
  const createRoom = async (student: StudentData) => {
    setSelectedStudent(student);
    localStorage.setItem('selectedStudent', JSON.stringify(student));
    try {
      const response = await axios.post(`http://localhost:8001/create/mentor/room/`, { studentId: student._id }, {
        withCredentials: true
      });
      setRoomId(response?.data?.result?._id);
      socket.emit('joinRoom', response?.data?.result?._id)
    } catch (error: any) {
      console.log(error);
    }
  }

  //receive message
  useEffect(() => {
    const handleReceiveMessage = (data: MessageData) => {
      console.log('Received message:', data);
      setLastMessage(data.message)
      setMessages((prevMessages) => [...prevMessages, data]); // Update messages instantly
    };

    socket.on('receiveMessage', handleReceiveMessage);

    // Clean up the listener on unmount
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, []);


  // Save message
  const sendMessage = async () => {
    if (!inputData) return;

    setLastMessage(inputData);
    setInputData('');
    try {
      const data = {
        message: inputData,
        studentId: selectedStudent?._id
      };
      const response = await axios.post(`http://localhost:8001/save/mentor/message`, data, {
        withCredentials: true
      });
      const messageData = {
        receiverId: selectedStudent?._id,
        message: response.data.result,
        roomId
      }
      socket.emit('sendMessage', messageData)
      // setMessages((prevMessages) => [...prevMessages, response.data.result]);
    } catch (error: any) {
      console.log(error);
    }
  }

  // Delete message
  const deleteMessage = async (messageId: string) => {
    const result = await Swal.fire({
      title: "Delete Message?",
      text: "Choose an option to delete the message.",
      icon: "warning",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonColor: "#d33",
      denyButtonColor: "#3085d6",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Delete for Everyone",
      denyButtonText: "Delete for Me",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`http://localhost:8001/delete/message/everyone/${messageId}`);
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId
              ? { ...msg, deletedForSender: true, deletedForReceiver: true }
              : msg
          )
        );
      } catch (error: any) {
        console.error("Error deleting for everyone:", error);
      }
    } else if (result.isDenied) {
      try {
        await axios.patch(`http://localhost:8001/delete/message/me/${messageId}`);
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId
              ? { ...msg, deletedForSender: true }
              : msg
          )
        );
      } catch (error: any) {
        console.error("Error deleting for me:", error);
      }
    }
  };

  return (
    // <div className="flex justify-between items-start p-5 h-screen">
    //   {/* Left Section: Chat List */}
    //   <div className="w-1/3 max-h-[600px] overflow-y-auto pr-2">
    //     <h1 className="text-xl font-bold mb-5">Student Chat</h1>
    //     <ul>
    //       {students.slice(0, 6).map((student) => (
    //         <li
    //           key={student._id}
    //           className="border border-gray-500 p-3 mb-5 rounded-lg flex items-center cursor-pointer"
    //           onClick={() => createRoom(student)}
    //         >
    //           <img
    //             src={student?.profilePicUrl}
    //             alt={`profile`}
    //             className="w-12 h-12 rounded-full mr-3"
    //           />
    //           <div>
    //             <p className="font-medium">{student.username}</p>
    //             <p className="text-sm text-gray-600">
    //               Last Message: {student._id === selectedStudent?._id ? lastMessage || student.lastMessage : student.lastMessage}
    //             </p>
    //           </div>
    //         </li>
    //       ))}
    //     </ul>
    //     {students.length > 6 && (
    //       <p className="text-blue-500 cursor-pointer">Show more...</p>
    //     )}
    //   </div>

    //   {/* Right Section: Messages */}
    //   <div className="w-2/3 flex flex-col justify-between">
    //     <div
    //       ref={messagesContainerRef}
    //       className="flex-1 overflow-y-auto p-3"
    //       style={{ maxHeight: '70vh' }}>
    //       {/* Render messages continuously */}
    //       {messages && messages.map((data: MessageData, index: number) => {
    //         const isStudentMessage = data.senderId === selectedStudent?._id;
    //         return (
    //           <div key={index} className={`flex mb-3 ${isStudentMessage ? "justify-start" : "justify-end"}`}>
    //             <p
    //               onClick={() => deleteMessage(data._id)}
    //               className={`p-2 rounded-lg shadow-sm max-w-xs cursor-pointer ${isStudentMessage ? 'bg-blue-100 text-gray-800' : 'bg-green-100 text-gray-800'}`}
    //             >
    //               {data.message}
    //             </p>
    //           </div>
    //         );
    //       })}
    //     </div>

    //     {/* Input Field and Send Button */}
    //     <div className="flex items-center p-2">
    //       <input
    //         type="text"
    //         value={inputData}
    //         className="border border-gray-500 p-2 w-full rounded-lg"
    //         onChange={(e) => setInputData(e.target.value)}
    //         placeholder="Type your message..."
    //       />
    //       <button
    //         type="submit"
    //         className="border border-gray-500 bg-blue-500 text-white px-4 py-2 rounded-lg ml-2"
    //         onClick={sendMessage}
    //       >
    //         Send
    //       </button>
    //     </div>
    //   </div>
    // </div>

    <div className="flex justify-between items-start p-6 h-screen bg-gray-100">
      {/* Left Section: Chat List */}
      <div className="w-1/3 max-h-[600px] overflow-y-auto pr-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Student Chat</h1>
        <ul className="space-y-4">
          {students.slice(0, 6).map((student) => (
            <li
              key={student._id}
              className={`border border-gray-300 shadow-sm p-4 rounded-lg flex items-center cursor-pointer transition hover:shadow-md hover:bg-gray-50 ${
                selectedStudent?._id === student._id ? 'bg-gray-100 border-blue-500' : ''
              }`}
              onClick={() => createRoom(student)}
            >
              <img
                src={student?.profilePicUrl}
                alt={`profile`}
                className="w-14 h-14 rounded-full mr-4 object-cover border border-gray-200"
              />
              <div>
                <p className="font-medium text-lg text-gray-700">{student.username}</p>
                <p className="text-sm text-gray-500">
                  Last Message: {student._id === selectedStudent?._id ? lastMessage || student.lastMessage : student.lastMessage}
                </p>
              </div>
            </li>
          ))}
        </ul>
        {students.length > 6 && (
          <p className="text-blue-600 mt-4 text-center cursor-pointer hover:underline">Show more...</p>
        )}
      </div>

      {/* Right Section: Messages */}
      {/* Right Section: Messages */}
<div className="w-2/3 flex flex-col bg-white shadow-lg rounded-lg p-6">
  {/* Chat Header */}
  {selectedStudent && (
    <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
      <div className="flex items-center">
        <img
          src={selectedStudent.profilePicUrl}
          alt={`profile`}
          className="w-14 h-14 rounded-full mr-4 object-cover border border-gray-200"
        />
        <div>
          <p className="text-lg font-bold text-gray-700">{selectedStudent.username}</p>
          {/* <p className="text-sm text-gray-500">
            Status:{" "}
            <span
              className={`font-medium ${
                selectedStudent.isOnline ? "text-green-500" : "text-gray-400"
              }`}
            >
              {selectedStudent.isOnline ? "Online" : "Offline"}
            </span>
          </p> */}
          {/* Typing Indicator */}
          {isTyping && (
                        <div className="text-gray-500 italic">Typing...</div>
                    )}
        </div>
      </div>
    </div>
  )}

  {/* Messages List */}
  <div
    ref={messagesContainerRef}
    className="flex-1 overflow-y-auto mb-4 space-y-3 p-4 bg-gray-50 rounded-lg p-3 scrollbar-hide"
    style={{ maxHeight: "65vh" }}
  >
    {messages &&
      messages.map((data, index) => {
        const isStudentMessage = data.senderId === selectedStudent?._id;
        return (
          <div
            key={index}
            className={`flex ${isStudentMessage ? "justify-start" : "justify-end"}`}
          >
            <p
              onClick={() => deleteMessage(data._id)}
              className={`p-3 rounded-lg shadow-sm max-w-xs cursor-pointer text-sm transition-transform hover:scale-105 ${
                isStudentMessage
                  ? "bg-blue-100 text-gray-700"
                  : "bg-green-100 text-gray-700"
              }`}
            >
              {data.message}
            </p>
          </div>
        );
      })}
  </div>

  {/* Input Field and Send Button */}
  <div className="flex items-center space-x-3">
    <input
      type="text"
      value={inputData}
      className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
      // onChange={(e) => setInputData(e.target.value)}
      onChange={handleInputChange}
      placeholder="Type your message..."
    />
    <button
      type="submit"
      className="bg-blue-500 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-600 focus:ring focus:ring-blue-300 transition"
      onClick={sendMessage}
    >
      Send
    </button>
  </div>
</div>

    </div>
  );
};

export default MentoChat;
