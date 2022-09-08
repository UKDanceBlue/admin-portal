import { ReactNode } from "react";

import EventConsole from "./EventConsole";
import Home from "./Home";
// import MarathonConsole from "./MarathonConsole";
// import MoraleConsole from "./MoraleConsole";
import NotificationConsole from "./NotificationConsole";
import SpiritConsole, { OpportunityConsole } from "./SpiritConsole";

export type AuthClaim = {
  claimKey: string;
  claimValues: readonly string[];
};

export interface RouteDefinition {
  title: string;
  showInMenu?: boolean;
  path: string;
  pathFragment: string;
  signInRequired?: boolean;
  requiredClaims?: AuthClaim[];
  element?: ReactNode;
}

const routeDefinitions = {
  "/": {
    title: "Home",
    showInMenu: true,
    path: "/",
    pathFragment: "/",
    element: <Home />,
  },
  "event-manager": {
    title: "Event Manager",
    showInMenu: true,
    path: "/event-manager",
    pathFragment: "event-manager",
    signInRequired: true,
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] as const },
      { claimKey: "committeeRank", claimValues: [ "coordinator", "chair" ] as const },
    ] as const,
    element: <EventConsole />,
  },
  // "marathon-console": {
  //   title: "Marathon Manager",
  //   path: "/marathon-console",
  //   pathFragment: "marathon-console",
  //   signInRequired: true,
  //   requiredClaims: [
  //     { claimKey: "dbRole", claimValues: ["committee"] as const },
  //     { claimKey: "committeeRank", claimValues: [ "coordinator", "chair" ] as const },
  //   ] as const,
  //   element: <MarathonConsole />,
  // },
  "spirit-points": {
    title: "Spirit Point Manager",
    showInMenu: true,
    path: "/spirit-points",
    pathFragment: "spirit-points",
    signInRequired: true,
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] as const },
      { claimKey: "committeeRank", claimValues: [ "coordinator", "chair" ] as const },
    ] as const,
    element: <SpiritConsole />,
  },
  "spirit-opportunities": {
    title: "Spirit Opportunities",
    path: "/spirit-points/spirit-opportunities",
    pathFragment: "spirit-points/spirit-opportunities",
    signInRequired: true,
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] as const },
      { claimKey: "committeeRank", claimValues: [ "coordinator", "chair" ] as const },
    ] as const,
    element: <OpportunityConsole />,
  },
  // "morale-console": {
  //   title: "Morale Point Manager",
  //   path: "/morale-console",
  //   pathFragment: "morale-console",
  //   signInRequired: true
  //   requiredClaims: [
  //     { claimKey: "dbRole", claimValues: ["committee"] as const },
  //     { claimKey: "committeeRank", claimValues: [ "coordinator", "chair" ] as const },
  //   ] as const,
  //   element: <MoraleConsole />,
  // },
  "notification-console": {
    title: "Send Notification",
    showInMenu: true,
    path: "/notification-console",
    pathFragment: "notification-console",
    signInRequired: true,
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] as const },
      { claimKey: "committeeRank", claimValues: [ "coordinator", "chair" ] as const },
    ] as const,
    element: <NotificationConsole />,
  },
} as const;

export { routeDefinitions };
/** @deprecated */
const routeList = Object.values(routeDefinitions) as RouteDefinition[];
export default routeList;
