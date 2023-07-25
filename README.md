# web

The uesio web site, accessible at https://www.ues.io

## First-time setup

To get your local environment setup, first ensure that:

1. The [ues.io CLI](https://docs.ues.io/using-the-cli) is installed (Run `uesio -h` to ensure it's available)
2. [Node 18+](https://nodejs.org/en/download) is installed
3. You are added to the "Maintainers" team of the "uesio/web" app. Ask someone at ues.io who is a maintainer to add you to the team, then verify that you can access the app by logging in to the Studio and verifying that you can see "uesio/web" as one of the apps.
4. Run this to get setup locally:

```
git clone git@github.com:TheCloudMasters/web.git
cd web
npm run init
```

-   Select "uesio/web" as the app.

## Development

You can develop both locally and/or in the Studio.

1. Pull (Studio to local): `npm run pull`
2. Push (local --> Studio): `npm run push`

## IDE Integration

VS Code is recommended for local development of custom components. TypeScript extensions should be automatically enabled.

To add a custom component

```
uesio generate component
```

Hit enter to select the `main` component pack.

## Continuous integration

The `main` branch will automatically be built and deployed to the `prod` site in the Uesio dev environment (`https://www.ues-dev.io`)

You can also manually initiate this using the ["Manual patch release"](<(./github/workflows/manual_patch_release.yaml)>) workflow, selecting "dev" as the environment

## Release to prod

Use the ["Manual patch release"](./github/workflows/manual_patch_release.yaml) workflow to initiate a Prod deployment to the `prod` site in the Uesio "prod" environment (accessible at `https://www.ues.io`). Select "prod" as the environment target.
