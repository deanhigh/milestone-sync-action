export const parseRepositories = (
  repositories: string
): Array<{ repo: string; owner: string }> => {
  if (!repositories) return [];
  const repos = repositories.split(",");
  return repos.map((value) => {
    const [owner, repo] = value.split("/");
    return { owner, repo };
  });
};
