# Sorbet's Web App

A containerized NextJS web app for Sorbet. Live at [mysorbet.io](https://mysorbet.io).

Using [shadcn/ui](https://ui.shadcn.com/), [TailwindCSS](https://tailwindcss.com/), [React Query](https://tanstack.com/query/latest/docs/framework/react/overview), and [Privy](https://www.privy.io/).

## 🔨 Development

### 🔥 Quickstart

> [!NOTE]
> We use [`corepack`](https://yarnpkg.com/corepack) to ensure everyone is using the same version of yarn.
> Before continuing, install it with `brew install corepack && corepack enable`.

> [!NOTE]
> We use [`gcloud cli`](https://cloud.google.com/sdk/docs/install) to store and access environment variables and secrets.
> Before continuing, install it by following the instructions [here](https://cloud.google.com/sdk/docs/install). You should have authorized access to the sorbet-production project. Considering verifying you access with the engineering team.

1. Clone the repo with `git clone https://github.com/MySorbet/sorbet-app.git`.
2. Install dependencies with `yarn install`.
3. Run `yarn env` to get the latest environment variables.
   > Note: You can perform this step manually by copying `.env.example` to a new `.env` file and replacing the contents with those in [Google Secrets Manager](https://console.cloud.google.com/security/secret-manager?project=sorbet-production).
4. Start a hot reloading dev server with `yarn dev`.

### ⏳ Posterity

Originally, this project was based on the GitHub project [ts-nextjs-tailwind-starter](https://github.com/theodorusclarence/ts-nextjs-tailwind-starter/).
