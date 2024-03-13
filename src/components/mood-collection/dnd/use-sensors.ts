import {
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors as _useSensors,
} from '@dnd-kit/core'

export function useSensors() {
  return _useSensors(useSensor(MouseSensor), useSensor(TouchSensor))
}
