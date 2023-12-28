class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this.producerService = producerService;
    this.playlistsService = playlistsService;
    this.validator = validator;
    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this.validator.validateExportPlaylistsPayload(request.payload);
    const { playlistId } = request.params;
    const { id: userId } = request.auth.credentials;
    await this.playlistsService.verifyPlaylistOwner(playlistId, userId);
    const message = {
      playlistId: request.params.playlistId,
      targetEmail: request.payload.targetEmail,
    };
    await this.producerService.sendMessage(
      'export:playlists',
      JSON.stringify(message),
    );
    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
