import Left from "../components/auth/Left";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2">
        <Left />
      </div>

      {/* RIGHT SIDE */}

<div className="w-full md:w-1/2 relative flex items-center justify-center h-screen overflow-hidden
bg-[radial-gradient(circle_at_top,rgba(74,171,39,0.08),transparent_60%),linear-gradient(to_bottom,#ffffff,#f6f8f7)]">



<div className="absolute w-[350px] h-[350px] bg-[#4AAB27]/10 blur-[120px] rounded-full top-20 right-10 " />

<div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />

<div className="relative z-10 w-full h-full flex items-center justify-center">
  <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-gray-100 shadow-xl rounded-2xl px-6 py-4">
    {children}
  </div>
</div>


      </div>
    </div>
  );
}