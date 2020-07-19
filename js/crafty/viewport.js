export function centerViewportOnScene(staticSceneWidth, staticSceneHeight) {
  const scaledViewportWidth = Crafty.viewport.width / Crafty.viewport._scale
  Crafty.viewport.x = Math.abs(staticSceneWidth - scaledViewportWidth) / 2
  const scaledViewportHeight = Crafty.viewport.height / Crafty.viewport._scale
  Crafty.viewport.y = Math.abs(staticSceneHeight - scaledViewportHeight) / 2
}

export function fitViewportToScene(staticSceneWidth, staticSceneHeight) {
  const heightScale = Crafty.viewport.height / staticSceneHeight
  const widthScale = Crafty.viewport.width / staticSceneWidth
  if (heightScale < widthScale) {
    Crafty.viewport.scale(heightScale)
  } else {
    Crafty.viewport.scale(widthScale)
  }
  centerViewportOnScene(staticSceneWidth, staticSceneHeight)
}
