// A simple formatter function that takes a number and adds the currency symbol and notation
export const formatPrice = (price) => {
  // Ensure the price is a number, or a string that can be converted to one
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(numericPrice)) {
    return price; // Return original if not a valid number
  }

  return `₹${numericPrice}/-`;
};
