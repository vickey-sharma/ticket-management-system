export default function TabButton({
  text,
  onClick,
  type = "button",
  className = ""
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-1/2 py-2 transition ${className}`}
    >
      {text}
    </button>
  );
}