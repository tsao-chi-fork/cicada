import { Value } from "../value"
import { Env } from "../env"
import { Mod } from "../mod"
import { JoJo } from "../jos"

export type JoJoValue = Value & {
  kind: "JoJoValue"
  jojo: JoJo
  env: Env
  mod: Mod
}

export function JoJoValue(
  jojo: JoJo,
  the: {
    env: Env
    mod: Mod
  }
): JoJoValue {
  return {
    kind: "JoJoValue",
    jojo,
    env: the.env,
    mod: the.mod,
    execute: (world) => jojo.jos_compose(world),
    repr: () => "#compose " + jojo.repr(),
  }
}