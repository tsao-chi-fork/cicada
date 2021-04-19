import { LocalLibrary } from "./local-library"
import Path from "path"
import * as ut from "../ut"

async function test_create(): Promise<void> {
  const file = "../../stdlib/library.json"
  const lib = await LocalLibrary.from_config_file(Path.resolve(__dirname, file))

  const root_dir = "../../stdlib"
  ut.assert_equal(lib.root_dir, Path.resolve(__dirname, root_dir))
  ut.assert_equal(lib.config.name, "Cicada Language Standard Library")
}

test_create().catch((error) => {
  console.error(error)
  process.exit(1)
})

async function test_load(): Promise<void> {
  const file = "../../stdlib/library.json"
  const lib = await LocalLibrary.from_config_file(Path.resolve(__dirname, file))
  const mod = await lib.load("category/category.cic")
  const cached = await lib.load("category/category.cic")
  ut.assert_equal(mod === cached, true)
}

test_load().catch((error) => {
  console.error(error)
  process.exit(1)
})

async function test_import(): Promise<void> {
  const file = "../../stdlib/library.json"
  const lib = await LocalLibrary.from_config_file(Path.resolve(__dirname, file))
  const mod = await lib.load("category/functor.cic")
  const cached = await lib.load("category/functor.cic")
  ut.assert_equal(mod === cached, true)
}

test_import().catch((error) => {
  console.error(error)
  process.exit(1)
})
