import { Status } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { DynamoDaoFactory } from "../dao/dynamoDB/DynamoDaoFactory";

export const handler = async function (event: any) {
   for (let i = 0; i < event.Records.length; ++i) {
      const { body } = event.Records[i];
      console.log("body: ", body)
      const bodyObj = JSON.parse(body);
      const status = Status.fromJson(bodyObj.status);
      const followers = bodyObj.followers as string[];

      // Send the status to the followers' feeds
      try {
         await new StatusService(new DynamoDaoFactory()).postStatusToFeeds(status!, followers);
      } catch (error) {
         console.error("Failed to post status to feeds because of exception: ", error);
         throw error;
      }
   }
   return null;
};