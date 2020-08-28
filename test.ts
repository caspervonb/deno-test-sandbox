import * as path from "https://deno.land/std@0.66.0/path/mod.ts";
import { copy } from "https://deno.land/std@0.66.0/fs/mod.ts";

const testdir = Deno.cwd();
const workdir = await Deno.makeTempDir();
await copy(
  path.join(testdir, "fixtures"),
  path.join(workdir, "fixtures"),
);

const pathnames = [
  "fixtures/directory",
  "fixtures/symlink_to_directory",
];

for (const pathname of pathnames) {
  const filepath = path.resolve(workdir, pathname);

  Deno.test(filepath, function() {
    Deno.lstatSync(filepath);
  });

  Deno.test(`run lstat.ts ${filepath}`, async function() {
    const process = Deno.run({
      cwd: workdir,
      cmd: [
	Deno.execPath(),
	"run",
	"--allow-all",
	path.resolve(testdir, "lstat.ts"),
	filepath,
      ],
    });

    await process.status();
    process.close();
  });
}
