import type { ComponentType, JSX } from "react";

import { Home } from "@/ui/pages/home/home.tsx";

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: "/", Component: Home },
  { path: "/Maths", Component: Home },
  { path: "/Russian", Component: Home },
];
