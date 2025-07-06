import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="h-[calc(100vh-68px)] overflow-y-auto scrollbar-thin max-w-full mx-auto sm:px-20 px-4 py-10 flex flex-col gap-10">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-bold text-green-700">Contact Us</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Got questions or feedback? We're always here to help. Drop us a message or get in touch directly.
        </p>
        <p className="text-sm text-green-500 font-semibold italic">"From Report to Resolved"</p>
      </header>

      {/* Grid Layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left: Contact Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 py-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Reach Us At</h2>
            <div className="flex items-start gap-3">
              <MapPin className="text-green-600 mt-1" />
              <p className="text-gray-700">
                8 Akshar apartment, Vaniyavad Circle, Nadiad, Kheda - 387001
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-green-600" />
              <p className="text-gray-700">+91 8200764117</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-green-600" />
              <p className="text-gray-700">ecotrack.team.india@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Send a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-green-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-green-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                rows={4}
                placeholder="Your message here..."
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-green-500 focus:outline-none resize-none"
                required
              ></textarea>
            </div>
            <div className="text-right">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md transition"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
