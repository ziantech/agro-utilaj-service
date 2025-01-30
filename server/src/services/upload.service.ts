import { S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
import { Upload } from "@aws-sdk/lib-storage";
import { Readable } from "stream";
import { v4 as uuidv4 } from 'uuid';

const SES_CONFIG = {
    region: process.env.AWS_REGION,
    credentials: fromEnv()
}

const s3 = new S3Client(SES_CONFIG)

function cleanString(input:string) {
    return input.replace(/[^a-zA-Z0-9]/g, '');
}

export const uploadImage = async (file: Express.Multer.File, name: string): Promise<string> => {
    if(!file) {
        throw new Error('No File Provided');
    }

    const fileKey = `products/${cleanString(name)}/images/${uuidv4()}`

    const upload = new Upload({
        client: s3,
        params: {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: fileKey,
            Body: Readable.from(file.buffer),
            ContentType: file.mimetype
        }
    })

    try {
        const uploadResult = await upload.done();
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error('Failed to upload image to S3');
    }

    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`
}