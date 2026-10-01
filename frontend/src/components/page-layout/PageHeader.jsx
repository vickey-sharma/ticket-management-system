export default function PageHeader({
  title,
  description,
  children,
}) {
  return (
    <div className="flex items-center justify-between">

      <div>

        <h1 className="text-3xl font-semibold text-slate-800">
          {title}
        </h1>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}

      </div>

      {children}

    </div>
  );
}