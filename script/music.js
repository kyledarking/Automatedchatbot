module.exports = {
  config: {
    name: "music",
    usePrefix: true,
    credits: "1SOY DEV",
    usage: `music [song]`,
    description: "search muisc on youtube",
    permission: 0, // Set the required permission level (0 for normal users, 1 for admin)
    // Other configuration properties
    commandCategory:"Media",
  },
  run: async function({ api, event, args, commandModules }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const ytdl = require("ytdl-core");
    const yts = require("yt-search");

    const song = args.join(" ");




    try {
      if (!song) {
        return api.sendMessage("Please specify a song", event.threadID, event.messageID);
      }

      const searchResults = await yts(song);
      if (!searchResults.videos.length) {
        return api.sendMessage("Error: No search results found.", event.threadID, event.messageID);
      }

      const video = searchResults.videos[0];
      const videoUrl = video.url;

      const stream = ytdl(videoUrl, { filter: "audioonly" });

      const fileName = `${event.senderID}.mp3`;
      const filePath = `cache/${fileName}`;

      stream.pipe(fs.createWriteStream(filePath));

      stream.on("info", (info) => {
        console.info("[DOWNLOADER]", `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
        api.sendMessage(`[DOWNLOADER]Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`, event.threadID, event.messageID);
      });

      stream.on("end", async () => {
        console.info("[DOWNLOADER] Downloaded");
        api.sendMessage("[DOWNLOADER] Downloaded", event.threadID, event.messageID);
        if (fs.statSync(filePath).size > 26214400) {
          fs.unlinkSync(filePath);
          return api.sendMessage("The file is larger than 25MB and cannot be sent.", event.threadID);
        }

        const res = await axios.get(`https://api.easy-api.online/v1/lyrics?s=${encodeURIComponent(song)}`);
        const lyrics = res.data.lyrics || "Lyrics not found!";
        const cover = res.data.cover;

        try {
          const coverResponse = await axios.get(cover, { responseType: 'arraybuffer' });
          fs.writeFileSync('cache/yt.jpg', Buffer.from(coverResponse.data, 'binary'));

          const lyricss = {
            body: lyrics,
            attachment: fs.createReadStream('cache/yt.jpg'),
          };
          api.sendMessage(lyricss, event.threadID, event.messageID);
          api.sendMessage({ body: "", attachment: fs.createReadStream(filePath), }, event.threadID, () => {
            fs.unlinkSync(filePath);
          });
        } catch (coverError) {
          console.error("[ERROR] Unable to fetch cover image:", coverError);
        }
      });
    } catch (error) {
      console.error("[ERROR]", error);
      api.sendMessage("An error occurred while processing the command.", event.threadID);
    }
  },////////////////
};
