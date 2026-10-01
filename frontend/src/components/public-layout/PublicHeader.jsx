import { Link } from "react-router-dom";
import watchdogLogoTransparent from "../../assets/watchdogLogoTransparent.png"
import PrimaryButton from "../ui/PrimaryButton";

export default function PublicHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
{/* 
        <Link
          to="/"
          className="text-xl font-bold text-slate-900"
        >
          CRM Helpdesk
        </Link> */}
        {/* <div className="">
                 <img
                          src={watchdogLogoTransparent}
                          alt="Logo"
                          className="w-35 h-19.5 object-contain transition-all duration-300 
                 hover:-translate-y-[20px]"
                        />
                        </div> */}

                        <Link to="/" className="inline-block">
  <img
    src={watchdogLogoTransparent}
    alt="CRM Helpdesk Logo"
    className="h-19.5 w-35 object-contain transition-all duration-300 hover:-translate-y-[10px]"
  />
</Link>


        <Link to="/auth/login-activate">
          <PrimaryButton
            text="Login"
            type="button"
            px-4
          />
        </Link>

      </div>
    </header>
  );
}