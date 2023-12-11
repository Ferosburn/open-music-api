const mapAlbumsDBToAlbumsModel = ({
  id,
  name,
  year,
  created_at,
  updated_at,
}) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapSongsDBToSongsModel = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

const mapSongsDBToSingleSongModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = {
  mapAlbumsDBToAlbumsModel,
  mapSongsDBToSongsModel,
  mapSongsDBToSingleSongModel,
};
