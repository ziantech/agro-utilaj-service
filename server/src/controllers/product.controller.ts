import { Request, Response } from "express";
import { generateErrorResponse } from "../helpers/generate-error";
import { v4 as uuidv4 } from "uuid";
import { uploadImage } from "../services/upload.service";
import { Product } from "../models/product.model";
import { generateUniqueProductId } from "../helpers/unique-id";
import { DeleteObjectCommand, DeleteObjectsCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
import { sendEmail } from "../services/email.service";
import { generateEmail } from "../helpers/generate-email";

const s3 = new S3Client({
   region: process.env.AWS_REGION,
   credentials: fromEnv()
 })


 function cleanString(input: string): string {
   return input.replace(/[^a-zA-Z0-9]/g, '');
 }

export const createProduct = async (req: Request, res: Response):Promise<void> => {
    try {
      const { name, description, category, make, productModel, price, negotiable } = req.body;
      const files = req.files as Express.Multer.File[]

      if (!name || !description || !category || !make || !productModel || !price) {
         generateErrorResponse(res, 400, "Missing required product fields")
         return;
       }

       const uniqueId = await generateUniqueProductId();

       const uploadedImages = await Promise.all(
         files.map(async (file) => {
            const imageUrl = await uploadImage(file, name);
            return {id: uuidv4(), file: imageUrl}
         })
       );

       const product = new Product({
         unique_id: uniqueId,
         name,
         description,
         category,
         make,
         productModel,
         price: JSON.parse(price),
         negotiable,
         images: uploadedImages
       });

       await product.save();
  
       res.status(201).json({ message: 'Product added successfully', id: product._id });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
export const getProduct = async (req: Request, res: Response):Promise<void> => {
   try {
      const { id } = req.params;

      const product = await Product.findById(id);

      if(!product) {
         generateErrorResponse(res, 404, "Nu a fost gasit nici un produs")
         return;
      }

      res.status(200).json({product})

   } catch (error) {
      console.error(error)
   }
}

export const getProducts = async (req: Request, res: Response):Promise<void> => {
   try {
    
      const products = await Product.find().select('name unique_id make productModel price category images createdAt').sort({ createdAt: -1 });;

      res.status(200).json({products: products})

   } catch (error) {
      console.error(error)
   }
}

export const getLastProducts = async (req: Request, res: Response):Promise<void> => {
   try {
    
      const products = await Product.find().select('name unique_id make productModel price category images createdAt').sort({ createdAt: -1 }).limit(4);;

      res.status(200).json({products: products})

   } catch (error) {
      console.error(error)
   }
}


export const deleteProduct = async (req: Request, res: Response):Promise<void> => {
   try {
      const { id } = req.params;

      const product = await Product.findById(id);

      if (!product) {
        generateErrorResponse(res, 404, "Nu a fost gasit nici un produs");
        return;
      }

      const folderPrefix = `products/${cleanString(product.name)}/`;

      const listParams = {
         Bucket: process.env.AWS_S3_BUCKET_NAME!,
         Prefix: folderPrefix, 
       };

      const listedObjects = await s3.send(new ListObjectsV2Command(listParams));


      if (listedObjects.Contents && listedObjects.Contents.length > 0) {
         // Step 2: Delete all objects in the folder
         const deleteParams = {
           Bucket: process.env.AWS_S3_BUCKET_NAME!,
           Delete: {
             Objects: listedObjects.Contents.map((obj) => ({ Key: obj.Key! })), 
           },
         };
   
         await s3.send(new DeleteObjectsCommand(deleteParams));
         console.log(`Deleted folder: ${folderPrefix}`);
       }

      await Product.findByIdAndDelete(id);
      res.status(200).json({ message: "Produsul și toate fișierele asociate au fost șterse cu succes"})

   } catch (error) {
      generateErrorResponse(res, 500, "Eroare interna la stergerea produsului");
   }
}

export const deleteImage = async (req: Request, res: Response):Promise<void> => {
   try {
      const { productId, imageId } = req.params;

      const product = await Product.findById(productId);

      if (!product) {
        generateErrorResponse(res, 404, "Nu a fost gasit nici un produs");
        return;
      }

      const image = product.images!.find(img => img.id === imageId);
      if (!image) {
        generateErrorResponse(res, 404, "Imaginea nu a fost găsită");
        return;
      }

      const imageKey = image.file.split('.amazonaws.com/')[1];

      try {
         await s3.send(new DeleteObjectCommand({
           Bucket: process.env.AWS_S3_BUCKET_NAME!,
           Key: imageKey,
         }));
         console.log(`Deleted image from S3: ${imageKey}`);
       } catch (err) {
         console.error(`Failed to delete image from S3: ${imageKey}`, err);
         generateErrorResponse(res, 500, "Eroare la ștergerea imaginii din AWS S3");
         return;
       }

       product.images = product.images!.filter(img => img.id !== imageId);

       await product.save();
      
      res.status(200).json({ message: "Imaginea si fisierul asociat au fost șterse cu succes"})

   } catch (error) {
      generateErrorResponse(res, 500, "Eroare interna la stergerea produsului");
   }
}

export const addImages = async (req: Request, res: Response):Promise<void> => {
   try {
      const {id} = req.params;
      const files = req.files as Express.Multer.File[]
      const product = await Product.findById(id).select("name images");

      if(!product) {
         generateErrorResponse(res, 400, "Nici un produs gasit")
         return;
      }

      const uploadedImages = await Promise.all(
         files.map(async (file) => {
            const imageUrl = await uploadImage(file, product.name);
            return {id: uuidv4(), file: imageUrl}
         })
      )

      product.images = [...product.images!, ...uploadedImages];

      product.markModified('images');
      product.save();

      res.status(200).json({message: "Toate Pozele au fost adaugate cu success"})
   } catch (error) {
      console.error(error)
   }
}

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
   try {
     const { id } = req.params;
     const updates = req.body;
 
     console.log("Updating product:", id, updates);
 
     // Find the existing product
     const product = await Product.findById(id);
     if (!product) {
       res.status(404).json({ message: "Produsul nu a fost găsit" });
       return;
     }
 
     
     Object.keys(updates).forEach((key) => {
       if (updates[key] !== undefined) {
         (product as any)[key] = updates[key];
       }
     });
 
     await product.save();
 
     res.status(200).json({ message: "Produsul a fost actualizat cu succes!" });
   } catch (error) {
     console.error("Error updating product:", error);
     res.status(500).json({ message: "Eroare internă la actualizarea produsului" });
   }
 };

 export const sendMessage = async (req: Request, res: Response): Promise<void> => {
   try {
      const {name, email, message} = req.body;

      await sendEmail("adrianateodorasarb@yahoo.com", "Ati primit un mesaj nou pe AgroUtilaj", generateEmail("adriana", "contactMessage", {email, message, name}))

      res.status(200).json({ message: 'Mesajul dvs. a fost trimis cu succes! Vă vom contacta în cel mai scurt timp posibil.' });

   } 
   catch(error) {
      console.error(error)
   }
 }