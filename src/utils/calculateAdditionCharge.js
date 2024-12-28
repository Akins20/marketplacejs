export const calculateAdditionalCharge = (price) => {
  if (price < 10000) return 1500; // For prices below ₦10,000
  if (price < 20000) return 3000; // For prices between ₦10,000 and ₦20,000
  if (price < 30000) return 4500; // For prices between ₦20,000 and ₦30,000
  return Math.floor(price / 10000) * 1500; // For prices above ₦30,000, add ₦1,500 per ₦10,000 increment
};
