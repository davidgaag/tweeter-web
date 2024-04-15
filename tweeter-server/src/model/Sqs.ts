import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export async function sendMessage(sqs_url: string, messageBody: string) {
   let sqsClient = new SQSClient();
   const params = {
      MessageBody: messageBody,
      QueueUrl: sqs_url,
   };

   try {
      const data = await sqsClient.send(new SendMessageCommand(params));
      console.log("Success, message sent. MessageID:", data.MessageId);
   } catch (err) {
      throw err;
   }
}