/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint(
    "songs",
    "fk_songs.album_id_albums.id",
    "foreign key(album_id) references albums(id) on delete cascade"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("songs", "fk_songs.album_id_albums.id");
};
