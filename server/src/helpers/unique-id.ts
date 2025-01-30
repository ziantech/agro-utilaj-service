import { Product } from "../models/product.model";


function generateShortId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const generateUniqueProductId = async (): Promise<string> => {
  let uniqueId = generateShortId();
  let isUnique = false;

  while (!isUnique) {
    // Check if the ID exists in the database
    const existingProduct = await Product.findOne({ unique_id: uniqueId });
    if (!existingProduct) {
      isUnique = true; // If no product is found, the ID is unique
    } else {
      uniqueId = generateShortId(); // Generate a new ID if it already exists
    }
  }

  return uniqueId;
};
