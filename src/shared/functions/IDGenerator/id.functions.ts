export const generateGUID = function () {
  const part = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  
  return (`${part() + part()}-${part()}-4${part().substr(0, 3)}-${part()}-${part()}${part()}${part()}`).toLowerCase()
}
