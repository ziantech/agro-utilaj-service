import { Router } from "express";
import { addImages, createProduct, deleteImage, deleteProduct, getLastProducts, getProduct, getProducts, sendMessage, updateProduct } from "../controllers/product.controller";
import { uploadMiddleware } from "../middlewares/upload.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";


const router = Router();

router.post('/create-product', uploadMiddleware ,createProduct)

router.get('/get-product/:id', getProduct)

router.delete('/delete-product/:id', authMiddleware, deleteProduct)

router.get('/get-products', getProducts)

router.get('/get-last-products', getLastProducts)

router.delete('/delete-image/:productId/:imageId', authMiddleware, deleteImage)

router.post('/add-images/:id', uploadMiddleware, addImages)

router.put('/update-product/:id', authMiddleware, updateProduct)

router.post('/contact', sendMessage)
export default router;
