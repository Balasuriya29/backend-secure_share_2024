import haversine from "haversine-distance";
const LocationHandler = (data,socket) => {
    console.log(data["latitude"]);
    console.log(data["longitude"]);
    const accessibleLocation = {
        latitude:12.964533546012508, 
        longitude: 80.25026306019454
    };
    const accessibleRadius = 5000;
    const incomingLocation = {
        latitude: parseFloat(data["latitude"]),
        longitude: parseFloat(data["longitude"]),
      };
    
      const distance = haversine(incomingLocation, accessibleLocation);
    
      if (distance <= accessibleRadius) {
        console.log('Client is within the accessible radius.');
      } else {
        console.log('Client is outside the accessible radius.');
      }
}

export default LocationHandler;