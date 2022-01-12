import axios from 'axios'

var instance = axios.create({
    baseURL: 'http://10.2.6.162:3003//',
    timeout: 1000 * 60 * 2,
    headers: {'Content-Type': 'application/json'}
  });

function axiosPost(url, data, callback) {
    instance({
        method: 'post',
        url: url,
        data: data
     })
     .then(function(response) {
      callback (response);
   })
   .catch(function(error){
    console.info(error);
   });
}

function axiosGet(url, callback) {
  instance({
    method:'get',
    url:url,
  })
    .then(function(response) {
      callback (response);
   })
}

function axiosDel(url, callback) {
  instance({
    method:'delete',
    url:url,
  })
    .then(function(response) {
      callback (response);
   })
}

export default {
  axiosPost,
  axiosGet,
  axiosDel
};