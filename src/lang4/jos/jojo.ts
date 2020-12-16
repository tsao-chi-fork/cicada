import { Jo } from "../jo"
import { World } from "../world"
import { JoJoComposabilityValue } from "../values/jojo-composability-value"
import { JoJoCuttabilityValue } from "../values/jojo-cuttability-value"

export type JoJo = Jo & {
  array: Array<Jo>
}

export function JoJo(array: Array<Jo>): JoJo {
  return {
    array,
    composability: (world) =>
      world.value_stack_push(
        JoJoComposabilityValue(array, {
          env: world.env,
          mod: world.mod,
        })
      ),
    cuttability: (world) =>
      world.value_stack_push(
        JoJoCuttabilityValue(array, {
          env: world.env,
          mod: world.mod,
        })
      ),
  }
}
