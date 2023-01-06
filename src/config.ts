import * as yaml from "js-yaml";
import * as fs from "fs";

export interface Config {
    repositories?: Array<{
        owner: string;
        name: string;
    }>;
}

export const readConfig = (configFile:string) => {
    return yaml.load(fs.readFileSync(configFile, "utf8")) as Config
}