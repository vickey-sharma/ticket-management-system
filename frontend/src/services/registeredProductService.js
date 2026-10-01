import api from "./api";

export const createRegisteredProduct = (data) => {
  return api.post("/registered-products", data);
};

export const getAllRegisteredProducts = (params = {}) => {
  return api.get("/registered-products", {
    params,
  });
};

export const getRegisteredProductBySerialNumber = (serialNumber) => {
  return api.get(`/registered-products/${serialNumber}`);
};

export const updateRegisteredProduct = (serialNumber, data) => {
  return api.patch(
    `/registered-products/${serialNumber}`,
    data
  );
};

export const addRegisteredProductService = (serialNumber, data) => {
  return api.post(
    `/registered-products/${serialNumber}/services`,
    data
  );
};

export const updateRegisteredProductServiceHistory = (data) => {
  return api.patch(
    "/registered-products/update-service",
    data
  );
};



// WARRANTY SERVICES

export const checkPublicProductWarranty = (serialNumber) => {
  return api.get(`/registered-products/warranty/public/${serialNumber}`);
};

export const checkClientProductWarranty = (serialNumber) => {
  return api.get(`/registered-products/warranty/client/${serialNumber}`);
};

export const checkAdminProductWarranty = (serialNumber) => {
  return api.get(`/registered-products/warranty/admin/${serialNumber}`);
};


//BULK REGISTER PRODUCT
export const bulkUploadRegisteredProducts = (file) => {
  const formData = new FormData();

  formData.append("file", file);

  return api.post(
    "/registered-products/bulk-upload",
    formData
  );
};

export const downloadRegisteredProductTemplate = () => {
  return api.get(
    "/registered-products/bulk-upload/template",
    {
      responseType: "blob",
    }
  );
};

export const downloadRegisteredProductsExcel = (params = {}) => {
  return api.get("/registered-products/download", {
    params,
    responseType: "blob",
  });
};