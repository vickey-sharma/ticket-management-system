import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTicketsByClient } from "../../../services/ticketService";
import toast from "react-hot-toast";
import PageHeader from '../../../components/page-layout/PageHeader';
import PageCard from '../../../components/auth/PageCard';
import Pagination from '../../../components/table/Pagination';
import TicketsFilters from "../../../components/ticket-management/TicketsFilters";
import TicketsTable from "../../../components/ticket-management/TicketsTable";

const INITIAL_FILTERS = {
    search: "",
    ticketStatus: "",
    priority: "",
    department: "",
    serialNumber: "",
    productName: "",
    modelNumber: "",
    billNumber: "",
    dateFilter: "",
    startDate: "",
    endDate: "",
};

export function TicketsPage() {

   const navigate = useNavigate();

   const [loading, setLoading] = useState(true);
       const [tickets, setTickets] = useState([]);

       
             const [pagination, setPagination] = useState({
               currentPage: 1,
               totalPages: 1,
               totalTickets: 0,
               limit: 20,
             });

   const [filters, setFilters] = useState(INITIAL_FILTERS);
   
   const handleFilterChange = (field, value) => {
    setPagination((prev) => ({
        ...prev,
        currentPage: 1,
    }));

    setFilters((prev) => {
        const updatedFilters = {
            ...prev,
            [field]: value,
        };

        if (field === "dateFilter" && value !== "custom") {
            updatedFilters.startDate = "";
            updatedFilters.endDate = "";
        }

        return updatedFilters;
    });
};

const handleResetFilters = () => {
    setPagination((prev) => ({
        ...prev,
        currentPage: 1,
    }));

    setFilters({ ...INITIAL_FILTERS });
};

const handlePageChange = (page) => {
    setPagination((prev) => ({
        ...prev,
        currentPage: page,
    }));
};

const handleLimitChange = (limit) => {
    setPagination((prev) => ({
        ...prev,
        limit,
        currentPage: 1,
    }));
};

 const fetchTickets = useCallback(async () => {
  try {
      setLoading(true);
  
      const response = await getAllTicketsByClient({
         page: pagination.currentPage,
          limit: pagination.limit,
          ...filters,
    });
  
     console.log(response.data.data)
      console.log(response.data.data.tickets)
      setTickets(response.data.data.tickets);
      setPagination(response.data.data.pagination);
  
      
  } catch (error) {
    toast.error(
            error.response?.data?.message ||
              "Unable to fetch tickets."
          );
  }finally {
      setLoading(false);
    }
  },[
    filters,
    pagination.currentPage,
    pagination.limit,
  ]);

   useEffect(() => {
      // Customized date filter requires both dates
      if (
        filters.dateFilter === "custom" &&
        (!filters.startDate || !filters.endDate)
      ) {
        return;
      }
    
      const timer = setTimeout(() => {
        fetchTickets();
      }, 400);
    
      return () => clearTimeout(timer);
    }, [fetchTickets, filters.dateFilter, filters.startDate, filters.endDate]);

    

 return (
    <div className="space-y-6">

        <PageHeader
            title="My Tickets"
            description="View and track your support tickets."
        />

        <PageCard>
            <TicketsFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                role="client"
            />
        </PageCard>

        <PageCard className="overflow-hidden">

            <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">
                        My Tickets
                    </h2>

                    <p className="mt-0.5 text-sm text-slate-500">
                        {pagination.totalTickets}{" "}
                        {pagination.totalTickets === 1
                            ? "ticket"
                            : "tickets"}{" "}
                        found
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <TicketsTable
                    tickets={tickets}
                    loading={loading}
                    role="client"
                    onView={(ticket) => {
                        console.log("VIEW TICKET:", ticket);
                    }}
                />
            </div>

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

