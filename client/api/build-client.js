import axios from 'axios'

export default ({ req }) => {
  if (typeof window === 'undefined') {
    //we are on the server
    return axios.create({
      baseURL: 'http://www.asa-ticketing.ml',
      headers: req.headers
    })
  } 
  
  //we are on browser
  return axios.create({
    baseURL: '/'
  })
}