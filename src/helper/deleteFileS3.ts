import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "./aws-config";

const deleteFileS3 = async (file: string) => {
    try {
        const fileParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME || '',
            Key: file,
        };

        await s3Client.send(new DeleteObjectCommand(fileParams));

        return JSON.stringify({ message: "Delete image success", status: "ok" });
    } catch (error) {
        console.error('Error delete image', error);
        return JSON.stringify({ message: "Delete image failed", status: "failed" });
    }
};

export default deleteFileS3;