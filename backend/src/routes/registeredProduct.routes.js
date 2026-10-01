import { Router } from "express";
import { createRegisteredProduct, getAllRegisteredProducts, getRegisteredProductBySerialNumber,  updateRegisteredProduct, updateRegisteredProductServiceHistory, addRegisteredProductService, checkAdminProductWarranty, checkClientProductWarranty, checkPublicProductWarranty, bulkCreateRegisteredProducts, downloadRegisteredProductTemplate, downloadRegisteredProductsExcel  } from "../controllers/registeredProduct.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { uploadExcel } from "../middleware/multer.middleware.js";

const router = Router();

/* ---------------- Registered Products ---------------- */

router.route("/")
.post(verifyJWT, createRegisteredProduct)
.get(verifyJWT, getAllRegisteredProducts);


/* ---------------- Update Service History ---------------- */

router
  .route("/update-service")
  .patch(verifyJWT, updateRegisteredProductServiceHistory);


  
  /* ---------------- Bulk Upload Registered Products ---------------- */

router
    .route("/bulk-upload")
    .post(
        verifyJWT,
        uploadExcel.single("file"),
        bulkCreateRegisteredProducts
    );

    
    // Download registered product Excel template
router.get(
    "/bulk-upload/template",
    downloadRegisteredProductTemplate
);

/* ---------------- Download Registered Products Excel ---------------- */

router.get(
    "/download",
    verifyJWT,
    downloadRegisteredProductsExcel
);


/* ---------------- Single Registered Product ---------------- */

router
  .route("/:serialNumber")
  .get(verifyJWT, getRegisteredProductBySerialNumber)
  .patch(verifyJWT, updateRegisteredProduct);


  /* ---------------- Add Service ---------------- */
  
router
  .route("/:serialNumber/services")
  .post(verifyJWT, addRegisteredProductService);

/* ---------------- Warranty ---------------- */

// Admin/Internal Users
router
  .route("/warranty/admin/:serialNumber")
  .get(verifyJWT, checkAdminProductWarranty);

// Client
router
  .route("/warranty/client/:serialNumber")
  .get(verifyJWT, checkClientProductWarranty);

// Public (No Login Required)
router
  .route("/warranty/public/:serialNumber")
  .get(checkPublicProductWarranty);



export default router;