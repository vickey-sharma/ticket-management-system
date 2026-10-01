import { useState, useRef } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";

import { ChevronDown, Check } from "lucide-react";

export default function FilterDropdown({
  value,
  onChange,
  options,
    className = "",
}) {

  const [openUp, setOpenUp] = useState(false);
const buttonRef = useRef(null);

  const selected =
    options.find((option) => option.value === value) ||
    options[0];

  return (
    <Listbox
      value={value}
      onChange={onChange}
    >
      <div className={`relative inline-block ${className}`}>
{/* 
        <ListboxButton
          className="
            flex h-11 w-full items-center justify-between
            rounded-xl border border-slate-200 bg-white
            px-4 text-sm font-medium text-slate-700
            shadow-sm transition
            hover:border-slate-300 hover:shadow
            focus:border-[#56BD05]
            focus:ring-4
            focus:ring-[#56BD05]/15
          "
        > */}
      <ListboxButton
  ref={buttonRef}
  onClick={() => {
    const rect = buttonRef.current?.getBoundingClientRect();

    if (rect) {
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      setOpenUp(spaceBelow < 350 && spaceAbove > spaceBelow);
    }
  }}
  className="
    flex h-11 w-full items-center justify-between
    rounded-xl border border-slate-200 bg-white
    px-4 text-sm font-medium text-slate-700
    shadow-sm transition
    hover:border-slate-300 hover:shadow
    focus:border-[#56BD05]
    focus:ring-4
    focus:ring-[#56BD05]/15
  "
>
          {selected.label}

          <ChevronDown
            size={18}
            className="text-slate-400"
          />
        </ListboxButton>


<ListboxOptions
  className={`
    absolute
    left-0
    z-50
    w-full
    max-h-[350px]
    overflow-y-auto
    rounded-xl
    border border-slate-200
    bg-white
    p-1
    shadow-xl
    outline-none
    ${openUp ? "bottom-full mb-2" : "top-full mt-2"}
  `}
>
  {options.map((option) => (
    <ListboxOption
      key={option.value}
      value={option.value}
    >
      {({ focus }) => (
        <div
          className={`
            cursor-pointer
            rounded-lg
            px-3
            py-3
            text-sm
            transition
            ${
              focus
                ? "bg-[#56BD05]/10 text-[#56BD05]"
                : "text-slate-700"
            }
          `}
        >
          {option.label}
        </div>
      )}
    </ListboxOption>
  ))}
</ListboxOptions>

      </div>
    </Listbox>
  );
}