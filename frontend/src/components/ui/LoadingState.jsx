
import { Loader2 } from "lucide-react";

const LoadingState = ({
  message = "Loading...",
  fullScreen = false,
  className = "",
}) => {
  const content = (
    <div
      className={`
        flex flex-col items-center justify-center
        gap-3 text-center
        ${fullScreen ? "min-h-[60vh]" : "py-12"}
        ${className}
      `}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E5F4F1]">
        <Loader2
          size={22}
          className="animate-spin text-[#0F766E]"
        />
      </div>

      <p className="text-sm font-medium text-gray-500">
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F9F9]">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingState;
