import { apiGet, apiPost } from './api-calls'

export const makeGameUrl = async (context) => apiPost(context, 'games')

export const getGameInfo = async (context, key) => {
  return apiGet(context, `games/${key}`)
}
