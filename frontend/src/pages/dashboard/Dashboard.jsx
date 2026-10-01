import AdminDashboard from "./admin/AdminDashboard";
import ClientDashboard from "./client/ClientDashboard";
import { useAuth } from "../../hooks/useAuth";

export default function Dashboard() {
  // const user = JSON.parse(localStorage.getItem("user"));

  //  console.log(user);
  // if (!user) {
  //   return <h1>Loading...</h1>;
  // }

  const { user, loading: authLoading } = useAuth();
  
  if (authLoading) {
    return <div>Loading...</div>;
  }
  
  


  return (
    <>
      {user.role === "client" ? (
        <ClientDashboard user={user} />
      ) : (
        <AdminDashboard user={user} />
      )}
    </>

  );
}