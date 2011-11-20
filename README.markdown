#Interceptor

Interceptor is a proxy written in Node.js for intercepting songs played
on [Turntable](http://turntable.fm).

##Requirements

    npm install colors commander


##To Use

    node interceptor.js [-d ~/turntable]

Then, you need to configure your machine to use it as a proxy. If you
know how to do this by yourself, interceptor binds to port 8080. Once
Interceptor has bound and has been set as the proxy,, visit Turntable in
a browser (which obeys proxies) and choose a room. Each time a new song
comes up, the browser begins downloading the file. Interceptor recognizes
the URL of a music file and begins redirecting the download stream not
only to the browser, but also to a file. Interceptor currently supports
music from Turntable's own service, `static.turntable.fm`, and MusicNet,
`fp-limelight.musicnet.com`.

With the -d (or --directory) option, you can set the directory to
download into. Defaults to the current directory.

Works as of 11.20.11.


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

