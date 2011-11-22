#Interceptor

Interceptor is a proxy written in Node.js for intercepting songs played
on [Turntable](http://turntable.fm) and [Soundcloud](http://soundcloud.com).

##Requirements

    npm install colors commander


##To Use

    node interceptor.js [-d ~/turntable]

Then, you need to configure your machine to use it as a proxy. If you
know how to do this by yourself, interceptor binds to port 8080. Once
Interceptor has bound and has been set as the proxy, visit Turntable or
Soundcloud. On Turntable, you can simply join a room, and Interceptor
will automatically download all the songs played. On Soundcloud, visit
an artist's page and begin playing a song. Interceptor recognizes
the URL of a music file and begins redirecting the download stream not
only to the browser, but also to a file. Interceptor currently supports
music from Turntable's own service, `static.turntable.fm`, Soundcloud,
`ak-media.soundcloud.com`, and MusicNet, `fp-limelight.musicnet.com`.

Both services store and send songs with alphanumeric seemingly
pseudorandom names. Interceptor makes no attempt to change the name of
the file. You can see how file names are chosen in the `mp3_filename()`
function. Names typically follow a pattern that can be used to recognize
the service they are retrieved from. Vanilla Turntable files
(`static.turntable.fm`) can be recognized by their 96 character
alphanumeric name. The URL Turntable uses doesn't include ".mp3", so
Interceptor adds in when downloading. Soundcloud files are also
alphanumeric, but they have only 13 characters. Most files played are
then followed by ".128.mp3". This probably refers to their bitrate.
Finally, MusicNet files (`fp-limelight.musicnet.com`) files are numeric
only, featuring 8 numbers, followed by an underscore, then a number,
typically 14.

Luckily for us, Turntable songs (from both sources) include lots of
metadata. Some of the metadata is inaccurate (indicating a lack of
knowledge on the part of the uploader), but almost all include some kind
of metadata. Unfortunately, we do not have such a luxury when dealing
with Soundcloud. Their files have no metadata at all, and can be
identified only by their presumably unique name. It would be
hypothetically possible to read the metadata from the HTTP stream, but
that is beyond the purview of Interceptor, and would be rather
difficult.

With the -d (or --directory) option, you can set the directory to
download into. Defaults to the current directory.

Works as of 11.21.11.


###Mac

    System Preferences -> Network -> Advanced... -> Proxies -> Web Proxy

Enable Web Proxies, and add `localhost:8080` as the proxy.


##TODO

* Improve proxy documentation. Currently only has instructions for OSX
  Lion.
* Improve streaming. Songs don't load until fully downloaded by the
  browser and Interceptor. Not sure why, but I think it may have
  something to do with the differing ways the Turntable/MusicNet servers
  handle song downloads and how the proxy does.
* Fix Dropbox. Somehow, Interceptor prevents Dropbox from syncing
  completely.
* Memory usage. There may be memory leaks that run into the 1 gig memory
  limit on Node. I haven't tested for the extended periods of time that
  may be necessary to run into this issue.
* Either never closes or fails to report when a file has been downloaded
  successfully.

