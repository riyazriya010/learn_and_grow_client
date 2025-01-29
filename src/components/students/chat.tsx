
// "use client";

// import React, { useEffect, useState } from 'react';
// import socket from '@/utils/socket';
// import axios from 'axios';
// import Image from 'next/image';
// import Navbar from './navbar';
// import { ToastContainer, toast, Slide } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Footer from './loggedoutNav/footer';

// interface Message {
//     senderId: string;
//     message: string;
//     timestamp: string;
//     isDeleted: boolean;
// }

// interface Chat {
//     _id: string;
//     mentorId: string;
//     courseId: string;
// }

// interface Data {
//     userData: { _id: string, username: string, profilePicUrl: string };
//     mentorData: { _id: string, username: string, profilePicUrl: string, isOnline: boolean; lastSeen: string; };
// }

// interface SelectedUser {
//     id: string;
//     username: string;
//     profilePicUrl: string;
//     isOnline: boolean;
//     lastSeen: string;
// }

// const StudentChat = () => {
//     const [message, setMessage] = useState<String>('')
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [data, setData] = useState<Data[] | []>([])
//     // const [msg, setMsg] = useState<string>('')
//     // const [roomId, setRoomId] = useState<string>('')
//     const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
//     const [roomId, setRoomId] = useState<string | null>(null)

//     useEffect(() => {

//         //selectedUser from localstorage
//         const getUser = localStorage.getItem('selectedUser');
//         const getRoom = localStorage.getItem('roomId')
//         if (getUser && getRoom) {
//             const parsedUser = JSON.parse(getUser);
//             const parsedRoom = JSON.parse(getRoom)
//             console.log('id: ', parsedRoom[0])
//             setSelectedUser(parsedUser)
//             setRoomId(parsedRoom[0])
//         } else {
//             console.log('No user found in localStorage');
//         }


//         // This is for Get the accessed mentor for create Room
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8001/get/users')
//                 const serverData = response?.data?.data;
//                 const existingMentorIds = new Set(data.map((item) => item.mentorData._id));
//                 const uniqueMentors = serverData.filter(
//                     (item: Data) => !existingMentorIds.has(item.mentorData._id)
//                 );
//                 setData((prevState) => [
//                     ...prevState,
//                     ...uniqueMentors.filter(
//                         (newItem: any, index: any, self: any) =>
//                             index === self.findIndex((i: any) => i.mentorData._id === newItem.mentorData._id)
//                     ),
//                 ]);
//                 // setData(response?.data?.data)
//             } catch (error: unknown) {
//                 console.log('error: ', error)
//             }
//         }
//         fetchData()
//     }, [])

//     // fetch messages
//     useEffect(() => {
//         // Socket listener for receiving messages
//         socket.on("receiveMessage", (newMessage: Message) => {
//             setMessages(prevMessages => [...prevMessages, newMessage]);
//         });

//         // Fetch messages when the component mounts
//         const fetchMessages = async () => {
//             const response = await axios.get(`http://localhost:8001/get/message/${roomId}`);
//             setMessages(response.data); // Assuming response contains the messages
//         };

//         fetchMessages();

//         return () => {
//             socket.off("receiveMessage");
//         };
//     }, [roomId]);

//     socket.on("connect", () => {
//         console.log(`you have connected with socket io ${socket.id}`)
//     })

//     socket.on('reciveMessage', message => {
//         alert(message)
//     })

//     const handleSend = async () => {
//         if (!message || !roomId) return;
//         const data = {
//             message,
//             roomId,
//         };
//         socket.emit('sendMessage', data);
//         try {
//             let datas: any = {}
//             if (selectedUser) {
//                 datas = {
//                   message,
//                   roomId,
//                   receiverId: selectedUser.id
//                 };
//               }
//             const sendMessage = await axios.post('http://localhost:8001/save/message', datas, {
//                 withCredentials: true
//             })
//             console.log('res ', sendMessage)
//         } catch (error: unknown) {
//             console.log(error)
//         }
//     }

//     // create room
//     const createRoom = async (userId: string, mentorId: string) => {
//         try {
//             const response = await axios.get(`http://localhost:8001/create/room/${userId}/${mentorId}`)
//             console.log('res ', response)
//             const roomId = response?.data?.data?._id
//             localStorage.setItem('roomId', JSON.stringify([roomId]))
//             socket.emit('joinRoom', roomId)

//             //get messages with roomId
//             const fetchMessage = await axios.get(`http://localhost:8001/get/message/${roomId}`)
//             console.log('mesg ', fetchMessage)
//         } catch (error: unknown) {
//             console.log('error ', error)
//         }
//     }

//     return (
//         <>
//             <div className="flex flex-col h-screen bg-white">
//                 <header>
//                     <Navbar />
//                 </header>

//                 <ToastContainer autoClose={2000} transition={Slide} />

//                 <div className="flex flex-1 w-full justify-center items-center py-16 px-6">
//                     {/* Chat List Section */}
//                     <div className="w-1/3 border-r border-gray-300 overflow-y-auto rounded-md shadow-md">
//                         <h2 className="text-lg font-bold text-center py-4 border-b">Chats</h2>
//                         {data &&
//                             data.map((val, index) => (
//                                 <div
//                                     key={index}
//                                     className="flex items-center p-3 border-b border-gray-300 cursor-pointer hover:bg-gray-100"
//                                     onClick={() => {
//                                         createRoom(val.userData._id, val.mentorData._id);
//                                         const user = {
//                                             id: val.mentorData._id,
//                                             username: val.mentorData.username,
//                                             profilePicUrl: val.userData.profilePicUrl,
//                                             isOnline: val.mentorData.isOnline,
//                                             lastSeen: val.mentorData.lastSeen,
//                                         };
//                                         setSelectedUser(user);
//                                         localStorage.setItem('selectedUser', JSON.stringify(user));
//                                     }}
//                                 >
//                                     {/* Profile Picture */}
//                                     <Image
//                                         className="w-12 h-12 rounded-full border border-gray-400"
//                                         src={val.userData.profilePicUrl}
//                                         alt={`${val.mentorData.username}'s profile picture`}
//                                         width={48}
//                                         height={48}
//                                     />

//                                     {/* Mentor Name */}
//                                     <div className="ml-4">
//                                         <p className="text-lg font-medium text-gray-800">{val.mentorData.username}</p>
//                                         <p className="text-sm text-gray-500">Tap to start a chat</p>
//                                     </div>
//                                 </div>
//                             ))}
//                     </div>

//                     {/* Chat Section */}
//                     <div className="flex flex-col w-2/3 rounded-md shadow-md">
//                         {selectedUser ? (
//                             <>
//                                 {/* Chat Header */}
//                                 <div className="flex items-center px-4 py-3 border-b border-gray-300 bg-gray-100">
//                                     <Image
//                                         className="w-10 h-10 rounded-full border border-gray-400"
//                                         src={selectedUser.profilePicUrl || '/default-profile.png'}
//                                         alt={`${selectedUser.username}'s profile picture`}
//                                         width={40}
//                                         height={40}
//                                     />
//                                     <div className="ml-4">
//                                         <p className="text-lg font-medium text-gray-800">{selectedUser.username}</p>
//                                         <p className="text-sm text-gray-500">{selectedUser.isOnline ? 'Online' : `Last seen: ${selectedUser.lastSeen || 'N/A'}`}</p>
//                                     </div>
//                                 </div>

//                                 {/* Chat Messages */}
//                                 <div className="flex-1 p-4 overflow-y-auto bg-white">
//                                     <div className="flex flex-col space-y-4">
//                                         {/* Example Message */}
//                                         <div className="self-start bg-gray-200 px-4 py-2 rounded-md max-w-sm">
//                                             <p className="text-sm">Hello! How can I help you?</p>
//                                             <p className="text-xs text-gray-500 mt-1 text-right">10:30 AM</p>
//                                         </div>

//                                         <div className="self-end bg-blue-500 text-white px-4 py-2 rounded-md max-w-sm">
//                                             <p className="text-sm">{message || `I have a question about the course.`}</p>
//                                             <p className="text-xs text-gray-300 mt-1 text-right">10:32 AM</p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Message Input */}
//                                 <div className="flex items-center p-4 border-t border-gray-300 bg-gray-100">
//                                     <input
//                                         className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                         type="text"
//                                         placeholder="Type a message"
//                                         onChange={(e) => setMessage(e.target.value)}
//                                     />
//                                     <button
//                                         type="submit"
//                                         className="ml-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                                         onClick={handleSend}
//                                     >
//                                         Send
//                                     </button>
//                                 </div>
//                             </>
//                         ) : (
//                             <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
//                                 <p className="text-lg">Select a user to start chatting</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <Footer />
//             </div>



//         </>
//     )
// };

// export default StudentChat;





// "use client";

// import React, { useEffect, useRef, useState } from 'react';
// import socket from '@/utils/socket';
// import axios from 'axios';
// import Image from 'next/image';
// import Navbar from '../navbar';
// import { ToastContainer, toast, Slide } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Footer from '../loggedoutNav/footer';
// import { USER_SERVICE_URL } from '@/utils/constant';

// interface Message {
//     senderId: string;
//     message: string;
//     createdAt: string;
//     isDeleted: boolean;
// }

// interface Chat {
//     _id: string;
//     mentorId: string;
//     courseId: string;
// }

// interface Data {
//     lastMessage?: string;
//     userData: { _id: string, username: string, profilePicUrl: string };
//     mentorData: { _id: string, username: string, profilePicUrl: string, isOnline: boolean; lastSeen: string; };
// }

// interface SelectedUser {
//     id: string;
//     username: string;
//     profilePicUrl: string;
//     isOnline: boolean;
//     lastSeen: string;
// }

// const StudentChat = () => {
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
//                 const response = await axios.get(`${USER_SERVICE_URL}/get/users`,{
//                     withCredentials: true
//                 })
//                 console.log('res ', response)
//                 const serverData = response?.data?.result;
//                 console.log('ser: ', serverData)
//                 if(serverData){
//                 const existingMentorIds = new Set(data.map((item) => item.mentorData._id));
//                 const uniqueMentors = serverData?.filter(
//                     (item: Data) => !existingMentorIds?.has(item.mentorData._id)
//                 );
//                 setData((prevState) => [
//                     ...prevState,
//                     ...uniqueMentors?.filter(
//                         (newItem: any, index: any, self: any) =>
//                             index === self.findIndex((i: any) => i.mentorData._id === newItem.mentorData._id)
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
//                 const response = await axios.get(`${USER_SERVICE_URL}/get/message/${roomId}`,{
//                     withCredentials: true
//                 });
//                 console.log('ress msg', response)
//                 setMessages(response.data.result || []);
//             };

//             fetchMessages();

//             socket.on('receiveMessage', (newMessage: Message) => {
//                 setMessages(prevMessages => [...prevMessages, newMessage]);
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

//         const senderId = data.find((user: any) => user.mentorData._id === selectedUser.id)?.userData._id;

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
//             senderId: String(senderId),
//             receiverId: selectedUser.id
//         };

//         socket.emit('sendMessage', datas);

//         try {
//             await axios.post(`${USER_SERVICE_URL}/save/message`, datas, {
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
//             const response = await axios.post(`${USER_SERVICE_URL}/create/room`,Ids, {
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
//                                     createRoom(val.userData._id, val.mentorData._id);
//                                     const user = {
//                                         id: val.mentorData._id,
//                                         username: val.mentorData.username,
//                                         profilePicUrl: val.userData.profilePicUrl,
//                                         isOnline: val.mentorData.isOnline,
//                                         lastSeen: val.mentorData.lastSeen,
//                                     };
//                                     setSelectedUser(user);
//                                     localStorage.setItem('selectedUser', JSON.stringify(user));
//                                 }}
//                             >
//                                 <Image
//                                     className="w-12 h-12 rounded-full border border-gray-400"
//                                     src={val.userData.profilePicUrl}
//                                     alt={`${val.mentorData.username}'s profile picture`}
//                                     width={48}
//                                     height={48}
//                                 />
//                                 <div className="ml-4">
//                                     <p className="text-lg font-medium text-gray-800">{val.mentorData.username}</p>
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

// export default StudentChat;



/////////////////////////////////////////////// main

// "use client";

// import React, { useEffect, useRef, useState } from 'react';
// import socket from '@/utils/socket';
// import axios from 'axios';
// import Image from 'next/image';
// import Navbar from '../navbar';
// import { ToastContainer, toast, Slide } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Footer from '../loggedoutNav/footer';
// import { USER_SERVICE_URL } from '@/utils/constant';

// interface Message {
//     senderId: string;
//     message: string;
//     createdAt: string;
//     isDeleted: boolean;
// }

// interface Chat {
//     _id: string;
//     mentorId: string;
//     courseId: string;
// }

// interface Data {
//     isNewMessage: any;
//     lastMessage?: string;
//     userData: { _id: string, username: string, profilePicUrl: string };
//     mentorData: { _id: string, username: string, profilePicUrl: string, isOnline: boolean; lastSeen: string; };
// }

// interface SelectedUser {
//     id: string;
//     username: string;
//     profilePicUrl: string;
//     isOnline: boolean;
//     lastSeen: string;
// }

// const StudentChat = () => {
//     const [message, setMessage] = useState<string>('');
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [data, setData] = useState<Data[] | []>([]);
//     const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
//     const [roomId, setRoomId] = useState<string | null>(null);
//     const messagesContainerRef = useRef<HTMLDivElement | null>(null);
//     // const notification = new Audio('/Audio/text-message.mp3')

//     useEffect(() => {
//         // Fetch mentors list
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get(`${USER_SERVICE_URL}/get/users`, {
//                     withCredentials: true
//                 })
//                 const serverData = response?.data?.result;
//                 console.log('ser: ', serverData)
//                 if (serverData) {
//                     const existingMentorIds = new Set(data.map((item) => item.mentorData._id));
//                     const uniqueMentors = serverData?.filter(
//                         (item: Data) => !existingMentorIds?.has(item.mentorData._id)
//                     );
//                     setData((prevState) => [
//                         ...prevState,
//                         ...uniqueMentors?.filter(
//                             (newItem: any, index: any, self: any) =>
//                                 index === self.findIndex((i: any) => i.mentorData._id === newItem.mentorData._id)
//                         ),
//                     ]);
//                 } else {
//                     setData([])
//                 }
//             } catch (error) {
//                 console.error('Error fetching users:', error);
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
//                 try {
//                     const response = await axios.get(`${USER_SERVICE_URL}/get/message/${roomId}`, {
//                         withCredentials: true
//                     });
//                     setMessages(response.data.result || []);
//                 } catch (error: any) {
//                     if(error && error.response?.data?.message === "Message Not Found"){
//                         toast.info("Message Not Found")
//                         return;
//                     }
//                     console.error('Error fetching messages:', error);
//                 }
//             };

//             fetchMessages();

//             // Listen for new messages
//             socket.on('receiveMessage', (newMessage: Message) => {
//                 const isCurrentChat = newMessage.senderId === selectedUser?.id;

//                 // Update message list in the current chat
//                 if (isCurrentChat) {
//                     setMessages((prevMessages) => [...prevMessages, newMessage]);
//                 }

//                 // Update the chat list
//                 setData((prevData) => {
//                     const updatedData = prevData.map((chat) => {
//                         if (chat.mentorData._id === newMessage.senderId) {
//                             return {
//                                 ...chat,
//                                 lastMessage: newMessage.message,
//                                 isNewMessage: !isCurrentChat, // Mark as new if it's not the current chat
//                             };
//                         }
//                         return chat;
//                     });

//                     // Reorder chats: move the chat with the new message to the top
//                     updatedData.sort((a, b) =>
//                         a.mentorData._id === newMessage.senderId ? -1 : 1
//                     );

//                     return updatedData;
//                 });
//             });

//             return () => {
//                 socket.off('receiveMessage');
//             };
//         }
//     }, [roomId, selectedUser]);

//     useEffect(() => {
//         if (messagesContainerRef.current) {
//             messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
//         }
//     }, [messages]);

//     useEffect(() => {
//         // Listen for notification
//         socket.on('notification', (data) => {
//             console.log('Notification received: ', data);
//             // Play a notification sound
//             //   notification.play();

//             // Show a toast or any visual notification
//             toast.info(`you got a message: ${data.message}`);
//         });

//         return () => {
//             socket.off('notification');
//         };
//     }, []);


//     const handleSend = async () => {
//         if (!message || !roomId || !selectedUser) return;

//         const senderId = data.find((user) => user.mentorData._id === selectedUser.id)?.userData._id;

//         const newMessage = {
//             message,
//             senderId: String(senderId),
//             createdAt: new Date().toISOString(),
//             isDeleted: false,
//         };

//         try {
//             await axios.post(`${USER_SERVICE_URL}/save/message`, {
//                 message,
//                 roomId,
//                 senderId: String(senderId),
//                 receiverId: selectedUser.id
//             }, {
//                 withCredentials: true
//             });

//             // Message will be added automatically when socket emits "receiveMessage"
//             socket.emit('sendMessage', {
//                 ...newMessage,
//                 roomId,
//                 receiverId: selectedUser.id
//             });

//             setMessage('');

//             // Update the last message of the relevant chat
//             setData((prevData) => {
//                 return prevData.map((chat) => {
//                     if (chat.mentorData._id === selectedUser.id) {
//                         return {
//                             ...chat,
//                             lastMessage: message,
//                         };
//                     }
//                     return chat;
//                 });
//             });

//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     };

//     const createRoom = async (userId: string, mentorId: string) => {
//         try {

//             const response = await axios.post(`${USER_SERVICE_URL}/create/room`, { userId, mentorId }, {
//                 withCredentials: true
//             });
//             console.log('create room: ', response)
//             const roomId = response?.data?.result?._id;
//             localStorage.setItem('roomId', JSON.stringify([roomId]));
//             socket.emit('joinRoom', roomId);
//             setRoomId(roomId);
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
//                                 className={`flex items-center p-3 border-b border-gray-300 cursor-pointer hover:bg-gray-100 ${val.isNewMessage ? 'bg-yellow-100' : ''
//                                     }`}
//                                 onClick={() => {
//                                     createRoom(val.userData._id, val.mentorData._id);
//                                     const user = {
//                                         id: val.mentorData._id,
//                                         username: val.mentorData.username,
//                                         profilePicUrl: val.userData.profilePicUrl,
//                                         isOnline: val.mentorData.isOnline,
//                                         lastSeen: val.mentorData.lastSeen,
//                                     };
//                                     setSelectedUser(user);
//                                     localStorage.setItem('selectedUser', JSON.stringify(user));

//                                     // Mark chat as read
//                                     setData((prevData) => {
//                                         return prevData.map((chat) => {
//                                             if (chat.mentorData._id === val.mentorData._id) {
//                                                 return { ...chat, isNewMessage: false };
//                                             }
//                                             return chat;
//                                         });
//                                     });
//                                 }}
//                             >
//                                 <Image
//                                     className="w-12 h-12 rounded-full border border-gray-400"
//                                     src={val.userData.profilePicUrl}
//                                     alt={`${val.mentorData.username}'s profile picture`}
//                                     width={48}
//                                     height={48}
//                                 />
//                                 <div className="ml-4">
//                                     <p className="text-lg font-medium text-gray-800">{val.mentorData.username}</p>
//                                     <p className={`text-sm ${val.isNewMessage ? 'font-bold text-black' : 'text-gray-500'}`}>
//                                         {val.lastMessage}
//                                     </p>
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
//                                             <p className="text-sm">{msg.message}</p>
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

// export default StudentChat;




"use client";
import axios from "axios";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import socket from "@/utils/socket";
import Swal from "sweetalert2";

interface MentorsData {
    _id: string;
    username: string;
    profilePicUrl: string;
    lastMessage: string;
    userMsgCount: number
}

interface MessageData {
    _id: string
    message: string;
    senderId: string;
    receiverId: string;
    roomId: string;
    deletedForSender: boolean;
    deletedForReceiver: boolean;
    readed: boolean
}

interface User {
    userId: string;
    username: string;
    phone: string;
    profile: File | null;
}


const StudentChat = () => {
    const [mentors, setMentors] = useState<MentorsData[]>([]);
    const [inputData, setInputData] = useState<string>('')
    const [lastMessage, setLastMessage] = useState<string | null>(null)
    const [messages, setMessages] = useState<MessageData[] | []>([])
    const [selectedMentor, setSelectedMentor] = useState<MentorsData | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null)
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const [refreshState, setRefreshState] = useState(0);

    const [isTyping, setIsTyping] = useState(false); // State to track typing status
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [user, setUser] = useState<User | null>(null)
    useEffect(() => {
        const getUser = localStorage.getItem('user');
        if (getUser) {
            const parsedUser = JSON.parse(getUser);
            setUser(parsedUser);
        }
    }, []);

    // Emit typing event when user types
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputData(e.target.value);

        if (e.target.value) {
            // Emit typing event
            socket.emit('studentTyping', { roomId, userId: user?.userId });
            // setIsTyping(true);

            // Clear previous timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // Set a timeout to emit stop typing after 1 second of inactivity
            // typingTimeoutRef.current = setTimeout(() => {
            //     socket.emit('studentTyping', { roomId, userId: user?.userId });
            //     setIsTyping(false);
            // }, 1000);
        } else {
            // If input is cleared, emit stop typing
            socket.emit('studentStopTyping', { roomId, userId: user?.userId });
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

        socket.on('mentorTyping', handleTyping);
        socket.on('mentorStopTyping', handleStopTyping);

        return () => {
            socket.off('mentorTyping', handleTyping);
            socket.off('mentorStopTyping', handleStopTyping);
        };
    }, [user]);


    //fetch mentors
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8001/get/mentors/`, {
                withCredentials: true,
            });
            console.log("get mentors: ", response);
            if (response?.data?.result) {
                const mentorData = response.data.result.map(
                    (data: { mentorsData: MentorsData }) => data.mentorsData
                );

                setMentors(mentorData)
            }
        } catch (error: any) {
            console.error("error: ", error);
        }
    };


    //fetch users
    useEffect(() => {
        fetchData();
    }, []);

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


    //fetch message
    const fetchMessage = async (mentorId: string) => {
        try {
            const response = await axios.get(`http://localhost:8001/get/messages/${mentorId}`, {
                withCredentials: true
            })
            console.log('get msg: ', response)
            if (response && response?.data?.result) {
                setMessages(response?.data?.result)

                const lastMsg = response.data.result[response.data.result.length - 1];
                setLastMessage(lastMsg?.message || "");
            } else {
                setMessages([])
            }
        } catch (error: any) {

        }
    }

    //fetch message
    useEffect(() => {
        const mentor = localStorage.getItem('selectedMentor');
        if (mentor) {
            const parsedMentor = JSON.parse(mentor)
            setSelectedMentor(parsedMentor);
            console.log(parsedMentor)

            fetchMessage(String(parsedMentor?._id))
        } else {
            setSelectedMentor(null)
            setRoomId(null)
        }
    }, [roomId])

    //notify message count
    const handleUpdateList = async () => {
        await fetchData(); // Fetch updated data
        setRefreshState(prev => prev + 1); // Trigger re-render by changing the dummy state
        console.log('Mentors list updated');
    };

    //notify message count
    useEffect(() => {
        socket.on('notify', handleUpdateList);

        return () => {
            socket.off('notify', handleUpdateList);
        };
    }, []);

    //receive message
    // useEffect(() => {

    //     const handleReceiveMessage = async (data: MessageData) => {
    //         console.log('Received message:', data);
    //         setLastMessage(data.message)
    //         setMessages((prevMessages) => [...prevMessages, data]);


    //         // Update the mentor's unread message count if the message is not from the selected mentor
    //         // if (data.senderId !== selectedMentor?._id) {
    //         //     setMentors((prevMentors) =>
    //         //         prevMentors.map((mentor) =>
    //         //             mentor._id === data.senderId
    //         //                 ? { ...mentor, userMsgCount: mentor.userMsgCount + 1 }
    //         //                 : mentor
    //         //         )
    //         //     );
    //         // }
    //         console.log('received')
    //         await fetchData()

    //     };

    //     socket.on('receiveMessage', handleReceiveMessage);

    //     // Clean up the listener on unmount
    //     return () => {
    //         socket.off('receiveMessage', handleReceiveMessage);
    //     };
    // }, []);

    // Receive message
    useEffect(() => {
        const handleReceiveMessage = async (data: MessageData) => {
            console.log('Received message:', data);

            // Check if the message is for the currently selected mentor
            if (data.senderId === selectedMentor?._id) {
                setLastMessage(data.message);
                // If the message is from the selected mentor, add it to the messages
                setMessages((prevMessages) => [...prevMessages, data]);
            } else {
                // If the message is from a different mentor, you can update the unread count
                setMentors((prevMentors) =>
                    prevMentors.map((mentor) =>
                        mentor._id === data.senderId
                            ? { ...mentor, userMsgCount: mentor.userMsgCount + 1 }
                            : mentor
                    )
                );
            }

            // Update the last message displayed
        };

        socket.on('receiveMessage', handleReceiveMessage);

        // Clean up the listener on unmount
        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
        };
    }, [selectedMentor]); // Add selectedMentor as a dependency




    // Create Room
    const createRoom = async (mentor: MentorsData) => {
        // handleCount(mentor._id)

        if (selectedMentor && selectedMentor._id !== mentor._id) {
            await handleCount(selectedMentor._id); // Reset count for the previous mentor
        }

        setSelectedMentor(mentor)
        localStorage.setItem('selectedMentor', JSON.stringify(mentor))
        try {
            const respose = await axios.post(`http://localhost:8001/create/room/`, { mentorId: mentor._id }, {
                withCredentials: true
            })
            if (respose) {
                console.log('create room: ', respose)
                setRoomId(respose?.data?.result?._id)
                socket.emit('joinRoom', respose?.data?.result?._id)
            }
        } catch (error: any) {
            console.log(error)
        }
    }

    //save message
    const sendMessage = async () => {
        if (!inputData) return

        if (!inputData || !selectedMentor) return;

        setLastMessage(inputData)
        setInputData('')
        try {
            const data = {
                message: inputData,
                mentorId: selectedMentor?._id,
                roomId
            }
            const response = await axios.post(`http://localhost:8001/save/message`, data, {
                withCredentials: true
            })
            console.log('save message: ', response)
            const messageData = {
                receiverId: selectedMentor?._id,
                message: response.data.result,
                roomId
            }
            await fetchMessage(selectedMentor._id)
            socket.emit('sendMessage', messageData)
            // setMessages((prevMessages) => [...prevMessages, response.data.result]);
        } catch (error: any) {
            console.log(error)
        }
    }

    // Delete Message
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
                const response = await axios.patch(`http://localhost:8001/delete/message/everyone/${messageId}`, {}, {
                    withCredentials: true
                })
                if (response) {
                    console.log('delete ', response)
                    setMessages((prevMessages) =>
                        prevMessages.map((msg) =>
                            msg._id === messageId
                                ? { ...msg, deletedForSender: true, deletedForReceiver: true }
                                : msg
                        )
                    );
                }
                console.log("Message deleted for everyone. Message ID:", messageId);
            } catch (error: any) {
                console.error("Error deleting for everyone:", error);
            }
        } else if (result.isDenied) {
            try {
                const response = await axios.patch(`http://localhost:8001/delete/message/me/${messageId}`, {}, {
                    withCredentials: true
                })
                if (response) {
                    console.log('delete ', response)
                    setMessages((prevMessages) =>
                        prevMessages.map((msg) =>
                            msg._id === messageId
                                ? { ...msg, deletedForSender: true }
                                : msg
                        )
                    );
                }
                console.log("Message deleted for me. Message ID:", messageId);
                // Add your logic to delete the message for the current user here
            } catch (error: any) {
                console.error("Error deleting for me:", error);
            }
        } else {
            console.log("Delete action canceled.");
        }
    };

    //reduce message count
    const handleCount = async (mentorId: string) => {
        try {
            const response = await axios.patch(`http://localhost:8001/reset/count/${mentorId}`, {}, {
                withCredentials: true
            })
            if (response) {
                console.log('count respo ', response)
                setMentors((prevMentors) =>
                    prevMentors.map((mentor) =>
                        mentor._id === mentorId ? { ...mentor, userMsgCount: 0 } : mentor
                    )
                );
            }
        } catch (error: any) {
            console.log(error)
        }
    }


    return (

        // <div className="flex justify-between items-start p-5 h-screen">
        //     {/* Left Section: Chat List */}
        //     <div className="w-1/3 max-h-[600px] overflow-y-auto pr-2">
        //         <h1 className="text-xl font-bold mb-5">Mentor Chat</h1>
        //         <ul>
        //             {mentors.slice(0, 6).map((mentor) => (
        //                 <li
        //                     key={mentor._id}
        //                     className="border border-gray-500 p-3 mb-5 rounded-lg flex items-center cursor-pointer justify-between"
        //                     onClick={() => createRoom(mentor)}
        //                 >
        //                     <div className="flex items-center">
        //                         <img
        //                             src={mentor?.profilePicUrl}
        //                             alt={`profile`}
        //                             className="w-12 h-12 rounded-full mr-3"
        //                         />
        //                         <div>
        //                             <p className="font-medium">{mentor.username}</p>
        //                             <p className="text-sm text-gray-600">
        //                                 Last Message: {mentor._id === selectedMentor?._id ? lastMessage || mentor.lastMessage : mentor.lastMessage}
        //                             </p>
        //                         </div>
        //                     </div>

        //                     {mentor._id !== selectedMentor?._id && mentor.userMsgCount > 0 && (
        //                         <span
        //                             className="ml-auto w-6 h-6 flex items-center justify-center border border-green-500 bg-green-500 text-white rounded-full"
        //                         >
        //                             {mentor?.userMsgCount}
        //                         </span>
        //                     )}
        //                 </li>
        //             ))}
        //         </ul>
        //         {mentors.length > 6 && (
        //             <p className="text-blue-500 cursor-pointer">Show more...</p>
        //         )}
        //     </div>

        //     {/* Right Section: Messages */}
        //     <div className="w-2/3 flex flex-col justify-between">
        //         <div
        //             ref={messagesContainerRef}
        //             className="flex-1 overflow-y-auto p-3"
        //             style={{ maxHeight: '70vh' }}>
        //             {/* Render messages continuously */}
        //             {messages && messages.map((data: MessageData, index: number) => {
        //                 const isMentorMessage = data.senderId === selectedMentor?._id;
        //                 return (
        //                     <div key={index} className={`flex mb-3 ${isMentorMessage ? "justify-start" : "justify-end"}`}>
        //                         <p
        //                             onClick={() => deleteMessage(data._id)}
        //                             className={`p-2 rounded-lg shadow-sm max-w-xs cursor-pointer ${isMentorMessage ? 'bg-blue-100 text-gray-800' : 'bg-green-100 text-gray-800'}`}
        //                         >
        //                             {data.message}
        //                         </p>
        //                     </div>
        //                 );
        //             })}
        //         </div>

        //         {/* Input Field and Send Button */}
        //         <div className="flex items-center p-2">
        //             <input
        //                 type="text"
        //                 value={inputData}
        //                 className="border border-gray-500 p-2 w-full rounded-lg"
        //                 onChange={(e) => setInputData(e.target.value)}
        //                 placeholder="Type your message..."
        //             />
        //             <button
        //                 type="submit"
        //                 className="border border-gray-500 bg-blue-500 text-white px-4 py-2 rounded-lg ml-2"
        //                 onClick={sendMessage}
        //             >
        //                 Send
        //             </button>
        //         </div>
        //     </div>
        // </div>

        <div className="flex justify-between items-start p-6 h-screen bg-gray-100">
            {/* Left Section: Mentor Chat List */}
            <div className="w-1/3 max-h-[600px] overflow-y-auto pr-4">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Mentor Chat</h1>
                <ul className="space-y-4">
                    {mentors.slice(0, 6).map((mentor) => (
                        <li
                            key={mentor._id}
                            className={`border border-gray-300 shadow-sm p-4 rounded-lg flex items-center justify-between cursor-pointer transition hover:shadow-md hover:bg-gray-50 ${selectedMentor?._id === mentor._id ? 'bg-gray-100 border-blue-500' : ''
                                }`}
                            onClick={() => createRoom(mentor)}
                        >
                            <div className="flex items-center">
                                <img
                                    src={mentor?.profilePicUrl}
                                    alt={`profile`}
                                    className="w-14 h-14 rounded-full mr-4 object-cover border border-gray-200"
                                />
                                <div>
                                    <p className="font-medium text-lg text-gray-700">{mentor.username}</p>
                                    
                                    <p className="text-sm text-gray-500">
                                        Last Message:{' '}
                                        {mentor._id === selectedMentor?._id ? lastMessage || mentor.lastMessage : mentor.lastMessage}
                                    </p>
                                </div>
                            </div>
                            {mentor._id !== selectedMentor?._id && mentor.userMsgCount > 0 && (
                                <span className="ml-auto w-6 h-6 flex items-center justify-center border border-green-500 bg-green-500 text-white rounded-full">
                                    {mentor?.userMsgCount}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
                {mentors.length > 6 && (
                    <p className="text-blue-600 mt-4 text-center cursor-pointer hover:underline">Show more...</p>
                )}
            </div>

            {/* Right Section: Messages */}
            {/* Right Section: Messages */}
            <div className="w-2/3 flex flex-col bg-white shadow-lg rounded-lg p-6">
                {/* Chat Header */}
                {selectedMentor && (
                    <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <img
                                src={selectedMentor.profilePicUrl}
                                alt={`profile`}
                                className="w-14 h-14 rounded-full mr-4 object-cover border border-gray-200"
                            />
                            <div>
                                <p className="text-lg font-bold text-gray-700">{selectedMentor.username}</p>
                                {/* <p className="text-sm text-gray-500">
                                    Status:{" "}
                                    <span
                                        className={`font-medium ${selectedMentor.isOnline ? 'text-green-500' : 'text-gray-400'}`}
                                    >
                                        {selectedMentor.isOnline ? 'Online' : 'Offline'}
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
                    className="flex-1 overflow-y-auto mb-4 space-y-3 p-4 bg-gray-50 rounded-lg scrollbar-hide"
                    style={{ maxHeight: '65vh' }}
                >
                    {messages &&
                        messages.map((data: MessageData, index: number) => {
                            const isMentorMessage = data.senderId === selectedMentor?._id;
                            return (
                                <div
                                    key={index}
                                    className={`flex ${isMentorMessage ? 'justify-start' : 'justify-end'}`}
                                >
                                    <p
                                        onClick={() => deleteMessage(data._id)}
                                        className={`p-3 rounded-lg shadow-sm max-w-xs cursor-pointer text-sm transition-transform hover:scale-105 ${isMentorMessage
                                            ? 'bg-blue-100 text-gray-700'
                                            : 'bg-green-100 text-gray-700'
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

export default StudentChat;


