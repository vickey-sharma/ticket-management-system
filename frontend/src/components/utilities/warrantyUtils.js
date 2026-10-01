export function getWarrantyStatus(warrantyEndDate) {
  if (!warrantyEndDate) return "unknown";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const warrantyDate = new Date(warrantyEndDate);
  warrantyDate.setHours(0, 0, 0, 0);

  return warrantyDate >= today ? "active" : "expired";
}