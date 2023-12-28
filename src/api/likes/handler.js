class AlbumLikesHandler {
  constructor(albumLikesService, albumsService) {
    this.albumLikesService = albumLikesService;
    this.albumsService = albumsService;

    this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this);
    this.deleteAlbumLikeHandler = this.deleteAlbumLikeHandler.bind(this);
    this.getAlbumLikeHandler = this.getAlbumLikeHandler.bind(this);
  }

  async postAlbumLikeHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;
    await this.albumsService.getAlbumById(albumId);
    await this.albumLikesService.verifyAlbumLike(userId, albumId);
    await this.albumLikesService.likeAnAlbum(userId, albumId);
    const response = h.response({
      status: 'success',
      message: 'Berhasil menyukai album',
    });
    response.code(201);
    return response;
  }

  async deleteAlbumLikeHandler(request) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;
    await this.albumLikesService.unlikeAnAlbum(userId, albumId);
    return {
      status: 'success',
      message: 'Berhasil menghapus suka dari album',
    };
  }

  async getAlbumLikeHandler(request) {
    const { id: albumId } = request.params;
    await this.albumsService.getAlbumById(albumId);
    const likes = await this.albumLikesService.getLikeNumberOfAnAlbum(
      albumId,
    );
    return {
      status: 'success',
      data: likes,
    };
  }
}

module.exports = AlbumLikesHandler;
