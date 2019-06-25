// the tutorial is taken from https://medium.com/canal-tech/how-video-streaming-works-on-the-web-an-introduction-7919739f7e1
const videoTag = document.getElementById("my-video");
// creating the media source
const myMediaSource = new MediaSource();
const url = URL.createObjectURL(myMediaSource);
videoTag.src = url;

// The video is not directly pushed into MediaSource for playback
// SourceBuffer does that. MediaSource has one or more SourceBuffers
// Two SourceBuffer on MediaSource, one for audio and one for video

// 1. add source buffers
const audioSourceBuffer = myMediaSource.addSourceBuffer('audio/mp4; codecs="mp4a.40.2"');
const videoSourceBuffer = myMediaSource.addSourceBuffer('video/mp4; codecs="avc1.64001e"');

// 2. Download and add audio/video to the SourceBuffers
fetch("https://server.con/audio.mp4").then(function(response) {
    // The data has to be a JavaScript ArrayBuffer
    return response.arrayBuffer();
}).then(function(audioData) {
    audioSourceBuffer.appendBuffer(audioData);
});

fetch("https://server.com/video.mp4").then(function(response) {
    return response.arrayBuffer();
}).then(function(videoData) {
    videoSourceBuffer.appendBuffer(videoData);
});

// Video and audio files are split into multiple segments of various sizes
// Push multiple segments progressively other than one huge file 
/*
 * Fetch a video or an audio segment, and returns it as an arrayBuffer, in a promise 
   @param string: url
   @returns promise.<ArrayBuffer>
 */
function fetchSegment(url) {
    return fetch(url).then(function(response) {
        return response.arrayBuffer();
    });
}

// fetch audio segments one after another (notice the URLS)
// try how the then chains and calls each other 
fetchSegment("https://server.com/audio/segment0.mp4")
    .then(function(audioSegment0) {
        audioSourceBuffer.appendBuffer(audioSegment0);
    })
    .then(function() {
        return fetchSegment("https://server.com/audio/segment1.mp4");
    })
    .then(function(audioSegment1) {
        audioSourceBuffer.appendBuffer(audioSegment1);
    })
    .then(function() {
        return fetchSegment("https://server.com/audio/segment2.mp4");
    })
    .then(function() {
        audioSourceBuffer.appendBuffer(audioSegment2);
    })

    // fetch video segments one after another (notice the URLS)
fetchSegment("https://server.com/video/segment0.mp4")
.then(function(videoSegment0) {
    videoSourceBuffer.appendBuffer(videoSegment0);
})
.then(function() {
    return fetchSegment("https://server.com/video/segment1.mp4");
})
.then(function(videoSegment1) {
    videoSourceBuffer.appendBuffer(videoSegment1);
})
.then(function() {
    return fetchSegment("https://server.com/video/segment2.mp4");
})
.then(function() {
    videoSourceBuffer.appendBuffer(videoSegment2);
})

/*  Push audio segment in the source buffer based on its number 
    and quality 
    @param {number} nb
    @param {string} language
    @param {string} wantedQuality
    @param {Promise}
*/
function pushAudioSegment(nb, wantedQuality) {
    // The url begins to be  little more complex now
    const url = "http://my-server/audio/" + wantedQuality 
        + "/segment" + nb + ".mp4";
    return fetch(url)
    .then((response) => response.arrayBuffer())
    .then(function(arrayBuffer) {
        audioSourceBuffer.appendBuffer(arrayBuffer);
    });
}

    /*
    Translate an estimatd bandwidth to the right audio quality 
    as defined on server-side 
    */
   function fromBandwidthToQuality(bandwidth) {
       return bandwidth > 320e3 ? "320kpbs" : "128kbps";
   }

   // first an estimated bandwidth to the right audio quality
   // as defined on server-side

   const bandwidth = estimatedBandwidth();
   const quality = fromBandwidthToQuality(bandwidth);

   pushAudioSegment(0, quality)
    .then(() => pushAudioSegment(1, quality))
    .then(() => pushAudioSegment(2, quality));

    // manage language 
    //./audio/esperanto/segment0.mp4
    //./audio/french/segment0.mp4

    function pushAudioSegment(nb, language) {
        // construct dynamically the URL of the segment and push it to the SourceBuffer
        const url = "https://my-server/audio" + language + "/segment" + nb + '.mp4'
        return fetch(url)
            .then((response) => response.arrayBuffer())
            .then(function() {
                audioSourceBuffer.appendBuffer(arrayBuffer);
        });
    }

    // recuperate in some way the user's language
const language = getUsersLanguage();
pushAudioSegment(0, langugae)
    .then(() => pushAudioSegment(1, language))
    .then(() => pushAudioSegment(2, language));

// remove pushed content from 0 to 40s 
audioSourceBuffer.remove(0, 40);

// manage the network and language together
function pushAudioSegment(nb, language, wantedQuality) {
    // the url begins to be a little more complex here 
    const url = "http://my-server/audio/" + language + "/" + wantedQuality + "/segment"
        + mb + ".mp4";
    return fetch(url)
        .then((response) => response.arrayBuffer())
        .then(function(arrayBuffer) {
            audioSourceBuffer.appendBuffer(arrayBuffer);
    });
}

const bandwidth = estimatedBandwidth();
const quality = fromBandwidthToQuality(bandwidth);
const language = getUsersLanguage();
pushAudioSegment(0, language, quality)
    .then(() => pushAudioSegment(1, language, quality))
    .then(() => pushAudioSegment(2, language, quality));

// Live streaming , each of the segment lasts 2 seconds long 
// ./audio/segment0s.mp4
// ./audio/segment2s.mp4

// read Streaming Media Protocols, core conceft the Manifest
// Manifest is a file describing which segments are available on the server 

/* DASH transport protocol YouTube, Netflix and Amazon Prime. Manifest is called 
Media Presentation Description

HLS Developed by Apple, used by DailyMotion, Twitch.tv, and many others
The HLS is manifest is called the playlist and is in the m3u8 format, UTF-8

Smooth Streaming, developed by Microsoftm used by multiple Microsoft products
and MyCanal. Manifests are called Manifests and are XML based
*/

/*
Open source web video players 
rx-player: Configurable player for both DASH and Smooth Streaming contents 
Written in TypeScript

dash.js: Play DASH contents, support a wide range of DASH features

hls.js: well-reputed HLS player. Used in production by multiple 
    big names like DailyMotino, Canal+, AdultSwin, Twitter, VK and more

shaka-player: DASH and HLS player. Maintained by Google
*/





