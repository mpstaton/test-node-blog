
const http = require('http');
const express = require('express');
const router = express.Router();
const morgan = require('morgan');

const app = express();

const blogPostsRouter = require('./routers/blogPostsRouter');

const {BlogPosts} = require('./models');

// log the http layer
app.use(morgan('common'));

app.use(express.static('public'));


//using router to manage http requests to BlogPosts
app.use('/blog-posts', blogPostsRouter);

// this function starts our server and returns a Promise.
// In our test code, we need a way of asynchrnously starting
// our server, since we'll be dealing with promises there.
/*
function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve();
    })
    .on('error', err => {
      reject(err);
    });
  });
}
*/

BlogPosts.create('January Blog', 'Lorem Ipsum for January', 'Michael Staton');
BlogPosts.create('February Blog', 'Lorem Ipsum for February', 'Michael Staton');
BlogPosts.create('March Blog', 'Lorem Ipsum for March', 'Michael Staton');

// both runServer and closeServer need to access the same
// server object, so we declare `server` here, and then when
// runServer runs, it assigns a value.
let server;

function runServer() {
  const port = 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
