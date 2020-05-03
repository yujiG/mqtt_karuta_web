import axios from 'axios'
const apiServer = process.env.API_SERVER

export const apiGet = async (_context, path, options = {}) => {
  try {
    const response = await axios.get(`${apiServer}/${path}`, options)
    return response.data
  } catch (e) {
    throw e
  }
}

export const apiPost = async (_context, path, params = {}, options = {}) => {
  try {
    const response = await axios.post(`${apiServer}/${path}`, params, options)
    return response.data
  } catch (e) {
    throw e
  }
}
