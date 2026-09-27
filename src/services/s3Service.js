// src/services/s3Service.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize the S3 client using environment variables
const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
  // Required for browser usage of AWS SDK v3
  customUserAgent: "serverless-file-processing-pipeline",
});

export const uploadFileToS3 = async (file) => {
  const bucketName = import.meta.env.VITE_S3_INPUT_BUCKET;
  // Use a clean key path: input/filename
  const key = `input/${Date.now()}_${file.name}`;

  try {
    // Convert browser File object to ArrayBuffer then Uint8Array to ensure 100% compatibility in browser environments
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: uint8Array,
      ContentType: file.type || 'application/octet-stream',
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    return {
      success: true,
      bucket: bucketName,
      key: key,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};