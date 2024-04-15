"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
async function sendMessage(sqs_url, messageBody) {
    let sqsClient = new client_sqs_1.SQSClient();
    const params = {
        MessageBody: messageBody,
        QueueUrl: sqs_url,
    };
    try {
        const data = await sqsClient.send(new client_sqs_1.SendMessageCommand(params));
        console.log("Success, message sent. MessageID:", data.MessageId);
    }
    catch (err) {
        throw err;
    }
}
exports.sendMessage = sendMessage;
