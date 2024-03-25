import returnTimeExpirationResponse from "../utils/returnTimeExpirationResponse.js";

const TimeExpirationHandler = (sharedFile, socket) => {
  const fileExpirationTime = Number.parseInt(
    sharedFile["shareAttributes"]["time"]["expiration"]
  );
  const currentTime = new Date().getTime();
  if (currentTime > fileExpirationTime) {
    returnTimeExpirationResponse(sharedFile, false, socket);
    return;
  }
  setTimeout(() => {
    console.log("----File share expired------");
    returnTimeExpirationResponse(sharedFile, false, socket);
  }, fileExpirationTime - currentTime);

  console.log("----------User can access the file--------");
  console.log("----------SHARE ID-------", sharedFile._id);
  returnTimeExpirationResponse(sharedFile, true, socket);
};

export default TimeExpirationHandler;
