import { Evaluable, EvaluationMode } from "../../evaluable"
import { Repr } from "../../repr"
import { Exp } from "../../exp"
import * as Evaluate from "../../evaluate"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Env from "../../env"
import * as Trace from "../../../trace"
import { type_evaluable } from "./type-evaluable"

export type Type = Evaluable &
  Repr & {
    kind: "Exp.type"
  }

export const Type: Type = {
  kind: "Exp.type",
  ...type_evaluable,
  repr: () => "Type",
}
