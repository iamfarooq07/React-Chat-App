import React from "react";
import { Link } from "react-router";

function LandingPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-600 via-blue-400 to-blue-200 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 shadow-2xl">
        <h1 className="text-2xl font-extrabold tracking-wide">
          Chat<span className="text-yellow-400">App</span>
        </h1>
        <Link
          to="/chatapp"
          className="bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          Register
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mt-60 px-4">
        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Connect Instantly <br />
          <span className="text-yellow-400">Chat in Real-Time</span>
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-gray-200">
          A fast, secure and real-time chat application powered by Supabase.
          Sign in with Google and start chatting instantly.
        </p>

        <div className="flex gap-4 mt-8">
          <Link
            to="/chatapp"
            className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-300 transition"
          >
            Get Started
          </Link>
        </div>
      </section>
      <footer className="shadow-2xl absolute text-lg bottom-0 left-0 w-full text-center py-6 text-gray-200">
        © {new Date().getFullYear()} ChatApp — Built with Farooq Dev ❤️
      </footer>
    </div>
  );
}

export default LandingPage;
