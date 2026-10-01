
export const sidebarConfig = {
  client: [
    {
      name: "Dashboard",
      path: "/client/dashboard",
    },
    {
      name: "Warranty Verification",
      path: "/client/dashboard/warranty-check",
    },
    {
      name: "Create Ticket",
      path: "/client/dashboard/ticket/create",
    },
    {
      name: "My Tickets",
      path: "/client/dashboard/all-tickets",
    },
    // {
    //   name: "Support Inbox",
    //   path: "/client/dashboard/chatbox",
    // },
    {
      name: "My Profile",
      path: "/client/dashboard/profile-details",
    },
    {
      name: "Change Password",
      path: "/client/dashboard/change-password",
    },
  ],

  internal: [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      roles: ["superadmin", "admin", "engineer", "l1_engineer", "sales_manager", "inventory_manager"],
    },

   {
  name: "Product Management",
  roles: ["superadmin", "admin", "engineer", "l1_engineer", "sales_manager", "inventory_manager"],
  children: [
    // {
    //   name: "Product Catalog",
    //   path: "/admin/dashboard/products",
    //   roles: ["superadmin", "admin", "engineer", "l1_engineer","sales_manager", "inventory_manager"],
    // },
    {
      name: "Registered Products",
      path: "/admin/dashboard/registered-products",
      roles: ["superadmin", "admin", "engineer", "l1_engineer", "sales_manager", "inventory_manager"],
    },
    {
  name: "Bulk Register Products",
  path: "/admin/dashboard/registered-products/bulk-upload",
  roles: ["superadmin", "admin"],
},

     {
      name: "Register Product",
      path: "/admin/dashboard/registered-products/create",
      roles: ["superadmin", "admin"],
    },
  ],
},

    {
      name: "User Management",
      roles: ["superadmin", "admin", "engineer", "l1_engineer", "sales_manager", "inventory_manager"],
      children: [
        {
          name: "Users",
          path: "/admin/dashboard/users",
          roles: ["superadmin", "admin", "engineer", "l1_engineer","sales_manager", "inventory_manager"],
        },
        {
          name: "Create User",
          path: "/admin/dashboard/create-user",
          roles: ["superadmin", "admin", "engineer", "l1_engineer", "sales_manager"],
        },
      ],
    },

    {
      name: "Ticket Management",
      roles: ["superadmin", "admin", "engineer", "l1_engineer", "sales_manager", "inventory_manager"],
      children: [
        {
          name: "Create Ticket",
          path: "/admin/dashboard/ticket/create",
          roles: ["superadmin", "admin", "engineer", "l1_engineer", "sales_manager"],
        },
        {
          name: "All Tickets",
          path: "/admin/dashboard/all-tickets",
          roles: ["superadmin", "admin", "engineer", "l1_engineer", "sales_manager", "inventory_manager"],
        },
      ],
    },

//     {
//   name: "Sales Management",
//   roles: ["superadmin", "admin", "engineer", "l1_engineer", "sales_manager", "inventory_manager"],
//   children: [
//     {
//       name: "Sold Products",
//       path: "/admin/dashboard/sold-products",
//       roles: ["superadmin", "admin", "engineer", "l1_engineer", "sales_manager", "inventory_manager"],
//     },
//   ],
// },

    {
      name: "Warranty Verification",
      path: "/admin/dashboard/warranty-check",
      roles: ["superadmin", "admin", "engineer", "l1_engineer", "sales_manager", "inventory_manager"],
    },

    // {
    //   name: "Support Inbox",
    //   path: "/admin/dashboard/chatbox",
    //   roles: ["superadmin", "admin", "engineer", "l1_engineer", "sales_manager", "inventory_manager"],
    // },

    // {
    //   name: "Announcements",
    //   path: "/admin/dashboard/announcements",
    //   roles: ["superadmin", "admin", "engineer", "l1_engineer", "sales_manager", "inventory_manager"],
    // },

    {
      name: "My Profile",
      path: "/admin/dashboard/profile-details",
      roles: ["superadmin", "admin", "engineer", "l1_engineer", "sales_manager", "inventory_manager"],
    },

    {
      name: "Change Password",
      path: "/admin/dashboard/change-password",
      roles: ["superadmin", "admin", "engineer", "l1_engineer", "sales_manager", "inventory_manager"],
    },
  ],
};