import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const repositories = core.getInput('repositories');

    console.log(`Syncnhronizing milestones to ${repositories}!`);
    const octokit = github.getOctokit(core.getInput('token'))

    // Fetch current milestones.
    const { data: milestones } = await octokit.rest.issues.listMilestones({
      ...github.context.repo
    });

    console.log(milestones);

    const { data: milestone } = await octokit.rest.issues.createMilestone({
      ...github.context.repo,
      title: 'test-milestone'
    });
    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload.issue, undefined, 2)
    console.log(`The event payload: ${milestone}`);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()