export default function PageCard({ children, className = ""  }) {
  return (
    <div className={`rounded-2xl bg-white border border-slate-200 shadow-sm p-6  ${className}`}>
      {children}
    </div>
  );
}