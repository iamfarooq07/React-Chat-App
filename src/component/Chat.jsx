import { supabase } from "../config/supabase";
import { useEffect, useState, useRef } from "react";
import Signup from "./Signup";
import { useNavigate } from "react-router";

function Chat() {
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.log(error);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    supabase
      .from("messages")
      .select("*")
      .order("created_at")
      .then(({ data }) => setMessages(data));

    const channel = supabase
      .channel("chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("messages").insert({
      tittle: messageInput,
      avatar_url: session?.user?.user_metadata?.avatar_url,
      user_name:
        session?.user?.user_metadata?.full_name ||
        session?.user?.user_metadata?.name ||
        session?.user?.email?.split("@")[0],
      user_id: session?.user?.id,
    });

    if (error) console.log(error);

    setMessageInput("");
  };

  // console.log("message", messages);

  if (!session) {
    return <Signup signInWithGoogle={signInWithGoogle} />;
  }

  return (
    // <div className="w-full h-screen flex bg-gradient-to-r from-blue-200 to-purple-100 items-center justify-center">
    //   <div className="border border-gray-500 bg-black w-[50%] min-h-[600px]  my-10 rounded-lg">
    //     {/* header */}
    //     <div className="flex items-center justify-between mb-4 border-b border-gray-500 p-4">
    //       <div className="flex items-center gap-3">
    //         {session.user.user_metadata.avatar_url ? (
    //           <img
    //             src={session.user.user_metadata.avatar_url}
    //             alt="avatar"
    //             className="w-10 h-10 rounded-full object-cover"
    //           />
    //         ) : (
    //           <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
    //             {(session.user.user_metadata.full_name ||
    //               session.user.user_metadata.name ||
    //               session.user.email)[0].toUpperCase()}
    //           </div>
    //         )}

    //         <p className="font-semibold text-white">
    //           {session.user.user_metadata.full_name ||
    //             session.user.user_metadata.name ||
    //             "Guest"}
    //         </p>
    //       </div>

    //       <button
    //         className="text-black bg-blue-500 px-4 py-2 rounded-md"
    //         onClick={signOut}
    //       >
    //         Logout
    //       </button>
    //     </div>

    //     {/* main chat  */}
    //     <div className="flex flex-col overflow-y-auto h-[500px] p-4 gap-3">
    //       {messages.map((m) => (
    //         <div
    //           key={m.id}
    //           className={`flex items-end gap-3 ${
    //             m?.user_id !== session?.user?.id
    //               ? "justify-start"
    //               : "justify-end"
    //           }`}
    //         >
    //           {/* Avatar */}
    //           {/* <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
    //             {m.user_name ? m.use
    //             r_name[0].toUpperCase() : "U"}
    //           </div> */}
    //           {session.user.user_metadata.avatar_url ? (
    //             <img
    //               src={session.user.user_metadata.avatar_url}
    //               className="w-10 h-10 rounded-full"
    //             />
    //           ) : (
    //             <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
    //               {session.user.email[0].toUpperCase()}
    //             </div>
    //           )}

    //           {/* Message content */}
    //           <div className="bg-gray-300 p-2 rounded-lg flex flex-col">
    //             <div className="text-gray-800">{m.tittle}</div>
    //             <div className="text-xs text-gray-500 mt-1">
    //               {new Date(m.created_at).toLocaleTimeString([], {
    //                 hour: "2-digit",
    //                 minute: "2-digit",
    //               })}
    //             </div>
    //           </div>
    //         </div>
    //       ))}

    //       <div ref={messagesEndRef} className="h-10" />
    //     </div>

    //     {/* message input */}
    //     <form
    //       onSubmit={sendMessage}
    //       className="flex items-center gap-2 border-t border-gray-500 p-4"
    //     >
    //       <input
    //         value={messageInput}
    //         onChange={(e) => setMessageInput(e.target.value)}
    //         type="text"
    //         placeholder="Message"
    //         className="w-full bg-gray-800  text-white p-2 rounded-md"
    //       />
    //       <button
    //         type="submit"
    //         className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
    //       >
    //         Send
    //       </button>
    //     </form>
    //   </div>
    // </div>

    <div className="w-full h-screen flex bg-gradient-to-r from-blue-200 to-purple-100 items-center justify-center">
      {/* Chat Container */}
      <div className="w-full max-w-2xl h-[90vh] bg-black border border-gray-600 rounded-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-600 p-4">
          <div className="flex items-center gap-3">
            {session.user.user_metadata.avatar_url ? (
              <img
                src={session.user.user_metadata.avatar_url}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                {(session.user.user_metadata.full_name ||
                  session.user.user_metadata.name ||
                  session.user.email)[0].toUpperCase()}
              </div>
            )}

            <p className="font-semibold text-white">
              {session.user.user_metadata.full_name ||
                session.user.user_metadata.name ||
                "Guest"}
            </p>
          </div>

          <button
            onClick={signOut}
            className="bg-blue-500 text-black px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-end gap-3 ${
                m.user_id === session.user.id ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar */}
              {m.user_id !== session.user.id &&
                (session.user.user_metadata.avatar_url ? (
                  <img
                    src={session.user.user_metadata.avatar_url}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {session.user.email[0].toUpperCase()}
                  </div>
                ))}

              {/* Message Bubble */}
              <div
                className={`max-w-[70%] p-3 rounded-xl ${
                  m.user_id === session.user.id
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-300 text-black rounded-bl-none"
                }`}
              >
                <p>{m.tittle}</p>
                <span className="block text-xs mt-1 opacity-70">
                  {new Date(m.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={sendMessage}
          className="flex items-center gap-2 border-t border-gray-600 p-4"
        >
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 text-white p-2 rounded-md outline-none"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-5 py-2 rounded-md"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
