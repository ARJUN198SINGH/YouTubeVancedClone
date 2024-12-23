const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = 'AIzaSyCHgiKNhTMjOap3hOxdj9Go2nPFg71q5F4'; // Replace with your YouTube Data API v3 key

app.use(express.static(path.join(__dirname, 'public')));

app.get('/search', async (req, res) => {
    const query = req.query.query;
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
            params: {
                part: 'snippet',
                q: query,
                key: API_KEY,
                maxResults: 30,
                type: 'video'
            }
        });
        res.json(response.data.items);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).send('Failed to fetch videos. Please try again later.');
    }
});

app.get('/check-embeddable', async (req, res) => {
    const videoId = req.query.videoId;
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=status&id=${videoId}&key=${API_KEY}`);
        res.json(response.data.items[0].status.embeddable);
    } catch (error) {
        console.error('Error checking embeddable status:', error);
        res.status(500).send('Failed to check embeddable status. Please try again later.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
