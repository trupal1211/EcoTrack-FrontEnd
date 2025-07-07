import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Menu, X, User, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { label: "Reports", path: "/", roles: ["user", "ngo", "admin"] },
    { label: "My Activities", path: "/my-activities", roles: ["user", "ngo", "admin"] },
    { label: "NGO Dashboard", path: "/ngo-dashboard", roles: ["ngo", "admin"] },
    { label: "Admin Panel", path: "/admin-panel", roles: ["admin"] },
    { label: "About Us", path: "/about", roles: ["user", "ngo", "admin"] },
    { label: "Contect Us", path: "/contect", roles: ["user", "ngo", "admin"] },


  ];

  const toggleMenu = () => user && setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeAllMenus = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <>
      <nav className="bg-white h-[68px] shadow-md px-4 py-2 flex justify-between items-center md:px-10 relative z-50">
        {/* LEFT: Hamburger (only if logged in) */}
        <div className="flex items-center gap-2">
          {user && (
            <button onClick={toggleMenu} className="md:hidden">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}

          {/* EcoTrack Logo */}
          <Link
            to="/"
            className={`font-bold text-green-600 tracking-wide text-xl sm:text-2xl ${user ? "absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0" : ""
              }`}
          >
            EcoTrack
          </Link>
        </div>

        {/* CENTER: Nav Items (desktop only) */}
        <div className="hidden md:flex gap-8 ml-6">
          {navItems.map(
            (item) =>
              (!item.roles || item.roles.includes(user?.role)) && (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative text-[15px] font-medium ${isActive
                      ? "text-green-600 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-green-600 after:rounded-full"
                      : "text-gray-700 hover:text-green-600"
                    }`
                  }
                  onClick={closeAllMenus}
                >
                  {item.label}
                </NavLink>
              )
          )}
        </div>

        {/* RIGHT: Profile or Auth Buttons */}
        <div className="relative group">
          {user ? (
            <div
              className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md hover:bg-gray-100"
              onClick={() => {
                if (window.innerWidth < 768) {
                  navigate("/profile"); // 👉 Only on mobile
                } else {
                  toggleDropdown(); // 👉 Desktop toggles dropdown
                }
              }}
            >
              <img
                src={user.photo || `https://ui-avatars.com/api/?name=${user.name}`}
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover border"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.city || "Unknown"}</p>
              </div>
            </div>
          ) : (
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => navigate("/ngo-registration")}
                className="text-[13px] px-3 py-1.5 rounded-md border border-green-600 text-green-600 hover:bg-green-50"
              >
                NGO Registration
              </button>
              <button
                onClick={() => navigate("/register")}
                className="text-[13px] px-3 py-1.5 rounded-md border border-green-600 text-green-600 hover:bg-green-50"
              >
                Register
              </button>
              <button
                onClick={() => navigate("/login")}
                className="text-[13px] px-3 py-1.5 rounded-md bg-green-700 text-white hover:bg-green-800"
              >
                Login
              </button>
            </div>
          )}

          {/* Desktop Dropdown */}
          {dropdownOpen && user && (
            <div className="hidden md:flex flex-col absolute right-0 mt-4 w-44 bg-white shadow-lg rounded-md py-2 z-40">
              <Link
                to="/profile"
                className="px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 flex gap-2 items-center"
                onClick={closeAllMenus}
              >
                👤 Profile
              </Link>
              <Link
                to="/ngo-registration"
                className="px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 flex gap-2 items-center"
                onClick={closeAllMenus}
              >
                🏢 NGO Registration
              </Link>
              <button
                onClick={() => {
                  logout();
                  closeAllMenus();
                }}
                className="px-4 py-2 hover:bg-gray-100 text-sm text-red-500 flex gap-2 items-center"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* MOBILE Sidebar (when logged in) */}
      {menuOpen && user && (
        <div className="md:hidden fixed top-[68px] left-0 w-50 h-[calc(100vh-68px)] bg-white shadow-lg z-40 flex flex-col justify-between p-5 pb-8">
          <div className="space-y-5">
            {navItems.map(
              (item) =>
                (!item.roles || item.roles.includes(user?.role)) && (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `block text-sm font-medium ${isActive ? "text-green-600 font-semibold" : "text-gray-700 hover:text-green-600"
                      }`
                    }
                    onClick={closeAllMenus}
                  >
                    {item.label}
                  </NavLink>
                )
            )}
          </div>

          <div className="border-t pt-5 space-y-3 text-sm">
            <Link
              to="/profile"
              className="flex items-center gap-2 text-gray-700 hover:text-green-600"
              onClick={closeAllMenus}
            >
              👤 Profile
            </Link>
            <Link
              to="/ngo-registration"
              className="flex items-center gap-2 text-gray-700 hover:text-green-600"
              onClick={closeAllMenus}
            >
              🏢 NGO Registration
            </Link>
            <button
              onClick={() => {
                logout();
                closeAllMenus();
              }}
              className="flex items-center gap-2 text-red-500 hover:text-red-700"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
