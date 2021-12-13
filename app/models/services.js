const fetch = require("node-fetch");

async function getUnsplashPhoto(name){
    const UNSPLASH_URL = `https://api.unsplash.com/photos/random?client_id=wQuC3g7JmlN_8yTfq4Hk9247zZRTDzpaZSQyE1b32bE&q=${name}`;
  
    const fetchRes = await fetch(UNSPLASH_URL);
    const data = await fetchRes.json();
    return data.urls.small;
  }

  module.exports = { getUnsplashPhoto };