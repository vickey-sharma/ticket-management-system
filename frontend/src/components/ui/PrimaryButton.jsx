export default function PrimaryButton({ text, loading, onClick, type="button", className=""}) {
  return (
    <button
    type={type}
      onClick={onClick}
      disabled={loading}
      className={`w-full bg-[#56BD05] text-white py-2 px-5 rounded-lg mt-0 disabled:opacity-50 transition-all duration-300 hover:brightness-[1.08] hover:-translate-y-[2px] ${className}`}
    >
      {loading ? "Loading..." : text}
    </button>
  );
}



// bg-green-600