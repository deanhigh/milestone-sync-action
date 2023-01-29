import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";

import { parseRepositories } from "./common";

interface Milestone {
  title: string;
  number?: number;
  state?: "open" | "closed" | null;
  description?: string | null;
  due_on?: string | null;
}

type MilestoneCreate = {
  title: string;
  state?: "open" | "closed" | undefined;
  description?: string | undefined;
  due_on?: string | undefined;
};
type MilestoneUpdate = {
  milestone_number: number;
} & MilestoneCreate;

export const getMilestoneUpdates = (
  sourceMilestones: Milestone[],
  existingMilestones: Milestone[]
): { create: MilestoneCreate[]; update: MilestoneUpdate[] } => {
  const combinedTitles = new Set([
    ...sourceMilestones.map((m) => m.title),
    ...existingMilestones.map((m) => m.title),
  ]);
  const sourceMap = Object.assign(
    {},
    ...sourceMilestones.map((x) => ({ [x.title]: x }))
  );
  const existingMap = Object.assign(
    {},
    ...existingMilestones.map((x) => ({ [x.title]: x }))
  );
  const updateOperations: {
    create: MilestoneCreate[];
    update: MilestoneUpdate[];
  } = { create: [], update: [] };

  for (const title of combinedTitles) {
    const existing = existingMap[title];
    const source = sourceMap[title];
    // We need to extract the data into new payload to avoid carrying through fields
    const milestone: MilestoneCreate = {
      title,
    };
    if (source?.description) milestone.description = source.description;
    if (source?.state) milestone.state = source.state;
    if (source?.due_on) milestone.due_on = source.due_on;

    if (
      source &&
      existing &&
      (existing.description !== source.description ||
        existing.due_on !== source.due_on ||
        existing.state !== source.state)
    ) {
      // If exists and something is different overwrite non-id fields and update
      updateOperations.update.push({
        milestone_number: existing.number,
        ...milestone,
      });
    } else if (source && !existing) {
      updateOperations.create.push(milestone);
    }
  }

  return updateOperations;
};

export async function milestonePush(): Promise<void> {
  try {
    const repositoriesInput = getInput("repositories");
    const repositories = parseRepositories(repositoriesInput);

    console.log(
      `copying milestones from source ${JSON.stringify(context.repo)}!`
    );

    const octokit = getOctokit(getInput("token"));

    // Fetch current milestones.
    const { data: sourceMilestones } = await octokit.rest.issues.listMilestones(
      {
        ...context.repo,
      }
    );

    console.log(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `milestones in source: ${sourceMilestones.map((m) => m.title)}`
    );

    for (const repository of repositories) {
      console.log(`fetching milestones from ${JSON.stringify(repository)}`);
      const { data: repoMilestones } = await octokit.rest.issues.listMilestones(
        {
          ...repository,
        }
      );

      const updateOps = getMilestoneUpdates(sourceMilestones, repoMilestones);

      for (const op of updateOps.create) {
        const req = {
          ...repository,
          ...op,
        };
        console.log(`create operation: ${JSON.stringify(req)}`);
        await octokit.rest.issues.createMilestone(req);
      }

      for (const op of updateOps.update) {
        const req = {
          ...repository,
          ...op,
        };
        console.log(`update operation: ${JSON.stringify(req)}`);
        await octokit.rest.issues.updateMilestone(req);
      }
    }
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
}
