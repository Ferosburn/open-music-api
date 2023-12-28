class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this.storageService = storageService;
    this.albumsService = albumsService;
    this.validator = validator;

    this.postUploadAlbumCoverHandler = this.postUploadAlbumCoverHandler.bind(this);
  }

  async postUploadAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    this.validator.validateImageHeaders(cover.hapi.headers);
    const { id: albumId } = request.params;
    const filename = await this.storageService.writeFile(cover, cover.hapi);
    const url = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
    await this.albumsService.addAlbumCoverUrlById(albumId, url);
    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
