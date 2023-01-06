import * as core from '@actions/core'
import * as github from '@actions/github'
import { sortAndDeduplicateDiagnostics } from 'typescript';


export const parseRepositories = (repositories: string): { repo: string, owner: string }[] => {
  if (!repositories) return [];
  const repos = repositories.split(",")
  return repos.map(value => {
    const [owner, repo] = value.split("/")
    return { owner, repo }
  })
}

interface Milestone {
  title: string;
  number?: number
  state?: "open" | "closed" | null;
  description?: string | null;
  due_on?: string | null;
}

type MilestoneCreate = {
  title: string;
  state?: "open" | "closed" | undefined;
  description?: string | undefined;
  due_on?: string | undefined;
}
type MilestoneUpdate = {
  milestone_number: number;
} & MilestoneCreate;




export const getMilestoneUpdates = (sourceMilestones: Milestone[], existingMilestones: Milestone[]): { create: MilestoneCreate[], update: MilestoneUpdate[] } => {
  const combinedTitles = new Set([...sourceMilestones.map(m => m.title), ...existingMilestones.map(m => m.title)])
  let sourceMap = Object.assign({}, ...sourceMilestones.map((x) => ({ [x.title]: x })));
  let existingMap = Object.assign({}, ...existingMilestones.map((x) => ({ [x.title]: x })));
  let updateOperations: { create: MilestoneCreate[], update: MilestoneUpdate[] } = { create: [], update: [] }

  combinedTitles.forEach(title => {
    const existing = existingMap[title]
    const source = sourceMap[title]
    // We need to extract the data into new payload to avoid carrying through fields
    const milestone:MilestoneCreate = {
      title
    }
    if( source?.description ) milestone.description = source.description
    if( source?.state ) milestone.state = source.state
    if( source?.due_on ) milestone.due_on = source.due_on

    if (source && existing &&
      (existing.description !== source.description ||
        existing.due_on !== source.due_on ||
        existing.state !== source.state)) {
      // If exists and something is different overwrite non-id fields and update
      updateOperations.update.push({
        milestone_number: existing.number, 
        ...milestone
      })
    } else if (source && !existing) {
      updateOperations.create.push(milestone)
    }
  });

  return updateOperations
}

async function run(): Promise<void> {
  try {
    const repositoriesInput = core.getInput('repositories');
    const repositories = parseRepositories(repositoriesInput);

    console.log(`copying milestones from source ${JSON.stringify(github.context.repo)}!`);

    const octokit = github.getOctokit(core.getInput('token'))

    // Fetch current milestones.
    const { data: sourceMilestones } = await octokit.rest.issues.listMilestones({
      ...github.context.repo
    });

    console.log(`milestones in source: ${sourceMilestones.map(m => m.title)}`);

    for (const repository of repositories) {
      console.log(`fetching milestones from ${JSON.stringify(repository)}`)
      const { data: repoMilestones } = await octokit.rest.issues.listMilestones({
        ...repository
      });

      const updateOps = getMilestoneUpdates(sourceMilestones, repoMilestones);

      for (const op of updateOps.create) {
        const req = {
          ...repository,
          ...op
        }
        console.log(`create operation: ${JSON.stringify(req)}`)
        await octokit.rest.issues.createMilestone(req);
      }

      for (const op of updateOps.update) {
        const req = {
          ...repository,
          ...op
        }
        console.log(`update operation: ${JSON.stringify(req)}`)
        await octokit.rest.issues.updateMilestone(req);
      }
    }

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}


run()