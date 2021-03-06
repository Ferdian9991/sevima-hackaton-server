require("dotenv").config({
  path: "../../.env",
});
const { existsSync, mkdirSync, writeFileSync } = require("fs");
const shell = require("shelljs");
const { join } = require("path");
const dayjs = require("dayjs");
const mongoose = require("mongoose");
const getCollection = require("../connection").collectionLists;
require("../connection").connect();
require("../schema/init").init();

const sortArray = (value) => {
  const sort = value.sort(function (a, b) {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });
  return sort;
};

const start = async () => {
  const dirname = `DB-${dayjs().format("YYYY-MM-DD")}`;
  const filename = `DB-${dayjs().format("YYYY-MM-DD")}`;

  try {
    const backupPath = join(__dirname, "../../database", "backup");
    if (!existsSync(backupPath)) {
      mkdirSync(backupPath, {
        recursive: true,
      });
    }

    const dbPath = `${process.cwd()}/database/backup/${dirname}`;

    if (existsSync(dbPath)) {
      shell.exec(`rm -rf ${dbPath}`);
    }

    console.log(dbPath);
    mkdirSync(dbPath, {
      recursive: true,
    });

    const models = sortArray(mongoose.modelNames());

    for (const model of models) {
      const getModel = mongoose.model(model);
      const data = await getModel.find({});
      if (data.length > 0) {
        writeFileSync(`${dbPath}/${model}.json`, JSON.stringify(data));
      }
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Successfully created backup database: ${filename}`);
  process.exit();
};
start();
