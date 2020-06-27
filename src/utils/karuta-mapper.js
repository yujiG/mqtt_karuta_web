export default class KarutaMapper {
  constructor (krautas) {
    this.karutas = krautas.map(v => {
      return { karutaId: v.id, users: [] } // users: [{ userId: 21, timeStamp: 1592737893611 }, ...]
    })
    this.userIds = []
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
      return { karutaId: v.karutaId, userId: getMinUserId(v.users) }
    })
  }
}
