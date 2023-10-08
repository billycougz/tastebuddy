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

## Auth
The app uses one Cognito pool for both dev and prod.
- See [Social sign-in (OAuth)](https://docs.amplify.aws/lib/auth/social/q/platform/js/)
- See OAuth provider portals (Google, Facebook, etc.)
- See AWS resources
  - Cognito
  - API Gateway
  - SES (for email verification)
  - Route 53 (for auth domain)
  - Amplify (for auth library)

### src/aws-exports.js 
Used by the `aws-amplify` library to configure Auth.

Ignored by git.
```js
/**
 * aws_user_pools_id - Cognito User Pool > General Settings > Pool Id
 * aws_user_pools_web_client_id - Cognito User Pool > App Integration > App Client Id
 * domain - Cognito User Pool > App Integration > Domain name (don't include https://)
 * redirectSignIn - stage specific host url
 * redirectSignOut - stage specific host url
 */ 
const awsmobile = {
	aws_project_region: 'us-east-1',
	aws_cognito_region: 'us-east-1',
	aws_user_pools_id: '',
	aws_user_pools_web_client_id: '',
	oauth: {
		domain: '',
		scope: ['openid', 'email', 'profile'],
		redirectSignIn: '',
		redirectSignOut: '',
		responseType: 'code',
	},
};

export default awsmobile;
```