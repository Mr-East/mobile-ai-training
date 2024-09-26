/**
 * 引入本地图片
 * @param {*} src
 * @returns
 */
export const getAssetsFile = (url:any) => {
  const urlArr = String(url).split('/') // 通过'/'分割成数组

  const fileName = urlArr.slice(-1)[0] // 获取最后一个值
  return new URL(`../assets/${fileName}`, import.meta.url).href // 使用vite推荐的方法渲染
}