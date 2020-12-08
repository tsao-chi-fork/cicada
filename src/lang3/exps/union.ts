import { Evaluable, EvaluationMode } from "../evaluable"
import { Exp } from "../exp"
import * as Evaluate from "../evaluate"
import * as Explain from "../explain"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Mod from "../mod"
import * as Env from "../env"
import * as Trace from "../../trace"

export type Union = Evaluable & {
  kind: "Exp.union"
  left: Exp
  right: Exp
}

export function Union(left: Exp, right: Exp): Union {
  return {
    kind: "Exp.union",
    left,
    right,
    evaluability: ({ mod, env, mode }) =>
      Value.union(
        Evaluate.evaluate(mod, env, left, { mode }),
        Evaluate.evaluate(mod, env, right, { mode })
      ),
  }
}