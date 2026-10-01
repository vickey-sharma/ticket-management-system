
import { useState } from "react";
import toast from "react-hot-toast";

import StatusBadge from "../ui/StatusBadge";
import FilterDropdown from "../ui/FilterDropdown";
import InputField from "../ui/InputField";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";

import {
  updateRegisteredProductServiceHistory,
} from "../../services/registeredProductService";

export default function EditableServiceHistoryRow({
  history,
  index,
  vendors = [],
  onChange,
}) {
  const [saving, setSaving] = useState(false);

  const vendorOptions = [
    {
      label: "Select Vendor",
      value: "",
    },

    ...vendors.map((vendor) => ({
      label: vendor.fullName,
      value: vendor._id,
    })),
  ];

  const handleSave = async () => {
    if (!history._id) {
      toast.error("Invalid service history.");
      return;
    }

    if (!history.remark?.trim()) {
      toast.error("Remark is required.");
      return;
    }

    if (history.type === "replaced") {
      if (
        !history.fromSerialNumber?.trim() ||
        !history.toSerialNumber?.trim()
      ) {
        toast.error(
          "From and To serial numbers are required."
        );
        return;
      }

      if (
        history.fromSerialNumber.trim() ===
        history.toSerialNumber.trim()
      ) {
        toast.error(
          "From and To serial numbers cannot be the same."
        );
        return;
      }
    }

    if (!history.performedBy?._id) {
      toast.error("Please select a vendor.");
      return;
    }

    try {
      setSaving(true);

      const response =
        await updateRegisteredProductServiceHistory({
          serviceHistoryObjectId: history._id,
          fromSerialNumber:
            history.fromSerialNumber?.trim() || "",
          toSerialNumber:
            history.toSerialNumber?.trim() || "",
          remarks: history.remark.trim(),
          performedBy: history.performedBy._id,
        });

      toast.success(
        response.data.message ||
          "Service history updated successfully."
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to update service history."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    /*
     * Reloading the page data is the safest way to cancel
     * because the parent state contains the edited values.
     *
     * The row itself does not own the original saved state.
     */
    window.location.reload();
  };

  return (
    <tr
      className={`
        border-b border-slate-100
        transition-colors
        hover:bg-slate-100
        ${
          index % 2 === 0
            ? "bg-white"
            : "bg-slate-50"
        }
      `}
    >
      {/* Type */}
      <td className="px-5 py-2 whitespace-nowrap">
        <StatusBadge
          text={
            history.type === "repaired"
              ? "Repaired"
              : "Replaced"
          }
          color={
            history.type === "repaired"
              ? "blue"
              : "yellow"
          }
        />
      </td>

      {/* From Serial */}
      <td className="min-w-[180px] px-5 py-2">
        {history.type === "replaced" ? (
          <InputField
            value={history.fromSerialNumber || ""}
            onChange={(e) =>
              onChange(
                index,
                "fromSerialNumber",
                e.target.value
              )
            }
            disabled={saving}
          />
        ) : (
          "-"
        )}
      </td>

      {/* To Serial */}
      <td className="min-w-[180px] px-5 py-2">
        {history.type === "replaced" ? (
          <InputField
            value={history.toSerialNumber || ""}
            onChange={(e) =>
              onChange(
                index,
                "toSerialNumber",
                e.target.value
              )
            }
            disabled={saving}
          />
        ) : (
          "-"
        )}
      </td>

      {/* Vendor */}
      <td className="min-w-[220px] px-5 py-2">
        <FilterDropdown
          value={history.performedBy?._id || ""}
          onChange={(value) =>
            onChange(
              index,
              "performedBy",
              value
            )
          }
          options={vendorOptions}
          className="w-50"
          disabled={saving}
        />
      </td>

      {/* Created By */}
      <td className="whitespace-nowrap px-5 py-2">
        {history.createdBy ? (
          <>
            <div className="font-medium text-slate-800">
              {history.createdBy.fullName}
            </div>

            <div className="text-xs text-slate-500">
              {history.createdBy.email}
            </div>
          </>
        ) : (
          "-"
        )}
      </td>

      {/* Service Date */}
      <td className="whitespace-nowrap px-5 py-2 text-slate-600">
        {new Date(
          history.performedAt
        ).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>

      {/* Remark */}
      <td className="min-w-[250px] px-5 py-2">
        <InputField
          value={history.remark || ""}
          onChange={(e) =>
            onChange(
              index,
              "remark",
              e.target.value
            )
          }
          disabled={saving}
        />
      </td>

      {/* Actions */}
      <td className="whitespace-nowrap px-5 py-2">
        <div className="flex items-center gap-2">
          <SecondaryButton
            type="button"
            text="Cancel"
             className="px-2"
            onClick={handleCancel}
            disabled={saving}
          />

          <PrimaryButton
            type="button"
            className="px-2"
            text={saving ? "Saving..." : "Save"}
            onClick={handleSave}
            disabled={saving}
          />
        </div>
      </td>
    </tr>
  );
}

