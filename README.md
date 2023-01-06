# milestone-sync

This action copies milestones across repositories using the repository it is run in as a source.

The token provided must be a PAT with write to all the relevant repositories.

## Inputs

### `repositories`

**Required** Comma delimited list of repositories to copy to.

### `token`

**Required** Comma delimited list of repositories to copy to.

## Outputs

None at this point

## Example usage

```yaml
uses: actions/milestone-sync@v1.1
with:
  repositories: 'owner/reponame-to-copy-to,org/org-repo-to-copy-to'
```
