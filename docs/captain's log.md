I'm reading Ash Maura's Running Lean, and plan to take advantage of this project as a way to test and apply the techniques in the book.


## Ausgust 18 2012

The idea: client-side file encryption

- **As a browser extension**: intercept uploads + downloads to/from any website
- **As a web app**: central file server that would be singularly resiliant against legal presure, since it would have plausible diability about the files it hosts. 

Limitations in the Chrome extension API prevent me from developing the extension at this time. There is a API change proposed that would allow me to build it, but there are no guaranties if or when it might be implemented.

I built a protoype of the web app in a weekend of hacking, 11 12th August. This is possible due to recent changes in browsers. Such as XHR2, Blobs & ArrayViews. It's up on github.

http://github.com/p3drosola/ice9

**Prototype Specs**

- Build with node.js
- AES encryption with 256 bit keys. CTR block chaining. (PIDCrypt library)
- WebWorkers for non-blocking encryption/decryption
- XHR2 blob uploads & downlaods
- Blob urls + saving
- sexy design

**Still Missing**

- Persistance. All storage is memory based ATM.
- Minimal but solid deployment to stand a Reddit + HackerNews post (Heroku + S3 ?)




