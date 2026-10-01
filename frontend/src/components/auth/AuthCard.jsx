export default function AuthCard({ children, className="" }) {
  return (
    <div className={`w-full max-w-md px-6  ${className}`}>
      {children}
    </div>
  );
}