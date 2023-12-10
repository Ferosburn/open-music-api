class AlbumsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    const albumId = await this.service.addAlbum(request.payload);
    const response = h.response({
      status: 'success',
      data: { albumId },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this.service.getAlbumById(id);
    return {
      status: 'success',
      data: { album },
    };
  }

  putAlbumByIdHandler(request) {
    const { id } = request.params;
    this.service.putAlbumById(id, request.payload);
    return {
      status: 'success',
      message: 'Album berhasil diubah',
    };
  }

  deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    this.service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;
