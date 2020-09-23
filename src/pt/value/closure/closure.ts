import * as Env from "../../env"
import * as Mod from "../../mod"
import * as Exp from "../../exp"

export interface Closure {
  name: string
  exp: Exp.Exp
  mod: Mod.Mod
  env: Env.Env
}
