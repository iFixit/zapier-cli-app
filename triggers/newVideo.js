const dozukiAPI = require('../tools/dozukiAPI');

const extractDataFromResponse = (response) => {

   for (let x in response.json) {
      if (response.json.hasOwnProperty(x)) {

         // Add 'id' to each result.
         response.json[x].id = response.json[x].videoid;

         // Lift the image id up a level.
         response.json[x].image.id = response.json[x].image.image.id;

         // lift the encodings up and use their column name as the key.
         for (let y in response.json[x].encodings) {
            response.json[x][response.json[x].encodings[y].column]
             = response.json[x].encodings[y];
         }
      }
   }
   return response.json;
};

/**
 * checkForNewImages will pull the image list for the logged in user.
 *
 * Note: Is an unique case in that this record already has an 'id' field.  We
 *  overwrite it with the guid field for Zapier to use.
 *
 * @param z
 * @param bundle
 * @returns {*}
 */
const checkForNewVideos = (z, bundle) => {
   let dAPI      = new dozukiAPI(bundle.authData.siteName);
   dAPI.endpoint = ['user', 'media', 'videos'];
   dAPI.callback = extractDataFromResponse;

   return dAPI.getListFromEndpoint(z);
};

module.exports = {
   key: 'newVideo',
   noun: 'new video',
   display: {
      label: 'New Video',
      description: "Returns videos from a user's media manager."
   },
   operation: {
      sample: {
         "id": 169,
         "videoid": 169,
         "srcid": null,
         "image": {
            "image": {
               "id": 5896,
               "guid": "cJuISbLIiEw5pdwc",
               "mini": "https://d17kynu4zpq5hy.cloudfront.net/igi/slo/cJuISbLIiEw5pdwc.mini",
               "thumbnail": "https://d17kynu4zpq5hy.cloudfront.net/igi/slo/cJuISbLIiEw5pdwc.thumbnail",
               "standard": "https://d17kynu4zpq5hy.cloudfront.net/igi/slo/cJuISbLIiEw5pdwc.standard",
               "medium": "https://d17kynu4zpq5hy.cloudfront.net/igi/slo/cJuISbLIiEw5pdwc.medium",
               "large": "https://d17kynu4zpq5hy.cloudfront.net/igi/slo/cJuISbLIiEw5pdwc.large",
               "original": "https://d17kynu4zpq5hy.cloudfront.net/igi/slo/cJuISbLIiEw5pdwc"
            },
            "srcid": null,
            "width": 1280,
            "height": 720,
            "ratio": "VARIABLE",
            "markup": null,
            "exif": []
         },
         "filename": "sample1.mov",
         "duration": 2469,
         "width": 1280,
         "height": 720,
         "meta": {
            "id": 434594567,
            "format": "mpeg4",
            "frame_rate": 29.97,
            "duration_in_ms": 2469,
            "audio_sample_rate": 44100,
            "audio_bitrate_in_kbps": 320,
            "audio_codec": "aac",
            "height": 720,
            "width": 1280,
            "file_size_in_bytes": 3302623,
            "video_codec": "h264",
            "total_bitrate_in_kbps": 10811,
            "channels": "2",
            "video_bitrate_in_kbps": 10491,
            "state": "finished",
            "md5_checksum": null
         },
         "encodings": [
            {
               "column": "MP4_720",
               "label": "Medium",
               "width": 720,
               "height": 480,
               "codecs": "avc1.42E01E, mp4a.40.2",
               "mime": "video/mp4",
               "always_generate": true,
               "url": "https://dozuki-guide-objects.s3.amazonaws.com/igo/video/slo/E6A54uoeehudCjF1_MP4_720.mp4",
               "format": "mp4"
            },
            {
               "column": "MP4_592",
               "label": "Low",
               "width": 592,
               "height": 444,
               "max_video_bitrate": 1500,
               "codecs": "avc1.42E01E, mp4a.40.2",
               "mime": "video/mp4",
               "always_generate": true,
               "url": "https://dozuki-guide-objects.s3.amazonaws.com/igo/video/slo/E6A54uoeehudCjF1_MP4_592.mp4",
               "format": "mp4"
            },
            {
               "column": "WEBM",
               "label": "Low",
               "width": 592,
               "height": 444,
               "codecs": "vp8, vorbis",
               "mime": "video/webm",
               "always_generate": true,
               "url": "https://dozuki-guide-objects.s3.amazonaws.com/igo/video/slo/E6A54uoeehudCjF1_WEBM.webm",
               "format": "webm"
            },
            {
               "column": "OGG",
               "label": "Low",
               "width": 592,
               "height": 444,
               "codecs": "theora, vorbis",
               "mime": "video/ogg",
               "always_generate": true,
               "url": "https://dozuki-guide-objects.s3.amazonaws.com/igo/video/slo/E6A54uoeehudCjF1_OGG.ogg",
               "format": "ogg"
            },
            {
               "column": "MP4_1280",
               "label": "720p",
               "width": 1280,
               "height": 720,
               "codecs": "avc1.42E01E, mp4a.40.2",
               "mime": "video/mp4",
               "always_generate": false,
               "url": "https://dozuki-guide-objects.s3.amazonaws.com/igo/video/slo/E6A54uoeehudCjF1_MP4_1280.mp4",
               "format": "mp4"
            }
         ]
      },
      outputFields: [
         {key: 'id', label: 'ID'},
         {key: 'video', label: 'Video ID'},
         {key: 'mini', label: 'Mini'},
         {key: 'thumbnail', label: 'Thumbnail'},
         {key: 'standard', label: 'Standard'},
         {key: 'medium', label: 'Medium'},
         {key: 'original', label: 'Original'}
      ],
      perform: checkForNewVideos
   }
};
