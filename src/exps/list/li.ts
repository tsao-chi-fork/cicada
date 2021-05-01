import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { infer } from "../../infer"
import { Value } from "../../value"
import { ListValue, LiValue } from "../../cores"

export class Li extends Exp {
  head: Exp
  tail: Exp

  constructor(head: Exp, tail: Exp) {
    super()
    this.head = head
    this.tail = tail
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return new LiValue(
      evaluate(ctx, env, this.head),
      evaluate(ctx, env, this.tail)
    )
  }

  infer(ctx: Ctx): Value {
    const elem_t = infer(ctx, this.head)
    check(ctx, this.tail, new ListValue(elem_t))
    return new ListValue(elem_t)
  }

  repr(): string {
    return `li(${this.head.repr()}, ${this.tail.repr()})`
  }
}