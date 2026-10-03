import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PageHeader = ({
  title,
  description,
  action,
  showBackButton = false,
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <div className="flex items-start gap-3">
        {showBackButton && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {title}
          </h1>

          {description && (
            <p className="mt-1 text-sm leading-6 text-gray-500">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Right */}
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default PageHeader;

