

import { describe, expect, test } from '@jest/globals';
import { parseRepositories } from "../src/main"
describe("main util functions", () => {
  test("load configuratio", () => {
    const repos = parseRepositories("owner/repo1,owner/repo2")
    expect(repos[0]).toStrictEqual({ "name": "repo1", "owner": "owner" })
    expect(repos[1]).toStrictEqual({ "name": "repo2", "owner": "owner" })
  });
});