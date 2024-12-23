async function searchVideos() {
    const query = document.getElementById('searchQuery').value;
    if (query) {
        window.location.href = `search.html?query=${query}`;
    } else {
        alert('Please enter a search term.');
    }
}

async function fetchVideos(query) {
    try {
        const response = await fetch(`/search?query=${query}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error: ', error);
        alert('Failed to fetch videos. Please try again later.');
        return [];
    }
}

async function checkEmbeddable(videoId) {
    try {
        const response = await fetch(`/check-embeddable?videoId=${videoId}`);
        const embeddable = await response.json();
        return embeddable;
    } catch (error) {
        console.error('Check embeddable error: ', error);
        return false;
    }
}

async function displayVideos(videos) {
    const videoResults = document.getElementById('videoResults');
    videoResults.innerHTML = '';

    if (videos.length === 0) {
        videoResults.innerHTML = '<p>No videos found.</p>';
        return;
    }

    for (const video of videos) {
        const videoId = video.id.videoId;
        const embeddable = await checkEmbeddable(videoId);

        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';

        if (embeddable) {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            videoItem.appendChild(iframe);
        } else {
            videoItem.innerHTML = `
                <h3>${video.snippet.title}</h3>
                <p>Embedding not allowed. <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">Watch on YouTube</a></p>
            `;
        }

        videoResults.appendChild(videoItem);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');

    if (query) {
        const videos = await fetchVideos(query);
        if (videos) {
            displayVideos(videos);
        }
    }
});
