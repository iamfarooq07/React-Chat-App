// import React, { useEffect, useState } from "react";
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
// );

// function App() {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);

//   // Fetch messages
//   const getFetch = async () => {
//     const { data, error } = await supabase
//       .from("realtime")
//       .select("*")
//       .order("id", { ascending: true });

//     if (error) {
//       console.log(error);
//     } else {
//       setMessages(data);
//     }
//   };

//   // Insert message
//   const insertData = async () => {
//     if (!message.trim()) return;

//     const { error } = await supabase
//       .from("realtime")
//       .insert({ tittle: message });

//     if (error) {
//       console.log(error);
//     } else {
//       setMessage("");
//       getFetch();
//     }
//   };

//   useEffect(() => {
//     getFetch();
//   }, []);

//   return (
//     <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
//       <div className="w-full max-w-md h-full md:h-[90%] bg-white shadow-lg flex flex-col">
//         <div className="flex justify-between items-center p-4 bg-blue-500 text-white text-lg font-bold">
//           <p>User : Muhammad Farooq</p>
//           <p>Chat App</p>
//         </div>

//         <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-100">
//           {messages.map((msg, index) => (
//             <div key={index} className="flex justify-start">
//               <div className="bg-white px-4 py-2 rounded-lg shadow text-sm max-w-[75%]">
//                 {msg.tittle}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="p-3 border-t flex gap-2">
//           <input
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             type="text"
//             placeholder="Type a message..."
//             className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <button
//             onClick={insertData}
//             className="bg-blue-600 text-white px-5 rounded-full hover:bg-blue-700"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

// ===============================================================================

// import React, { useEffect, useState } from "react";
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
// );

// function App() {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [user, setUser] = useState(null);

//   // 🔐 Google Login
//   const loginWithGoogle = async () => {
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: "google",
//     });

//     if (error) console.log(error.message);
//   };

//   const logout = async () => {
//     await supabase.auth.signOut();
//   };

//   const getFetch = async () => {
//     const { data, error } = await supabase
//       .from("messages")
//       .select("*")
//       .order("id", { ascending: true });

//     if (!error) setMessages(data);
//   };

//   const insertData = async () => {
//     if (!message.trim() || !user) return;

//     const { error } = await supabase.from("messages").insert({
//       tittle: message,
//       // user_id: user.id,
//       // user_email: user.email,
//     });

//     if (!error) {
//       setMessage("");
//       getFetch();
//     }
//   };

//   useEffect(() => {
//     supabase.auth.getUser().then(({ data }) => {
//       setUser(data?.user ?? null);
//     });

//     const { data: listener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setUser(session?.user ?? null);
//       }
//     );

//     getFetch();

//     return () => {
//       listener.subscription.unsubscribe();
//     };
//   }, []);

//   return (
//     <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
//       <div className="w-full max-w-md h-full md:h-[90%] bg-white shadow-lg flex flex-col">
//         {/* Header */}
//         <div className="flex justify-between items-center p-4 bg-blue-500 text-white text-sm font-bold">
//           {user ? (
//             <>
//               <p>{user.email}</p>
//               <button onClick={logout} className="underline">
//                 Logout
//               </button>
//             </>
//           ) : (
//             <button
//               onClick={loginWithGoogle}
//               className="bg-white text-blue-600 px-3 py-1 rounded"
//             >
//               Login with Google
//             </button>
//           )}
//         </div>

//         {/* Messages */}
//         <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-100">
//           {messages.map((msg, index) => (
//             <div key={index} className="flex justify-start">
//               <div className="bg-white px-4 py-2 rounded-lg shadow text-sm max-w-[75%]">
//                 <p>{msg.tittle}</p>
//                 <small className="text-gray-400">{msg.user_email}</small>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Input */}
//         {user && (
//           <div className="p-3 border-t flex gap-2">
//             <input
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               type="text"
//               placeholder="Type a message..."
//               className="flex-1 border rounded-full px-4 py-2 outline-none"
//             />
//             <button
//               onClick={insertData}
//               className="bg-blue-600 text-white px-5 rounded-full"
//             >
//               Send
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;
