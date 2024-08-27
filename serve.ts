/*global Bun*/
const BASE_PATH = "./dist";
const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const filePath = BASE_PATH + new URL(req.url).pathname;
    const file = Bun.file(filePath);
    return new Response(file);
  },
  error() {
    return new Response(null, { status: 404 });
  },
});

console.log(`Listening on ${server.url}main.html`);

