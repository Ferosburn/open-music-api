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
};

exports.down = (pgm) => {
  pgm.dropTable("user_album_likes");
};
