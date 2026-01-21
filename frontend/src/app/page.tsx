"use client";

import { useState, FormEvent, ChangeEvent } from "react";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);

  const handleChatSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, chatInput]);
    setChatInput("");
  };

  return (
    <div className="text-black-900 font-sans bg-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-white shadow-md ">
        <div className="text-2xl font-bold text-blue-600">JobPortal</div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#contact" className="hover:text-blue-600">Contact</a>
          {/* Employee Authentication */}
          <div className="flex space-x-2">
            <a href="/employee/register" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Employee Sign Up</a>
            <a href="/employee/login" className="px-4 py-2 border border-green-600 rounded hover:bg-green-50">Employee Login</a>
          </div>
          {/* User Authentication */}
          <div className="flex space-x-2">
            <a href="/user/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">User Sign Up</a>
            <a href="/user/login" className="px-4 py-2 border border-blue-600 rounded hover:bg-blue-50">User Login</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gray-100 py-24 text-center">
        {/* Add text-slate-900 or text-black directly here */}
        <h1 className="text-5xl font-bold mb-4 text-slate-900">Find Your Dream Job</h1>
        <p className="text-xl mb-8 text-slate-700">Connect with top employers and take your career to the next level.</p>
        <a href="/user/available-jobs" className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Search Jobs</a>
      </section>

      {[
        { count: "500+", label: "Jobs Posted" },
        { count: "2000+", label: "Applicants" },
        { count: "100+", label: "Companies" },
      ].map((item, idx) => (
        <div key={idx} className="p-6 border rounded-lg w-64 bg-white shadow-sm">
          {/* Added text-blue-700 and text-gray-600 */}
          <h3 className="text-4xl font-bold mb-2 text-blue-700">{item.count}</h3>
          <p className="text-gray-600 font-medium">{item.label}</p>
        </div>
      ))}

      {/* Contact Form */}
      <section id="contact" className="py-20 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
        <form className="max-w-md mx-auto flex flex-col gap-4">
          <input type="text" name="name" placeholder="Your Name" className="p-3 border rounded" />
          <input type="email" name="email" placeholder="Your Email" className="p-3 border rounded" />
          <textarea name="message" placeholder="Message" className="p-3 border rounded" />
          <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Send Message</button>
        </form>
      </section>

      {/* Chatbot Widget */}
      {chatOpen && (
        <div className="fixed bottom-20 right-5 w-80 h-96 bg-white border shadow-lg p-4 rounded-lg flex flex-col">
          <h3 className="font-bold mb-2">AI Assistant</h3>
          <div className="flex-1 overflow-y-auto mb-2 border rounded p-2">
            {chatMessages.map((msg, idx) => (
              <p key={idx} className="mb-1">{msg}</p>
            ))}
          </div>
          <form onSubmit={handleChatSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={chatInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setChatInput(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button type="submit" className="px-3 bg-blue-600 text-white rounded hover:bg-blue-700">Send</button>
          </form>
        </div>
      )}

      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
      >
        Chat
      </button>
    </div>
  );
}
