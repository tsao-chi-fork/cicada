package xieyuheng.cicada_backup

import collection.immutable.ListMap

import pretty._

object eval {

  def eval(env: Env, exp: Exp): Either[Err, Value] = {
    exp match {
      case Var(name: String) =>
        env.lookup_val(name) match {
          case Some(value) => Right(value)
          case None => Right(NeutralVar(name))
        }

      case Type() =>
        Right(ValueType())

      case Pi(arg_type_map: ListMap[String, Exp], return_type: Exp) =>
        Right(ValuePi(arg_type_map: ListMap[String, Exp], return_type: Exp, env: Env))

      case Fn(arg_type_map: ListMap[String, Exp], body: Exp) =>
        Right(ValueFn(arg_type_map: ListMap[String, Exp], body: Exp, env: Env))

      case Ap(target: Exp, arg_list: List[Exp]) =>
        for {
          value <- eval(env, target)
          arg_list <- util.list_map_maybe_err(arg_list) { eval(env, _) }
          result <- value_apply(value, arg_list)
        } yield result

      case Cl(type_map: ListMap[String, Exp]) =>
        Right(ValueTl(type_map: ListMap[String, Exp], env: Env))

      case Obj(value_map: ListMap[String, Exp]) =>
        for {
          value_map <- util.list_map_map_maybe_err(value_map) {
            case (_name, exp) => eval(env, exp)
          }
        } yield ValueObj(value_map)

      case Dot(target: Exp, field: String) =>
        for {
          value <- eval(env, target)
          result <- value_dot(value, field)
        } yield result

      case Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) =>
        var local_env = env
        for {
          _ <- util.list_map_foreach_maybe_err(block_entry_map) {
            case (name, BlockEntryLet(exp)) =>
              eval(local_env, exp).map {
                case value =>
                  local_env = local_env.ext(name, value)
              }
            case (name, BlockEntryDefine(_t, exp)) =>
              eval(local_env, exp).map {
                case value =>
                  local_env = local_env.ext(name, value)
              }
          }
          result <- eval(local_env, body)
        } yield result
    }
  }

  def value_apply(value: Value, arg_list: List[Value]): Either[Err, Value] = {
    value match {
      case neutral: Neutral => Right(NeutralAp(neutral, arg_list))
      case ValueFn(arg_type_map: ListMap[String, Exp], body: Exp, env: Env) =>
        val name_list = arg_type_map.keys.toList
        if (name_list.length != arg_type_map.size) {
          Left(Err("value_apply fail, ValueFn arity mismatch"))
        } else {
          val map = Map(name_list.zip(arg_list): _*)
          eval(env.ext_map(map), body)
        }
      case ValueTl(type_map: ListMap[String, Exp], env: Env) =>
        val name_list = type_map.keys.toList
        if (name_list.length != type_map.size) {
          Left(Err("value_apply fail, ValueTl arity mismatch"))
        } else {
          val value_map = ListMap(name_list.zip(arg_list): _*)
          Right(ValueObj(value_map))
        }
      case _ => Left(Err(
        "value_apply fail, expecting ValueFn or ValueTl\n" +
          s"value: ${pretty_value(value)}\n"
      ))
    }
  }

  def value_dot(value: Value, field: String): Either[Err, Value] = {
    value match {
      case neutral: Neutral => Right(NeutralDot(neutral, field))
      case ValueObj(value_map: ListMap[String, Value]) =>
        value_map.get(field) match {
          case Some(value) => Right(value)
          case None => Left(Err(s"missing field: ${field}"))
        }
      case _ => Left(Err("value_dot fail, expecting ValueObj"))
    }
  }

}
