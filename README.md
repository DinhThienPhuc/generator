# Geenrator

## Requires

- node: ^12.22.0 || ^14.17.0 || >=16.0.0"
- yarn: v1 or v2

## Setup for specific library

### SonarQube

- Get the project key from https://sonar.software.vmo.dev/, then update `sonar.projectKey` variable:

```
    sonar.projectKey=update-this-with-project-key-from-sonar-page
    sonar.qualitygate.wait=true
```

### ESLint

- Create `.eslintrc.json` file:

```
yarn create @eslint/config
```

- Update eslint config:

```diff
"extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
+   "prettier"
],

...

"rules": {
-   "indent": ["error", 4],
+   "indent": ["error", 2],
    ...
}
```

### CI/CD with GitLab
