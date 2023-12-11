const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { mapSongsDBToSongsModel, mapSongsDBToSingleSongModel } = require('../utils');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this.pool = new Pool();
  }

  async addSong({
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'insert into songs values($1, $2, $3, $4, $5, $6, $7, $8, $9) returning id',
      values: [
        id,
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this.pool.query('select * from songs');
    return result.rows.map(mapSongsDBToSongsModel);
  }

  async getSongById(id) {
    const query = {
      text: 'select * from songs where id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows.map(mapSongsDBToSingleSongModel)[0];
  }

  async editSongById(
    id,
    {
      title,
      year,
      genre,
      performer,
      duration = null,
      albumId = null,
    },
  ) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'update songs set title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 where id = $8 returning id',
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal diubah. Song tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'delete from songs where id = $1 returning id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Song tidak ditemukan');
    }
  }
}

module.exports = SongsService;
