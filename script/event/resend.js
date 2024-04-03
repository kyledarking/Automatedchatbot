module.exports.config = {
    name: "resend",
    version: "1.0.0",
};

const msgData = {};

module.exports.handleEvent = async function ({ api, event }) {
    if (event.type === 'message') {
        msgData[event.messageID] = {
            body: event.body,
            attachments: event.attachments
        };
    }

    if (event.type === "message_unsend" && msgData.hasOwnProperty(event.messageID)) {
        const info = await api.getUserInfo(event.senderID);
        const name = info[event.senderID].name;

        let messageType = "";
        let attachmentData = null;

        if (msgData[event.messageID].attachments.length > 0) {
            const attachment = msgData[event.messageID].attachments[0];
            attachmentData = await downloadAttachment(attachment);

            switch (attachment.type) {
                case 'photo':
                    messageType = "photo";
                    break;
                case 'audio':
                    messageType = "voice message";
                    break;
                case 'animated_image':
                    messageType = "gif";
                    break;
                default:
                    messageType = "message";
                    break;
            }
        } else {
            messageType = "message";
        }

        let messageToSend = `Unsend kapang gago ka: "${name}"\eto yung inunsend: ${msgData[event.messageID].body}`;

        if (attachmentData) {
            api.sendMessage({ body: messageToSend, attachment: attachmentData }, event.threadID, () => {
                cleanupAttachments(attachmentData);
            });
        } else {
            api.sendMessage(messageToSend, event.threadID);
        }
    }
};

async function downloadAttachment(attachment) {
    const axios = require('axios');
    const fs = require("fs");
    const path = require("path");

    let attachmentData = null;

    if (attachment.type === 'photo') {
        const photo = [];
        const del = [];

        for (const item of msgData[event.messageID].attachments) {
            const { data } = await axios.get(item.url, { responseType: "arraybuffer" });
            const filePath = path.resolve(__dirname, "cache", `${item.filename}.jpg`);
            fs.writeFileSync(filePath, Buffer.from(data));
            photo.push(fs.createReadStream(filePath));
            del.push(filePath);
        }

        attachmentData = photo;
    } else if (attachment.type === 'audio') {
        const { data } = await axios.get(attachment.url, { responseType: "arraybuffer" });
        const filePath = path.resolve(__dirname, "cache", "audio.mp3");
        fs.writeFileSync(filePath, Buffer.from(data));
        attachmentData = fs.createReadStream(filePath);
    } else if (attachment.type === 'animated_image') {
        const { data } = await axios.get(attachment.previewUrl, { responseType: "arraybuffer" });
        const filePath = path.resolve(__dirname, "cache", "animated_image.gif");
        fs.writeFileSync(filePath, Buffer.from(data));
        attachmentData = fs.createReadStream(filePath);
    }

    return attachmentData;
}

function cleanupAttachments(attachments) {
    const fs = require("fs");

    if (Array.isArray(attachments)) {
        for (const attachment of attachments) {
            fs.unlinkSync(attachment.path);
        }
    } else {
        fs.unlinkSync(attachments.path);
    }
}
