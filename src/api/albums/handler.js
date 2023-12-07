class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    const albumId = await this._service.addAlbum(request.payload);
    const response = h.response({
      status: "success",
      data: { albumId },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    return {
      status: "success",
      data: { album },
    };
  }

  putAlbumByIdHandler(request, h) {
    const { id } = request.params;
    this._service.putAlbumById(id, request.payload);
    return {
      status: "success",
      message: "Album berhasil diubah",
    };
  }

  deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    this._service.deleteAlbumById(id);
    return {
      status: "success",
      message: "Album berhasil dihapus",
    };
  }
}

module.exports = AlbumsHandler;
