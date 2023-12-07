const routes = require("./routes");
const AlbumsHandler = require("./handler");

module.exports = {
  name: "notes",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const albumsHandler = new AlbumsHandler(service, validator);
    server.route(routes(albumsHandler));
  },
};
