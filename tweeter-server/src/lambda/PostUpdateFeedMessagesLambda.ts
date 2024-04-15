import { Status } from "tweeter-shared";
import { FollowsDaoDynamo } from "../dao/dynamoDB/FollowsDaoDynamo";
import { sendMessage } from "../model/Sqs";

export const handler = async function (event: any) {
   for (let i = 0; i < event.Records.length; ++i) {
      const { body } = event.Records[i];
      const status = Status.fromJson(body);


      const alias = status!.user.alias.slice(1);
      const dataPage = await new FollowsDaoDynamo().getMoreFollowers(status!.user.alias, null, null);
      console.log("dataPage: ", dataPage)
      const followers = dataPage.values;

      const sqs_url = "https://sqs.us-east-2.amazonaws.com/533267155110/UserFeedsToUpdate";
      for (let i = 0; i < followers.length; i += 25) {
         const followersChunk = followers.slice(i, i + 25);
         const message = {
            followers: followersChunk,
            status: status!.toJson()
         }
         await sendMessage(sqs_url, JSON.stringify(message));
      }
   }
   return null;
};