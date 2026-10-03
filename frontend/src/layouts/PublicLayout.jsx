import PublicHeader from "./PublicHeader";
import PublicFooter from "./PublicFooter";

const PublicLayout = ({ children, user = null }) => {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F9F9]">
      <PublicHeader user={user} />

      <main className="flex-1">
        {children}
      </main>

      <PublicFooter />
    </div>
  );
};

export default PublicLayout;