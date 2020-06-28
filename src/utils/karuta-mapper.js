export default class KarutaMapper {
  constructor (krautas, users, points) {
    this.karutas = krautas.map(v => {
      const users = []
      const hittedPoint = points.find(point => point.karuta_id === v.id)
      if (hittedPoint) users.push({ userId: hittedPoint.user_id, timeStamp: 0 })
      return { karutaId: v.id, name: v.name, users: users } // users: [{ userId: 21, timeStamp: 1592737893611 }, ...]
    })
    this.userIds = users.map(v => v.id)
  }
  hitKaruta (karutaId, userId, timeStamp) {
    if (!this.userIds.includes(userId)) this.userIds.push(userId)
    const karuta = this.karutas.find(v => v.karutaId === karutaId && !v.users.find(user => user.userId !== userId))
    if (!karuta) return
    karuta.users.push({ userId, timeStamp })
  }
  get usersInfo () {
    return this.userIds.map(id => {
      const karutaIds = this.karutasMinUserId.filter(v => v.userId === id).map(v => v.karutaId)
      return { userId: id, points: karutaIds.length, karutaIds }
    })
  }
  get karutasMinUserId () {
    const getMinUserId = (array) => {
      if (array.length === 0) return null
      return array.reduce((x, y) => x.timeStamp < y.timeStamp ? x : y).userId
    }
    return this.karutas.map(v => {
      return { karutaId: v.karutaId, name: v.name, userId: getMinUserId(v.users) }
    })
  }
}
