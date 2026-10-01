// export default function InputField({
//   label,
//     name,
//   type = "text",
//   value,
//   onChange,
//   placeholder,
//    disabled = false,
//   readOnly = false,
//   className = "",
// }) {
//   return (
//     <div className="mb-2">
//       {label && (
//          <label className="block text-sm mb-1  text-light ">
          
//           {label}
//         </label>
//       )}

//       <input
//         name={name}
//         type={type}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//          disabled={disabled}
//         readOnly={readOnly}
//         className={`w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-[1px] focus:ring-green-500 ${className}`}
        
//       />
//     </div>
//   );
// }


//PASSWORD - HIDE/UNHIDE FEATURE
export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  readOnly = false,
  className = "",
  rightElement,
}) {
  return (
    <div className="mb-2">
      {label && (
        <label className="block text-sm mb-1 text-light">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={`w-full border border-gray-200 rounded-lg px-4 py-2 ${
            rightElement ? "pr-10" : ""
          } outline-none focus:ring-[1px] focus:ring-green-500 ${className}`}
        />

        {rightElement && (
         <div className="absolute right-3 top-1/2 -translate-y-1/2 mt-1">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}