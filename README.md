<p align="center">
  <a href="https://tastebuddy.williamcougan.com/">
    <img alt="TasteBuddy" src="src/images/icon.jpg" width="60" />
  </a>
</p>
<h1 align="center">
  TasteBuddy <em>Web Frontend</em>
</h1>

## Env Config

| Key                | .env.development                                        | .env.production |
| ------------------ | ------------------------------------------------------- | --------------- |
| GA_MEASUREMENT_ID  |                                                         | Get from GA     |
| TASTEBUDDY_API_URL | Get from AWS                                            | Get from AWS    |
| MOCK_API_RESPONSE  | Only provide if mocking, any value will resolve to true |                 |

Shared Endpoints:

- Places
- Feedback

## Scripts

| Script      | Description                                         |
| ----------- | --------------------------------------------------- |
| `develop`   | Run dev server (w/ network)                         |
| `start`     | Run dev server                                      |
| `build`     | Build for prod (prod build w/ prod .env)            |
| `build-dev` | Build for dev (prod build w/ dev .env)              |
| `serve`     | Serve built artifact locally (w/ network)           |
| `clean`     | Clean using Gatsby's clean command                  |
| `deploy`    | Prod deploy (build for prod and deploy to gh-pages) |

- See [the Gatsby docs](https://www.gatsbyjs.com/docs/reference/gatsby-cli/#develop) for context around `develop` "w/ network"
- See [the Gatsby docs](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/#additional-environments-staging-test-etc) for context around `build-dev` "prod build w/ dev .env"

Additional Reference:

- [Gatsby Commands](https://www.gatsbyjs.com/docs/reference/gatsby-cli/)
- [GitHub Pages Command](https://github.com/tschaub/gh-pages)
