import { supabase } from "../config/supabase";
import { useEffect, useState, useRef } from "react";
import Signup from "./Signup";
import { toast } from "react-toastify";

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

    if (data) {
      toast.success("Successfully signed in with Google", {
        autoClose: 1000,
      });
    }

    if (error) {
      toast.error("Google sign-in failed", {
        autoClose: 2000,
      });
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      toast.success("Successfully signed out", {
        autoClose: 1000,
      });
    }

    if (error) {
      console.log(error);
      toast.error("Sign out failed. Please try again.", {
        autoClose: 2000,
      });
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

  if (!session) {
    return <Signup signInWithGoogle={signInWithGoogle} />;
  }

  return (
    <div className="w-full h-screen flex bg-gradient-to-r from-blue-200 to-purple-100 items-center justify-center">
      <div className="w-full max-w-2xl h-[90vh] bg-black border border-gray-600 rounded-2xl flex flex-col">
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
