import * as core from '@actions/core'
import * as github from '@actions/github'

export const parseRepositories = (repositories:string) : {name: string, owner: string}[] => {
  if(!repositories) return [];
  const repos = repositories.split(",")
  return repos.map(value => {
    const [owner, name] = value.split("/")
    return {owner, name}
  })
}

async function run(): Promise<void> {
  try {
    const repositoriesInput = core.getInput('repositories');
    const repositories = parseRepositories(repositoriesInput);

    console.log(`Syncnhronizing milestones to ${repositories}!`);

    const octokit = github.getOctokit(core.getInput('token'))
    
    // Fetch current milestones.
    const { data: milestones } = await octokit.rest.issues.listMilestones({
      ...github.context.repo
    });

    console.log(`Milestones in source: ${milestones}`);

    for(const repository of repositories){
      const { data: repoMilestones } = await octokit.rest.issues.listMilestones({
        ...github.context.repo
      });
      console.log(`Milestones for ${repository.owner}/${repository.name}: ${JSON.stringify(repoMilestones, undefined, 2)}`);
    }

    // const { data: milestone } = await octokit.rest.issues.createMilestone({
    //   ...github.context.repo,
    //   title: 'test-milestone'
    // });
    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload.issue, undefined, 2)
    
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}


run()