exports.up = (pgm) => {
  pgm.createTable("user_album_likes", {
    id: {
      type: "VARCHAR(30)",
      primaryKey: true,
    },
    user_id: {
      type: "VARCHAR(30)",
      notNull: true,
    },
    album_id: {
      type: "VARCHAR(30)",
      notNull: true,
    },
  });

  pgm.addConstraint(
    "user_album_likes",
    "unique_user_id_and_album_id",
    "unique(user_id, album_id)"
  );

  pgm.addConstraint(
    "user_album_likes",
    "fk_users.id_user_album_likes.user_id",
    "foreign key(user_id) references users(id) on delete cascade"
  )

  pgm.addConstraint(
    "user_album_likes",
    "fk_albums.id_user_album_likes.album_id",
    "foreign key(album_id) references albums(id) on delete cascade"
  )
};

exports.down = (pgm) => {
  pgm.dropTable("user_album_likes");
};
