import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Home, Layers, Languages, Info, Phone, ChevronDown, User, Menu } from "lucide-react";

const navItems = [
  { name: "Home", icon: Home, dropdown: [] },
  { name: "Features", icon: Layers, dropdown: ["Voice Assistant", "Chatbot", "Translation", "AI Tools"] },
  { name: "Languages", icon: Languages, dropdown: ["Hindi", "English", "Tamil", "Bengali", "Gujarati"] },
  { name: "About", icon: Info, dropdown: ["Mission", "Team", "FAQ"] },
  { name: "Contact", icon: Phone, dropdown: ["Email", "Phone"] }
];

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useContext(AuthContext); 
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    function close(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#060818]/90 backdrop-blur-md border-b border-white/5 py-4 px-8 flex items-center justify-between shadow-2xl z-50 transition-all duration-300">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img
          src="/cropped_circle_image.png"
          alt="BolSaathi"
          className="h-12 w-12 rounded-full"
        />
        <h1 className="text-white text-2xl font-bold">BolSaathi</h1>
      </div>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-10" ref={menuRef}>
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <li
              key={index}
              className="relative group font-medium text-white cursor-pointer"
              onMouseEnter={() => setOpenMenu(index)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <div className="flex items-center gap-2 transition-all duration-300">
                <Icon className="opacity-90 group-hover:translate-x-1 transition" size={20} />
                <span>{item.name}</span>
              </div>

              {/* Desktop Dropdown */}
              {item.dropdown.length > 0 && openMenu === index && (
                <div className="absolute top-10 left-0 bg-[#0f1535] shadow-xl rounded-md py-2 w-44 border border-white/10">
                  {item.dropdown.map((drop, i) => (
                    <p
                      key={i}
                      className="px-4 py-2 text-gray-200 hover:bg-white/10 hover:text-white transition cursor-pointer"
                    >
                      {drop}
                    </p>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Right Side Button / User */}
      {!isAuthenticated ? (
        <button
          onClick={() => navigate("/login")}
          className="hidden md:block bg-gradient-to-r from-blue-400 to-purple-500 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition"
        >
          Get Started
        </button>
      ) : (
        <div className="relative hidden md:block" ref={menuRef}>
          <div
            className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full cursor-pointer hover:bg-white/20 transition"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <User size={20} className="text-white" />
            <span className="text-white">{user?.name || "User"}</span>
          </div>

          {userMenuOpen && (
            <div className="absolute right-0 mt-3 bg-[#0a0f2a] w-44 rounded-md border border-white/10 shadow-lg py-2 z-[60]">
              <p
                className="px-4 py-2 text-gray-200 hover:bg-white/10 cursor-pointer"
                onClick={() => {
                    navigate("/profile");
                    setUserMenuOpen(false);
                }}
              >
                Profile
              </p>
              <p
                className="px-4 py-2 text-gray-200 hover:bg-white/10 cursor-pointer"
                onClick={() => {
                    navigate("/settings");
                    setUserMenuOpen(false);
                }}
              >
                Settings
              </p>
              <p
                className="px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white cursor-pointer"
                onClick={() => {
                   logout();
                   navigate("/login");
                   setUserMenuOpen(false);
                }}
              >
                Logout
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Menu
          size={28}
          className="text-white cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#060818] py-5 md:hidden border-t border-white/10">
          {navItems.map((item, index) => (
            <div key={index} className="px-6 py-3 text-gray-300">
              <div
                className="flex justify-between items-center"
                onClick={() =>
                  setOpenMenu(openMenu === index ? null : index)
                }
              >
                <span>{item.name}</span>

                {/* Only mobile arrow */}
                {item.dropdown.length > 0 && (
                  <ChevronDown
                    className={`transition-transform ${
                      openMenu === index ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>

              {item.dropdown.length > 0 && openMenu === index && (
                <div className="pl-4 mt-2">
                  {item.dropdown.map((d, i) => (
                    <p key={i} className="py-2 text-gray-400">
                      {d}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Mobile Get Started */}
          {!isAuthenticated && (
            <button
              onClick={() => navigate("/login")}
              className="mt-4 ml-6 bg-gradient-to-r from-blue-400 to-purple-500 text-white px-6 py-2 rounded-full font-semibold"
            >
              Get Started
            </button>
          )}

          {/* Mobile User */}
          {isAuthenticated && (
            <div className="mt-4 ml-6">
              <p className="text-gray-300 py-2 cursor-pointer" onClick={() => navigate("/profile")}>
                Profile
              </p>
              <p className="text-gray-300 py-2 cursor-pointer" onClick={() => navigate("/settings")}>
                Settings
              </p>
              <p className=" mt-4 bg-gradient-to-r from-blue-400 to-purple-500 text-white px-2 py-2 rounded-full font-semibold" onClick={() => {
                  logout();
                  navigate("/login");
              }}>
                Logout
              </p>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
