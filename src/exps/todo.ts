import {Exp} from "../exp";
import {Ctx} from "../ctx";
import {Value} from "../value";
import {Core} from "../core";
import * as Exps from "./var";
import {TodoCore} from "./todo-core";

export class TODO extends Exp {
    message: string

    constructor(message: string) {
        super()
        this.message = message
    }

    free_names(bound_names: Set<string>): Set<string> {
        return new Set()
    }

    subst(name: string, exp: Exp): Exp {
        return this
    }

    repr(): string {
        return "Type"
    }

    check(ctx: Ctx, t: Value): Core {
        return new TodoCore(this.message)
    }
}
