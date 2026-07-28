const { parse } = require("url");

// cPanel Passenger passes PORT env variable
const port = process.env.PORT || 3000;

// Import the Next.js standalone server
const next = require("./server.js");

// Start the server
const app = next.default || next;
const handle = app.getRequestHandler();

app.prepare().then(() => {
  require("http")
    .createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    })
    .listen(port, () => {
      console.log(`> bot.fun Dashboard ready on port ${port}`);
    });
});