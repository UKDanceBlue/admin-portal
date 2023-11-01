import { ReactNode } from "react";

import EventConsole from "./EventConsole";
import { ExistingEvent } from "./EventConsole/EventEditor/ExistingEvent";
import { NewEvent } from "./EventConsole/EventEditor/NewEvent";
import Home from "./Home";
import MarathonConsole from "./MarathonConsole";
import { MarathonHourConsole } from "./MarathonConsole/MarathonHourConsole";
import MoraleConsole from "./MoraleConsole";
import NotificationConsole from "./NotificationConsole";
import SpiritConsole, { OpportunityConsole } from "./SpiritConsole";
import TeamConsole from "./SpiritConsole/TeamConsole";

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
    showInMenu: false,
    path: "/event-manager",
    pathFragment: "event-manager",
    signInRequired: true,
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] as const },
      { claimKey: "committeeRank", claimValues: [ "coordinator", "chair" ] as const },
    ] as const,
    element: <EventConsole />,
  },
  "event-editor": {
    title: "Event Editor",
    showInMenu: false,
    pathFragment: "event-manager/:eventId",
    signInRequired: true,
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] as const },
      { claimKey: "committeeRank", claimValues: [ "coordinator", "chair" ] as const },
    ] as const,
    element: <ExistingEvent />,
  },
  "new-event": {
    title: "New Event",
    showInMenu: false,
    path: "/event-manager/new",
    pathFragment: "event-manager/new",
    signInRequired: true,
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] as const },
      { claimKey: "committeeRank", claimValues: [ "coordinator", "chair" ] as const },
    ] as const,
    element: <NewEvent />,
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
  "spirit-teams": {
    title: "Spirit Opportunities",
    pathFragment: "spirit-points/spirit-teams/:teamId",
    signInRequired: true,
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] as const },
      { claimKey: "committeeRank", claimValues: [ "coordinator", "chair" ] as const },
    ] as const,
    element: <TeamConsole />,
  },
  marathon: {
    title: "Marathon Manager",
    showInMenu: false,
    path: "/marathon",
    pathFragment: "marathon",
    signInRequired: true,
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] as const },
      { claimKey: "committeeRank", claimValues: [ "coordinator", "chair" ] as const },
    ] as const,
    element: <MarathonConsole />,
  },
  "marathon-hour": {
    title: "Marathon Hour Editor",
    pathFragment: "marathon/:hourNumber",
    signInRequired: true,
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] as const },
      { claimKey: "committeeRank", claimValues: [ "coordinator", "chair" ] as const },
    ] as const,
    element: <MarathonHourConsole />,
  },
  "morale-console": {
    title: "Morale Point Editor",
    showInMenu: false,
    path: "/marathon/morale",
    pathFragment: "marathon/morale",
    signInRequired: true,
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] as const },
      { claimKey: "committeeRank", claimValues: [ "coordinator", "chair" ] as const },
    ] as const,
    element: <MoraleConsole />,
  },
  "notification-console": {
    title: "Send Notification",
    showInMenu: false,
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
