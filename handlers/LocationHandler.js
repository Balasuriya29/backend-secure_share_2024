import haversine from "haversine-distance";
const LocationHandler = (sharedFile, currentLocation) => {
  const { latitude, longitude, radius } =
    sharedFile["shareAttributes"]["geoFence"];

  const accessibleLocation = {
    latitude: latitude,
    longitude: longitude,
  };
  const accessibleRadius = Number.parseInt(radius);

  const incomingLocation = {
    latitude: parseFloat(currentLocation["latitude"]),
    longitude: parseFloat(currentLocation["longitude"]),
  };

  const distance = haversine(incomingLocation, accessibleLocation);

  console.log("----db location----");
  console.log(accessibleLocation);

  console.log("----incoming location----");
  console.log(incomingLocation);

  console.log(distance);
  console.log(accessibleRadius);

  if (distance <= accessibleRadius) {
    return { allowAccess: true };
  } else {
    return { allowAccess: false, message: "Out of the geofence" };
  }
};

export default LocationHandler;
