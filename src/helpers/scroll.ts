export default (id: string, ms = 340) => {
  const mainPanel = document.querySelector('main')
  const target = document.getElementById(id)
   if (!mainPanel || !target) {
    return
   }
  setTimeout(() => {
    const y = target.offsetTop - 50
    mainPanel.scrollTo({
      top: y,
      left: 0,
      behavior: 'smooth',
    })
  }, ms)
}