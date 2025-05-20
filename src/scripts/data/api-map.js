import { getPlaceNameByCoor } from '../utils/map-utils.js';

export async function storyMapper(story) {
  const { lat = null, lon = null } = story;

  const hasCoordinates = lat !== null && lon !== null;
  const placeName = hasCoordinates
    ? await getPlaceNameByCoor(lat, lon)
    : "Lokasi tidak ada";

  return {
    ...story,
    location: {
      latitude: lat,
      longitude: lon,
      placeName,
    },
  };
}
