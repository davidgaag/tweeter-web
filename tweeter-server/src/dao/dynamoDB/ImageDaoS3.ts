import { ImageDaoInterface } from "../DaoInterfaces";
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';

export class ImageDaoS3 implements ImageDaoInterface {
   private readonly BUCKET = "tweeter-dgaag";
   private readonly REGION = "us-east-2";
   private readonly directory = "profile-pictures/";

   public async putImage(imageStringBase64: string, alias: string): Promise<string> {
      let decodedImageBuffer: Buffer = Buffer.from(imageStringBase64, "base64");
      const s3Params = {
         Bucket: this.BUCKET,
         Key: this.directory + alias,
         Body: decodedImageBuffer,
         ContentType: "image/png",
         ACL: ObjectCannedACL.public_read
      };
      const command = new PutObjectCommand(s3Params);
      const client = new S3Client({ region: this.REGION });
      try {
         await client.send(command);
         return `https://${this.BUCKET}.s3.${this.REGION}.amazonaws.com/${this.directory}${alias}`;
      } catch (error) {
         console.error(error);
         throw new Error("S3 put image failed with: " + error);
      }
   }
}