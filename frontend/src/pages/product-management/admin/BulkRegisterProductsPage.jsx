import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Upload,
  FileSpreadsheet,
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

import PageHeader from "../../../components/page-layout/PageHeader";
import PageCard from "../../../components/auth/PageCard";

import PrimaryButton from "../../../components/ui/PrimaryButton";
import SecondaryButton from "../../../components/ui/SecondaryButton";
import LoadingState from "../../../components/ui/LoadingState";

import {
  bulkUploadRegisteredProducts,
  downloadRegisteredProductTemplate,
} from "../../../services/registeredProductService";

export default function BulkRegisterProductsPage() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] =
    useState(false);

  const [uploadResult, setUploadResult] = useState(null);

  // ---------------------------------------------------
  // File Validation
  // ---------------------------------------------------

  const validateFile = (file) => {
    if (!file) {
      return "Please select an Excel file.";
    }

    const fileName = file.name.toLowerCase();

    const isExcelFile =
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls");

    if (!isExcelFile) {
      return "Only .xlsx or .xls files are allowed.";
    }

    // 10 MB limit
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      return "File size must be less than 10 MB.";
    }

    return null;
  };

  // ---------------------------------------------------
  // File Selection
  // ---------------------------------------------------

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError = validateFile(file);

    if (validationError) {
      toast.error(validationError);

      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setUploadResult(null);
  };

  // ---------------------------------------------------
  // Browse
  // ---------------------------------------------------

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  // ---------------------------------------------------
  // Remove File
  // ---------------------------------------------------

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ---------------------------------------------------
  // Download Template
  // ---------------------------------------------------

 const handleDownloadTemplate = async () => {
    try {
        const response = await downloadRegisteredProductTemplate();

        const url = window.URL.createObjectURL(response.data);

        const link = document.createElement("a");

        link.href = url;
        link.download = "registered-products-template.xlsx";

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error(
            "Failed to download registered product template:",
            error
        );
    }
};

  // ---------------------------------------------------
  // Upload
  // ---------------------------------------------------

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an Excel file first.");
      return;
    }

    const validationError =
      validateFile(selectedFile);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setUploading(true);
      setUploadResult(null);

      const response =
        await bulkUploadRegisteredProducts(
          selectedFile
        );

      console.log(
        "BULK UPLOAD RESPONSE:",
        response.data
      );

      const result =
        response.data?.data || response.data;

      setUploadResult(result);

      toast.success(
        response.data?.message ||
          "Bulk upload completed successfully."
      );

    } catch (error) {
      console.error(
        "BULK UPLOAD ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to upload Excel file."
      );
    } finally {
      setUploading(false);
    }
  };

  // ---------------------------------------------------
  // Format File Size
  // ---------------------------------------------------

  const formatFileSize = (bytes) => {
    if (!bytes) {
      return "0 KB";
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // ---------------------------------------------------
  // Upload Another File
  // ---------------------------------------------------

  const handleUploadAnother = () => {
    setSelectedFile(null);
    setUploadResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ---------------------------------------------------
  // Loading
  // ---------------------------------------------------

  if (uploading) {
    return (
      <>
        <PageHeader
          title="Bulk Upload Registered Products"
          description="Upload multiple registered products using an Excel file."
        />

        <div className="mt-6">
          <LoadingState variant="card" />

          <div className="mt-4 text-center">
            <p className="text-sm text-slate-500">
              Processing Excel file. Please wait...
            </p>
          </div>
        </div>
      </>
    );
  }

  // ---------------------------------------------------
  // UI
  // ---------------------------------------------------

  return (
    <>
      <PageHeader
        title="Bulk Upload Registered Products"
        description="Register multiple products at once using an Excel file."
      >
        <SecondaryButton
          text="Back to Registered Products"
          onClick={() => navigate("/admin/dashboard/registered-products")}
          className="w-auto px-5"
        />
      </PageHeader>

      {/* ------------------------------------------------ */}
      {/* Template + Upload */}
      {/* ------------------------------------------------ */}

      <PageCard className="mt-6">
        <div className="space-y-8">

          {/* Template Section */}

          <div>
            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#56BD05]/10">
                <FileSpreadsheet
                  size={22}
                  className="text-[#56BD05]"
                />
              </div>

              <div className="flex-1">

                <h2 className="text-lg font-semibold text-slate-800">
                  Excel Template
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Download the Excel template and fill
                  in the registered product details
                  before uploading.
                </p>

              </div>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                disabled={downloadingTemplate}
                className="
                  flex items-center gap-2
                  rounded-lg
                  border border-slate-200
                  bg-white
                  px-4 py-2
                  text-sm font-medium
                  text-slate-700
                  shadow-sm
                  transition
                  hover:bg-slate-50
                  hover:border-slate-300
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <Download size={17} />

                {downloadingTemplate
                  ? "Downloading..."
                  : "Download Template"}
              </button>

            </div>

            {/* Required Columns */}

            <div className="mt-5 rounded-xl bg-slate-50 p-4">

              <p className="text-sm font-medium text-slate-700">
                Required Excel columns
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                {[
                  "Sr. No.",
                  "Bill Number",
                  "Bill Date",
                  "Bill Company Name",
                  "End Company Name",
                  "Product Name",
                  "Model Number",
                  "Serial Number",
                  "Warranty End Date",
                ].map((column) => (
                  <span
                    key={column}
                    className="
                      rounded-lg
                      border border-slate-200
                      bg-white
                      px-3 py-1.5
                      text-xs
                      text-slate-600
                    "
                  >
                    {column}
                  </span>
                ))}

              </div>

            </div>
          </div>

          {/* Divider */}

          <div className="border-t border-slate-200" />

          {/* Upload Section */}

          <div>

            <h2 className="text-lg font-semibold text-slate-800">
              Upload Excel File
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select the completed Excel file to
              register multiple products.
            </p>

            {/* Hidden Input */}

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Upload Box */}

            {!selectedFile && (
              <button
                type="button"
                onClick={handleBrowse}
                className="
                  mt-5
                  flex
                  min-h-[220px]
                  w-full
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border-2
                  border-dashed
                  border-slate-300
                  bg-slate-50
                  px-6
                  text-center
                  transition
                  hover:border-[#56BD05]
                  hover:bg-[#56BD05]/5
                "
              >

                <div className="
                  flex h-14 w-14
                  items-center justify-center
                  rounded-full
                  bg-white
                  shadow-sm
                  border border-slate-200
                ">
                  <Upload
                    size={24}
                    className="text-[#56BD05]"
                  />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-700">
                  Choose an Excel file
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Click here to browse your files
                </p>

                <p className="mt-3 text-xs text-slate-400">
                  Supported formats: .xlsx, .xls
                  &nbsp; • &nbsp; Maximum size: 10 MB
                </p>

              </button>
            )}

            {/* Selected File */}

            {selectedFile && (
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">

                <div className="flex items-center gap-4">

                  <div className="
                    flex h-12 w-12
                    shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-[#56BD05]/10
                  ">
                    <FileSpreadsheet
                      size={24}
                      className="text-[#56BD05]"
                    />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="
                      truncate
                      text-sm
                      font-semibold
                      text-slate-800
                    ">
                      {selectedFile.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatFileSize(
                        selectedFile.size
                      )}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="
                      flex h-9 w-9
                      items-center justify-center
                      rounded-lg
                      text-slate-400
                      transition
                      hover:bg-slate-200
                      hover:text-slate-700
                    "
                    title="Remove file"
                  >
                    <X size={18} />
                  </button>

                </div>

              </div>
            )}

          </div>

          {/* Buttons */}

          <div className="
            flex
            justify-end
            gap-3
            border-t
            border-slate-200
            pt-6
          ">

            <SecondaryButton
              text="Cancel"
              type="button"
              onClick={() => navigate(-1)}
              className="w-auto px-6"
            />

            <PrimaryButton
              type="button"
              text="Upload Products"
              loading={uploading}
              onClick={handleUpload}
              className="w-auto px-6"
            />

          </div>

        </div>
      </PageCard>

      {/* ------------------------------------------------ */}
      {/* Upload Result */}
      {/* ------------------------------------------------ */}

      {uploadResult && (
        <PageCard className="mt-6">

          <div className="flex items-start gap-4">

            <div className="
              flex h-11 w-11
              shrink-0
              items-center justify-center
              rounded-xl
              bg-[#56BD05]/10
            ">
              <CheckCircle2
                size={22}
                className="text-[#56BD05]"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Upload Result
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                The Excel file has been processed.
              </p>
            </div>

          </div>

          {/* Statistics */}

          <div className="
            mt-6
            grid
            grid-cols-1
            gap-4
            md:grid-cols-3
          ">

            <div className="
              rounded-xl
              border border-slate-200
              bg-slate-50
              p-5
            ">
              <p className="text-sm text-slate-500">
                Total Rows
              </p>

              <p className="mt-2 text-2xl font-semibold text-slate-800">
                {uploadResult.totalRows ?? 0}
              </p>
            </div>

            <div className="
              rounded-xl
              border border-green-200
              bg-green-50
              p-5
            ">
              <p className="text-sm text-green-700">
                Successfully Registered
              </p>

              <p className="mt-2 text-2xl font-semibold text-green-700">
                {uploadResult.insertedRows ?? 0}
              </p>
            </div>

            <div className="
              rounded-xl
              border border-red-200
              bg-red-50
              p-5
            ">
              <p className="text-sm text-red-700">
                Failed Rows
              </p>

              <p className="mt-2 text-2xl font-semibold text-red-700">
                {uploadResult.failedRows ?? 0}
              </p>
            </div>

          </div>

          {/* Failed Data */}

          {uploadResult.failedData?.length > 0 && (
            <div className="mt-8">

              <div className="mb-4 flex items-center gap-2">

                <AlertCircle
                  size={19}
                  className="text-red-500"
                />

                <h3 className="text-base font-semibold text-slate-800">
                  Failed Rows
                </h3>

              </div>

              <div className="
                overflow-hidden
                rounded-xl
                border border-slate-200
              ">

                <div className="
                  overflow-x-auto
                ">

                  <table className="w-full text-left">

                    <thead className="bg-slate-50">

                      <tr>

                        <th className="
                          px-5 py-3
                          text-xs font-semibold
                          uppercase
                          tracking-wide
                          text-slate-500
                        ">
                          Row
                        </th>

                        <th className="
                          px-5 py-3
                          text-xs font-semibold
                          uppercase
                          tracking-wide
                          text-slate-500
                        ">
                          Serial Number
                        </th>

                        <th className="
                          px-5 py-3
                          text-xs font-semibold
                          uppercase
                          tracking-wide
                          text-slate-500
                        ">
                          Errors
                        </th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-slate-100">

                      {uploadResult.failedData.map(
                        (failedRow, index) => (
                          <tr
                            key={
                              failedRow.rowNumber ??
                              index
                            }
                            className="bg-white"
                          >

                            <td className="
                              px-5 py-4
                              text-sm
                              font-medium
                              text-slate-700
                            ">
                              {failedRow.rowNumber ??
                                "-"}
                            </td>

                            <td className="
                              px-5 py-4
                              text-sm
                              text-slate-600
                            ">
                              {failedRow.data?.[
                                "Serial Number"
                              ] || "-"}
                            </td>

                            <td className="
                              px-5 py-4
                            ">

                              <div className="space-y-1">

                                {failedRow.errors?.map(
                                  (error, errorIndex) => (
                                    <p
                                      key={errorIndex}
                                      className="
                                        text-sm
                                        text-red-600
                                      "
                                    >
                                      {error}
                                    </p>
                                  )
                                )}

                              </div>

                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>
          )}

          {/* Result Buttons */}

          <div className="
            mt-6
            flex
            justify-end
            gap-3
            border-t
            border-slate-200
            pt-6
          ">

            <SecondaryButton
              text="Upload Another File"
              onClick={handleUploadAnother}
              className="w-auto px-6"
            />

            <PrimaryButton
              text="View Registered Products"
              onClick={() =>
                navigate(
                  "/admin/dashboard/registered-products"
                )
              }
              className="w-auto px-6"
            />

          </div>

        </PageCard>
      )}
    </>
  );
}