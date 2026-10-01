import PrimaryButton from "../ui/PrimaryButton";
import InputField from "../ui/InputField";

export default function WarrantySearchForm({
  serialNumber,
  onChange,
  onSubmit,
  loading = false,
}) {
         
   const handleSubmit = (e) => {
     e.preventDefault();
     onSubmit();
};

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >

      <h2 className="text-lg font-semibold text-slate-800">
        Search Product
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Enter the product serial number to verify its warranty.
      </p>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end">
  <div className="flex-1">
    <InputField
      label="Serial Number"
      name="serialNumber"
      value={serialNumber}
      onChange={onChange}
      placeholder="Enter serial number"
    />
  </div>

  <div className="pb-2.5">
    <PrimaryButton
      type="submit"
      text={loading ? "Checking..." : "Verify Warranty"}
      disabled={loading}
    />
  </div>
</div>

    </form>
  );
}

// export default function WarrantySearchForm({
//   serialNumber,
//   onChange,
//   onSubmit,
//   loading = false,
// }) {
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit();
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {/* Input + Button */}
//     </form>
//   );
// }