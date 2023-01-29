import { readFileSync } from "fs";

import { load } from "js-yaml";

export interface Config {
  repositories?: Array<{
    owner: string;
    name: string;
  }>;
}

export const readConfig = (configFile: string) => {
  return load(readFileSync(configFile, "utf8")) as Config;
};
