# Multi-repo project actions.

This action copies milestones across repositories using the repository it is run in as a source.

> The token provided must be a PAT with relevant access to all the relevant repositories. (TBD)

## milestone-push

Push milestones from a source repository to configured sink repositories.

### Inputs

#### `repositories`

**Required** Comma delimited list of repositories to copy to.

#### `token`

**Required** Comma delimited list of repositories to copy to.

### Outputs

None at this point

### Example usage

```yaml
uses: actions/milestone-sync@v1.1
with:
  repositories: 'owner/reponame-to-copy-to,org/org-repo-to-copy-to'
```

## label-push

Push milestones from a source repository to configured sink repositories.

### Inputs

#### `repositories`

**Required** Comma delimited list of repositories to copy to.

#### `token`

**Required** Comma delimited list of repositories to copy to.

### Outputs

None at this point

### Example usage

```yaml
uses: actions/milestone-sync@v1.1
with:
  repositories: 'owner/reponame-to-copy-to,org/org-repo-to-copy-to'
```

## Token Access

When creating a token assign it the relevant access across all the repositories it will be accessing. See below for list of grants:

- TBD
- TBD
