# Instar Summary

## stmts

- @def name exp
- @show exp

## exps

type:
- Type

let:
- @let name exp exp

the:
- @the t exp

pi:
- @pi name arg_t ret_t
- @arrow arg_t ret_t
- @fn name ret
  - (name) => ret
- @ap target arg
  - target(arg)
  - target(arg, ...)

sigma:
- @sigma name car_t cdr_t
  - (name: car_t) * cdr_t
- Pair(car_t, cdr_t)
  - (car_t) * cdr_t
- cons(car, cdr)
- car(target)
- cdr(target)

equal:
- Equal(t, from, to)
- same
- replace(target, motive, base)

absurd:
- Absurd
- absurd_ind(target, motive)

nat:
- Nat
- zero
- add1(prev)
- nat_ind(target, motive, base, step)

string:
- String
- "..."

trivial:
- Trivial
- sole