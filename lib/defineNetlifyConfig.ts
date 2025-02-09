import { vanillaExtractPlugin as vanilla } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import type { ConfigEnv, PluginOption, UserConfig } from "vite";

export function defineNetlifyConfig(props: {
  /**
   * The server port number.
   *
   * Game apps start from 8000, automation apps from 9000. So far, we got:
   *
   * - API: 8000
   * - Hobgoblin: 8001
   * - Eternol: 8002
   * - Gregbot: 9000
   */
  port: number;

  /**
   * By default, react and vanilla extract are always configured.
   */
  additionalPlugins?: PluginOption[];

  /**
   * Can be used to import from `@` at the path specified here. Has to match
   * tsconfig > compilerOptions > paths.
   *
   * Do not use this, just use relative imports.
   *
   * @deprecated
   */
  resolveAlias?: string;

  /**
   * Determines whether input is "/index.html", or "index.html" or
   * "/src/main.tsx" depnending on command.
   *
   * This is useful when using pre-rendered HTML as input.
   */
  conditionalInput?: boolean;
}) {
  const {
    additionalPlugins = [],
    conditionalInput = false,
    resolveAlias,
  } = props;

  return function configureVite({ command }: ConfigEnv): UserConfig {
    return {
      define: {
        // These vars are supplied by Netlify
        BRANCH: JSON.stringify(process.env.BRANCH),
        COMMIT_SHORTCODE: JSON.stringify(process.env.COMMIT_REF?.slice(0, 7)),
      },

      plugins: [react(), vanilla(), ...additionalPlugins],

      esbuild: {
        target: "es2022",
      },

      server: {
        port: props.port,
      },

      resolve: {
        alias: resolveAlias ? { "@": resolveAlias } : undefined,
      },

      build: {
        sourcemap: true,
        manifest: true,
        rollupOptions: {
          // During `build`, we want to only deal with JS files. Production HTML
          // entrypoint is generated via the `build:entrypoint` package script.
          input:
            conditionalInput && command === "build"
              ? "/src/main.tsx"
              : "/index.html",
        },
      },
    };
  };
}
