// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/app-layout/Sidebar";
// import Topbar from "../components/app-layout/Topbar";
// import { useAuth } from "../hooks/useAuth";

// export default function AppLayout() {

//   // const user = JSON.parse(localStorage.getItem("user"));
//    const { user, loading } = useAuth();

//   //  console.log(user);

//  if (loading) return <div>Loading...</div>;
 
//   if (!user) return null;

//   return (
//     <div className="flex bg-gray-100 min-h-screen">

//       <Sidebar role={user.role} />

//       <div className="flex-1 ml-72">

//         <Topbar user={user} />

//         <div className="px-8 pt-8">
//           <Outlet />
//         </div>

//       </div>

//     </div>
//   );
// }
















import { Outlet } from "react-router-dom";
import Sidebar from "../components/app-layout/Sidebar";
import Topbar from "../components/app-layout/Topbar";
import { useAuth } from "../hooks/useAuth";

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="h-screen bg-gray-100">

      <Sidebar role={user.role} />

      <div className="ml-72 flex h-screen flex-col">

        {/* Fixed Topbar */}
        <div className="fixed top-0 left-72 right-0 z-40">
          <Topbar user={user} />
        </div>

        {/* Scrollable Content */}
        <main className="mt-20 flex-1 overflow-auto px-8 py-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}