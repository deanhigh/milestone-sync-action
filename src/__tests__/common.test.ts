import { describe, expect, test } from "@jest/globals";
import { parseRepositories } from "../common";

describe("input parsing", () => {
  test("parse repositories input", () => {
    const repos = parseRepositories("owner/repo1,owner/repo2");
    expect(repos[0]).toStrictEqual({ repo: "repo1", owner: "owner" });
    expect(repos[1]).toStrictEqual({ repo: "repo2", owner: "owner" });
  });
});
