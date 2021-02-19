const fs = require("fs");
const chalk = require("chalk");
const targetDir = process.argv[2] || process.cwd();
const path = require("path");

const { lstat } = fs.promises;

fs.readdir(targetDir, async (err, filenames) => {
  if (err) {
    console.log(err);
  }

  const statPromises = filenames.map((filename) => {
    return lstat(path.join(targetDir, filename));
  });

  const allStats = await Promise.all(statPromises);

  for (let stats of allStats) {
    const index = allStats.indexOf(stats);

    if (stats.isFile()) {
      console.log(chalk.cyan(filenames[index]));
    } else {
      console.log(chalk.magenta(filenames[index]));
    }
  }
});
