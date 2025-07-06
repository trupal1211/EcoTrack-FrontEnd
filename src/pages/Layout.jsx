import { Outlet , useLocation} from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout() {
  
  const location = useLocation()
  const noNavbarRoutes = ['/login', '/register','/forgot-password','/reset-password','/ngo-registration']; 

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!noNavbarRoutes.includes(location.pathname) && location.pathname !== '*' && <Navbar />}

      <main className="flex-1 w-full max-w-screen-xl mx-auto overflow-y-hidden">
        <Outlet />
      </main>
    </div>
  );
}
