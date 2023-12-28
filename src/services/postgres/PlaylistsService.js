const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this.pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'insert into playlists values($1, $2, $3) returning id',
      values: [id, name, owner],
    };
    const result = await this.pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `select playlists.id, playlists.name, users.username
      from playlists
      left join users on users.id = playlists.owner
      where playlists.owner = $1`,
      values: [owner],
    };
    const result = await this.pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'delete from playlists where id = $1 returning id',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError(
        'Playlist gagal dihapus, Playlist tidak ditemukan',
      );
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = nanoid(16);
    const songQuery = {
      text: 'select * from songs where id = $1',
      values: [songId],
    };
    const song = await this.pool.query(songQuery);
    if (!song.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    const query = {
      text: 'insert into playlist_songs values($1, $2, $3) returning id',
      values: [id, playlistId, songId],
    };
    const result = await this.pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke dalam playlist');
    }
  }

  async getPlaylistSongs(playlistId) {
    const playlistQuery = {
      text: `select playlists.id, playlists.name, users.username
      from playlists
      left join users on users.id = playlists.owner
      where playlists.id = $1`,
      values: [playlistId],
    };
    const result = await this.pool.query(playlistQuery);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const { id, name, username } = result.rows[0];
    const songsQuery = {
      text: `select songs.id, songs.title, songs.performer
      from playlist_songs
      left join songs on songs.id = playlist_songs.song_id
      where playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };
    const songs = await this.pool.query(songsQuery);
    return {
      id,
      name,
      username,
      songs: songs.rows,
    };
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: `delete from playlist_songs
      where playlist_id = $1 and song_id = $2 returning id`,
      values: [playlistId, songId],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal dihapus dari playlist');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'select * from playlists where id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resources ini');
    }
  }
}

module.exports = PlaylistsService;
