import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import PageHeader from "../../../components/page-layout/PageHeader";
import PageCard from "../../../components/auth/PageCard";

import RegisteredProductsFilters from "../../../components/registered-products/RegisteredProductsFilters";
import RegisteredProductsTable from "../../../components/registered-products/RegisteredProductsTable";

import Pagination from "../../../components/table/Pagination";

import {
  getAllRegisteredProducts,
  downloadRegisteredProductsExcel,
} from "../../../services/registeredProductService";

const INITIAL_FILTERS = {
  search: "",
  billNumber: "",
  billCompanyName: "",
  endCompanyName: "",
  productName: "",
  modelNumber: "",
  serialNumber: "",
  productStatus: "all",
  dateFilter: "all",
  startDate: "",
  endDate: "",
};

export default function RegisteredProductsPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 10,
  });

  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // --------------------------------------------------
  // Fetch Products
  // --------------------------------------------------

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getAllRegisteredProducts({
        page: pagination.currentPage,
        limit: pagination.limit,
        ...filters,
      });


      setProducts(response.data.data.registeredProducts);

      setPagination(response.data.data.pagination);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to fetch registered products."
      );
    } finally {
      setLoading(false);
    }
  }, [
    filters,
    pagination.currentPage,
    pagination.limit,
  ]);

  // --------------------------------------------------
  // Debounced Search / Filters
  // --------------------------------------------------

useEffect(() => {
  // Customized date filter requires both dates
  if (
    filters.dateFilter === "custom" &&
    (!filters.startDate || !filters.endDate)
  ) {
    return;
  }

  const timer = setTimeout(() => {
    fetchProducts();
  }, 400);

  return () => clearTimeout(timer);
}, [fetchProducts, filters.dateFilter, filters.startDate, filters.endDate]);

  // --------------------------------------------------
  // Filter Change
  // --------------------------------------------------


  const handleFilterChange = (field, value) => {
  console.log("FILTER CHANGED:", field, value);

  setPagination((prev) => ({
    ...prev,
    currentPage: 1,
  }));

  setFilters((prev) => {
    const updatedFilters = {
      ...prev,
      [field]: value,
    };

    if (
      field === "dateFilter" &&
      value !== "custom"
    ) {
      updatedFilters.startDate = "";
      updatedFilters.endDate = "";
    }

    console.log("UPDATED FILTERS:", updatedFilters);

    return updatedFilters;
  });
};


  // --------------------------------------------------
  // Reset Filters
  // --------------------------------------------------

  const handleResetFilters = () => {
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));

    setFilters({
      ...INITIAL_FILTERS,
    });
  };

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  // --------------------------------------------------
  // View
  // --------------------------------------------------

  const handleView = (product) => {
    navigate(
      `/admin/dashboard/registered-products/${product.serialNumber}`
    );
  };

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------

  const handleEdit = (product) => {
    navigate(
      `/admin/dashboard/registered-products/${product.serialNumber}/edit`
    );
  };

  // --------------------------------------------------
  // Services / Replace
  // --------------------------------------------------

  const handleServices = (product) => {
    navigate(
      `/admin/dashboard/registered-products/${product.serialNumber}/services`
    );
  };

  // --------------------------------------------------
  // Download Excel
  // --------------------------------------------------

  const handleDownloadExcel = async () => {
    try {
      const response =
        await downloadRegisteredProductsExcel(filters);

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "registered-products.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success(
        "Registered products Excel downloaded successfully."
      );
    } catch (error) {
      let errorMessage =
        "Unable to download registered products.";

      if (error.response?.data instanceof Blob) {
        try {
          const errorText =
            await error.response.data.text();

          const errorData =
            JSON.parse(errorText);

          errorMessage =
            errorData?.message || errorMessage;
        } catch {
          // Keep default error message
        }
      } else {
        errorMessage =
          error.response?.data?.message ||
          errorMessage;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}

      <PageHeader
        title="Registered Products"
        description="View, search and manage all registered products."
      />


      {/* Filters */}

      <PageCard>
        <RegisteredProductsFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      </PageCard>


      {/* Products */}

      <PageCard className="overflow-hidden">

        {/* Table Header */}

        <div
          className="
            flex
            flex-col
            gap-3
            border-b
            border-slate-200
            px-6
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Registered Products
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              {pagination.totalProducts}{" "}
              {pagination.totalProducts === 1
                ? "product"
                : "products"}{" "}
              found
            </p>
          </div>


          {/* Download Excel */}

          <button
            type="button"
            onClick={handleDownloadExcel}
            disabled={loading}
            className="
              inline-flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-green-600
              px-4
              text-sm
              font-medium
              text-white
              transition
              hover:bg-green-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3v12" />
              <path d="m7 10 5 5 5-5" />
              <path d="M5 21h14" />
            </svg>

            Download Excel
          </button>

        </div>


        {/* Table */}

        <div className="overflow-x-auto">
          <RegisteredProductsTable
            products={products}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onReplace={handleServices}
          />
        </div>


        {/* Pagination */}

        <div className="border-t border-slate-200 px-6 py-4">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>

      </PageCard>

    </div>
  );
}

