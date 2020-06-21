import { apiGet, apiPost } from './api-calls'

export const makeGameUrl = async (context) => apiPost(context, 'games')

export const getGameInfo = async (context, payload) => apiGet(context, `games/${payload.gameKey}/${payload.userKey}`)

export const getUserKey = async (context, key) => apiPost(context, 'users', { key })

export const hitKaruta = async (context, payload) => apiPost(context, 'points', { key: payload.userKey, karuta_id: payload.karutaId })
