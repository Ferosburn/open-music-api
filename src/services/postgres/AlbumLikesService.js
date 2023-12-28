const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumLikesService {
  constructor() {
    this.pool = new Pool();
  }

  async likeAnAlbum(userId, albumId) {
    const id = nanoid(16);
    const query = {
      text: 'insert into user_album_likes values($1, $2, $3) returning id',
      values: [id, userId, albumId],
    };
    const result = await this.pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menyukai album');
    }
  }

  async unlikeAnAlbum(userId, albumId) {
    const query = {
      text: `delete from user_album_likes
      where user_id = $1 and album_id = $2 returning id`,
      values: [userId, albumId],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menghapus suka dari album');
    }
  }

  async getLikeNumberOfAnAlbum(albumId) {
    const query = {
      text: 'select * from user_album_likes where album_id = $1',
      values: [albumId],
    };
    const result = await this.pool.query(query);
    return { likes: result.rowCount };
  }

  async verifyAlbumLike(userId, albumId) {
    const query = {
      text: `select * from user_album_likes
      where user_id = $1 and album_id = $2`,
      values: [userId, albumId],
    };
    const result = await this.pool.query(query);
    if (result.rowCount) {
      throw new InvariantError('Gagal menyukai album, album sudah disukai');
    }
  }
}

module.exports = AlbumLikesService;
