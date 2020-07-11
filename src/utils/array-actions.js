export const shuffle = (array) => {
  return [...Array(array.length)].flatMap(() => {
    const index = Math.floor(Math.random() * array.length)
    return array.splice(index, 1)
  })
}
