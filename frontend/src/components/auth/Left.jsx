import watchdogLogoTransparent from "../../assets/watchdogLogoTransparent.png";
import "./left.css";
import { Link } from "lucide-react";

export default function Left() {
  return (

  <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-[#f8faf8] via-[#eef7f0] to-[#dff3e3]">


{/* BOUNCE ANIMATION STARTS HERE */}
      <div
  className="w-72 h-72 rounded-full bg-gradient-to-tr from-white/30 to-white/10 backdrop-blur-xl shadow-2xl flex items-center justify-center
  animate-sphereDrop "
>

        <img
          src={watchdogLogoTransparent}
          alt="Logo"
          className="w-64 h-64 object-contain transition-all duration-300 
 hover:-translate-y-[20px]"
        />

      </div>

      {/* BOUNCE ANIMATION ENDS HERE */}






    </div>

  );
}

