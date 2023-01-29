

import { describe, expect, test } from '@jest/globals';
import { getMilestoneUpdates } from "../src/milestones"

describe("updates", () => {
  test("get milestone single update, nothing new ", () => {
    const milestoneUpdates = getMilestoneUpdates(
      [{ title: "a", description: "new-desc" }],
      [{ number: 1, title: "b" }, { number: 2, title: "a", description: "old-desc" }])
    expect(milestoneUpdates).toStrictEqual({
      "create": [], "update": [{
        "description": "new-desc",
        "milestone_number": 2,
        "title": "a",
      }]
    })
  });

  test("get milestone single update, single create", () => {
    const milestoneUpdates = getMilestoneUpdates(
      [{ title: "a", description: "new-desc" }, { title: "c", description: "c-desc" }],
      [{ number: 1, title: "b" }, { number: 2, title: "a", description: "old-desc" }])
    expect(milestoneUpdates).toStrictEqual({
      "create": [{
        "description": "c-desc",
        "title": "c",
      }], "update": [{
        "description": "new-desc",
        "milestone_number": 2,
        "title": "a",
      }]
    })
  });
});