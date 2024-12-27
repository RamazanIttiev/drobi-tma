import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

import { App } from "@/App.tsx";
import { init } from "@/init.ts";
import { ErrorBoundary } from "@/ui/organisms/error-boundary.tsx";
import { ErrorBoundaryFallback } from "@/ui/molecules/error-fallback.tsx";
import { EnvUnsupported } from "@/ui/organisms/env-unsupported.tsx";

import "@telegram-apps/telegram-ui/dist/styles.css";
import "./index.css";

// Mock the environment in case, we are outside Telegram.
import "./mockEnv.ts";

const root = ReactDOM.createRoot(document.getElementById("root")!);

try {
  // Configure all application dependencies.
  init(retrieveLaunchParams().startParam === "debug" || import.meta.env.DEV);

  root.render(
    <StrictMode>
      <ErrorBoundary fallback={ErrorBoundaryFallback}>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
} catch (err: unknown) {
  console.log(err);
  root.render(<EnvUnsupported />);
}
