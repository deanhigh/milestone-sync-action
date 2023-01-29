import { describe, expect, test } from "@jest/globals";
import { readConfig } from "../config";
describe("config", () => {
  test("load configuration", () => {
    const cfg = readConfig("./src/__tests__/test.cfg");
    expect(cfg.repositories[0]).toStrictEqual({
      name: "repo name",
      owner: "owner or org",
    });
    expect(cfg.repositories[1]).toStrictEqual({
      name: "repo name 2",
      owner: "owner or org 2",
    });
  });
});
