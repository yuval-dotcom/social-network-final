import { describe, expect, it } from "vitest";
import { createStatsController } from "./statsController.js";

function createRes() {
  return {
    body: undefined,
    json(payload) {
      this.body = payload;
    }
  };
}

describe("stats controller", () => {
  it("counts posts by month", async () => {
    const controller = createStatsController({
      posts: {
        async list() {
          return [
            { id: "p1", createdAt: "2026-06-01" },
            { id: "p2", createdAt: "2026-06-20" },
            { id: "p3", createdAt: "2026-07-01" }
          ];
        }
      },
      groups: {}
    });
    const res = createRes();

    await controller.postsByMonth({ db: {} }, res, () => {});

    expect(res.body.data).toEqual([
      { month: "2026-06", count: 2 },
      { month: "2026-07", count: 1 }
    ]);
  });

  it("counts posts by group", async () => {
    const controller = createStatsController({
      posts: {
        async list() {
          return [{ groupId: "g1" }, { groupId: "g1" }, { groupId: "g2" }];
        }
      },
      groups: {
        async list() {
          return [{ id: "g1", name: "Algorithms" }];
        }
      }
    });
    const res = createRes();

    await controller.postsByGroup({ db: {} }, res, () => {});

    expect(res.body.data).toEqual([
      { groupId: "g1", groupName: "Algorithms", count: 2 },
      { groupId: "g2", groupName: "g2", count: 1 }
    ]);
  });
});
