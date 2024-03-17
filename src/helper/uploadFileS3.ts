import {PutObjectCommand} from "@aws-sdk/client-s3";
import s3Client from "./aws-config";
import sharp from "sharp";
import moment from "moment";
import path from "path";

const uploadFileS3 = async (file: any) => {
    try {
        if (file.type !== "image/jpeg" && file.type !== "image/png") {
            return JSON.stringify({ message: "File type not supported", status: "failed" });
        }


        const parsedPath = path.parse(file.name);
        const uniqueFileName = `${moment().format("MM-YY")}/${Date.now()}_${
            parsedPath.name
        }.webp`;
        const fileData = await file.arrayBuffer();
        const convertedImage = await sharp(new Buffer(fileData)).webp().toBuffer();

        const fileParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME || "",
            Key: uniqueFileName,
            Body: convertedImage,
            ContentType: "image/webp",
        };

        await s3Client.send(new PutObjectCommand(fileParams));

        return JSON.stringify({ fileLink: uniqueFileName, status: "ok" });
    } catch (error) {
        console.error("Upload failed", error);
        return JSON.stringify({ message: "Upload failed", status: "failed" });
    }
};

export default uploadFileS3;