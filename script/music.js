const axios = require('axios');

module.exports.config = {
    name: "spotify",
    version: "1.0.0",
    description: "Search for a song on Spotify.",
    usage: "{prefix}spotify <song name>",
    hasPrefix: true,
    credits: "chill",
    commandCategory: "Music",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const query = args.join(" ");

    if (!query) {
        return api.sendMessage("Please provide the name of the song to search for.", event.threadID, event.messageID);
    }

    try {
        api.sendMessage("Searching for the song on Spotify...", event.threadID, event.messageID);

        const apiUrl = `https://hiroshi-api-hub.replit.app/music/spotify?search=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);

        const songs = response.data.songs;

        if (songs.length > 0) {
            const firstSong = songs[0];
            const songInfo = `Song Name: ${firstSong.name}\nArtist(s): ${firstSong.artists.join(", ")}\nAlbum: ${firstSong.album}\nRelease Date: ${firstSong.release_date}\nPreview URL: ${firstSong.preview_url}`;

            api.sendMessage({
                body: "Here is the information for the first song found on Spotify:",
                attachment: firstSong.album_art,
                mentions: [
                    {
                        tag: firstSong.name,
                        id: firstSong.id,
                        fromIndex: songInfo.indexOf(firstSong.name),
                        toIndex: songInfo.indexOf(firstSong.name) + firstSong.name.length,
                        type: "audio"
                    }
                ]
            }, event.threadID, () => {}, event.messageID);

            api.sendMessage(songInfo, event.threadID, () => {}, event.messageID);
        } else {
            throw new Error("No songs found matching the search query.");
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while searching for the song.", event.threadID, event.messageID);
    }
};
