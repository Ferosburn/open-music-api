class SongsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    this.validator.validateSongPayload(request.payload);
    const songId = await this.service.addSong(request.payload);
    const response = h.response({
      status: 'success',
      data: { songId },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler() {
    const songs = await this.service.getSongs();
    return {
      status: 'success',
      data: { songs },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this.service.getSongById(id);
    return {
      status: 'success',
      data: { song },
    };
  }

  async putSongByIdHandler(request) {
    this.validator.validateSongPayload(request.payload);
    const { id } = request.params;
    await this.service.editSongById(id, request.payload);
    return {
      status: 'success',
      message: 'Lagu berhasil diubah',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this.service.deleteSongById(id);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
