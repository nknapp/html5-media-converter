html5-media-converter
=====================

NodeJS module to convert media files into format suitable for web usage.
There is a good article about this topic at [the Mediacru.sh blog](https://blog.mediacru.sh/2013/12/23/The-right-way-to-encode-HTML5-video.html)
and this module tries to apply these best practices.

In order to use it, you'll need a current version of ffmpeg. To cite Mediacru.sh:

    "Please note that you cannot use your distribution-provided ffmpeg package. Read up on compiling
    ffmpeg yourself and make sure you include libx264, fdk-aac, libmp3lame, libvpx, and libopus. Our
    servers and dev machines run Arch Linux and we just install the ffmpeg-full package from the AUR"

Example
=======

The following snippets converts the file `video.avi` to `targetDir/video.mp4`, `targetDir/video.ogv` and `targetDir/video.webm`.
The video is resized to fit into a box of "200x200" pixels.

    var MediaConverter = require("html5-media-converter");
    var mc = new MediaConverter();
    mc.convert("source.avi", "200x200", "targetDir")

The following snippet uses the media-converter with streams and a `.map(...)` function. This snippet is
untested and strongly simplified. It downloads a file from a webserver, converts it to mp4, webm and ogv,
and uploads the result to the server.

    var MediaConverter = require("html5-media-converter");
    var request = require("request");
    var mc = new MediaConverter();
    var converter = mc.asStream("200x200");
    request.get('http://server/original.avi').pipe(converter).map(function(stream) {
        stream.pipe(request.put("http://server/thumbnail"+stream.videoConverter.extName()));
    });

Note that this works on-the-fly for ogv and webm, but the mp4-encoder
cannot directly write to a stream, so the mp4-file is temporary saved into a file before uploading. This, however,
happens automatically (as part of the `process-streams` package) and should not be your concern. There is another issue with decoding certain mp4-videos,
which is described [in this SuperUser-post](http://superuser
.com/questions/479063/ffmpeg-pipe-input-error). The piping-example won't work with these videos.


The MediaConverter can be configured to use other codecs and only a subset of codecs. The following will only
convert to mp4, if that is enough for you.

    var MediaConverter = require("html5-media-converter");
    var request = require("request");
    var mc = new MediaConverter({ videoFormats: ['mp4'] });

There are other options as well. Default default is

    {
        programs: {
            // Path to the ffmpeg program
            ffmpeg: 'ffmpeg',
            // Path the the imagemagick convert program
            convert: 'convert'
        },
        videoFormats: ['mp4', 'ogv', 'webm']
    }

TODO
====
* Add image scaling as well.
* Use input temp-file for unstreamable videos.
* Test cases are not complete yet. They are running the module, but are not really testing the result. I'm not sure, if this is possible at all, but it would
 be good.


*Please note that this api is still experimental. Feedback is welcome, although I cannot guarantee any response times at the moment.*







