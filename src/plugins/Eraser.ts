import Konva from 'konva'
import Plugin from './Plugin'
import { DrawEventPramas, PluginParamName, PluginParamValue } from '../common/type'
import { uuid } from '../common/utils'

export default class Eraser extends Plugin {
  name = 'eraser'
  iconfont = 'iconfont icon-eraser'
  title = '擦除'
  params = ['strokeWidth'] as PluginParamName[]
  defalutParamValue = {
    strokeWidth: 2,
  } as PluginParamValue

  lastLine: any = null
  isPaint = false

  onDrawStart = (drawEventPramas: DrawEventPramas) => {
    const {stage, drawLayer, paramValue} = drawEventPramas
    const pos = stage.getPointerPosition()

    if (!pos) return

    this.isPaint = true
    this.lastLine = new Konva.Line({
      id: uuid(),
      stroke: '#df4b26',
      strokeWidth: (paramValue && paramValue.strokeWidth) ? paramValue.strokeWidth : this.defalutParamValue.strokeWidth,
      globalCompositeOperation: 'destination-out',
      points: [pos.x, pos.y],
    })
    drawLayer.add(this.lastLine)
  }

  onDraw = (drawEventPramas: DrawEventPramas) => {
    const {stage, drawLayer} = drawEventPramas
    const pos = stage.getPointerPosition()

    if (!this.isPaint || !pos) return

    const newPoints = this.lastLine.points().concat([pos.x, pos.y])
    this.lastLine.points(newPoints)
    drawLayer.batchDraw()
  }

  onDrawEnd = (drawEventPramas: DrawEventPramas) => {
    const {historyStack} = drawEventPramas
    this.isPaint = false
    historyStack.push(this.lastLine.toObject())
  }

  onLeave = () => {
    this.isPaint = false
  }
}