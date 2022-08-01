import { ReactNode } from "react";

import EventConsole from "./EventConsole";
import Home from "./Home";
import MarathonConsole from "./MarathonConsole";
import MoraleConsole from "./MoraleConsole";
import NotificationConsole from "./NotificationConsole";
import SpiritConsole from "./SpiritConsole";

export type AuthClaim = {
  claimKey: string;
  claimValues: string[];
};

export interface RouteDefinition {
  title: string;
  path: string;
  pathFragment: string;
  signInRequired?: boolean;
  requiredClaims?: AuthClaim[];
  element?: ReactNode;
}

const routeList: RouteDefinition[] = [
  {
    title: "Home",
    path: "/",
    pathFragment: "/",
    element: <Home />,
  },
  {
    title: "Event Manager",
    path: "/event-manager",
    pathFragment: "event-manager",
    signInRequired: true,
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] },
      { claimKey: "committeeRank", claimValues: [ "coordinator", "chair" ] },
    ],
    element: <EventConsole />,
  },
  {
    title: "Marathon Manager",
    path: "/marathon-console",
    pathFragment: "marathon-console",
    signInRequired: true,
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] },
      { claimKey: "committeeRank", claimValues: [ "coordinator", "chair" ] },
    ],
    element: <MarathonConsole />,
  },
  {
    title: "Spirit Point Manager",
    path: "/spirit-console",
    pathFragment: "spirit-console",
    signInRequired: true,
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] },
      { claimKey: "committeeRank", claimValues: [ "coordinator", "chair" ] },
    ],
    element: <SpiritConsole />,
  },
  {
    title: "Morale Point Manager",
    path: "/morale-console",
    pathFragment: "morale-console",
    signInRequired: true,
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] },
      { claimKey: "committeeRank", claimValues: [ "coordinator", "chair" ] },
    ],
    element: <MoraleConsole />,
  },
  {
    title: "Notification Manager",
    path: "/notification-console",
    pathFragment: "notification-console",
    signInRequired: true,
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] },
      { claimKey: "committeeRank", claimValues: [ "coordinator", "chair" ] },
    ],
    element: <NotificationConsole />,
  },
];

export default routeList;
