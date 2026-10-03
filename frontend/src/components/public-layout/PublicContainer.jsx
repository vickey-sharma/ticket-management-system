const PublicContainer = ({
  children,
  className = "",
  size = "default",
}) => {
  const sizeClasses = {
    default: "max-w-7xl",
    narrow: "max-w-4xl",
    form: "max-w-2xl",
    wide: "max-w-[1600px]",
  };

  return (
    <div
      className={`
        mx-auto w-full
        px-4 sm:px-6 lg:px-8
        ${sizeClasses[size] || sizeClasses.default}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default PublicContainer;