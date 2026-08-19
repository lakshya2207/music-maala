# Music Mala (म्यूज़िक माला)

A single-page retro radio web application streaming classic Hindi music & vintage melodies via YouTube & MongoDB.

## Features & Stack
- **Next.js 15 App Router** & **TypeScript**
- **MongoDB Data Persistence**: Connected via Mongoose for fetching and saving playlists/tracks.
- **YouTube Maxresdefault Thumbnails**: High-resolution video artwork inside the spinning vinyl player.
- **Real-Time Live Listener Count**: Dynamic heartbeat presence tracking online listeners.
- **Made by lakshya2207**: GitHub profile badge in top navigation.

## Setup

```bash
npm install
npm run dev
```

Set your MongoDB connection string in `.env.local`:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/music-mala
```
