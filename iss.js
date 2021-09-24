const request = require('request');


const fetchMyIP = (callback) =>{
  request(`https://api64.ipify.org?format=json`, (error, response, body)=> {
    if (error)  callback(error, null);
     
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body);
    callback(null, data.ip);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(`https://freegeoip.app/json/${ip}`, (error, response, body)=> {
    if (error) {
      callback(error, null);
      return;
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const { latitude, longitude } = JSON.parse(body);
    callback(null, { latitude, longitude });
  });
};


  
const fetchISSFlyOverTimes = (coords, callback) =>{
  const url = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
 
  request(url, (error, response, body)=>{
    if (error) {
      callback(error, null);
      return;
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const flyOverData = JSON.parse(body).response;
    callback(null, flyOverData);
  });
};




const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};


module.exports = { nextISSTimesForMyLocation };