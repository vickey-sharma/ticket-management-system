export default function AuthCard({ children, className = "" }) {
  return (
    <div
      className={`
        w-full
        rounded-[28px]
        border border-gray-200/80
        bg-white
        px-6 py-7
        shadow-[0_20px_60px_-20px_rgba(7,59,58,0.12)]
        sm:px-8 sm:py-9
        ${className}
      `}
    >
      {children}
    </div>
  );
}