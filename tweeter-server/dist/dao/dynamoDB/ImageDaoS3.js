"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageDaoS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
class ImageDaoS3 {
    BUCKET = "tweeter-dgaag";
    REGION = "us-east-2";
    directory = "profile-pictures/";
    async putImage(imageStringBase64, alias) {
        let decodedImageBuffer = Buffer.from(imageStringBase64, "base64");
        const s3Params = {
            Bucket: this.BUCKET,
            Key: this.directory + alias,
            Body: decodedImageBuffer,
            ContentType: "image/png",
            ACL: client_s3_1.ObjectCannedACL.public_read
        };
        const command = new client_s3_1.PutObjectCommand(s3Params);
        const client = new client_s3_1.S3Client({ region: this.REGION });
        try {
            await client.send(command);
            return `https://${this.BUCKET}.s3.${this.REGION}.amazonaws.com/${this.directory}${alias}`;
        }
        catch (error) {
            console.error(error);
            throw new Error("S3 put image failed with: " + error);
        }
    }
}
exports.ImageDaoS3 = ImageDaoS3;
