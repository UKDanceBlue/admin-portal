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
  requiredClaims?: AuthClaim[];
  element?: React.ReactNode;
}

const routeList: RouteDefinition[] = [
  {
    title: "Home",
    path: "/",
    pathFragment: "/",
    element: <Home />,
  },
  {
    title: "Marathon Manager",
    path: "/marathon-console",
    pathFragment: "marathon-console",
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] },
      { claimKey: "committeeRank", claimValues: ["coordinator", "chair"] },
    ],
    element: <MarathonConsole />,
  },
  {
    title: "Spirit Point Manager",
    path: "/spirit-console",
    pathFragment: "spirit-console",
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] },
      { claimKey: "committeeRank", claimValues: ["coordinator", "chair"] },
    ],
    element: <SpiritConsole />,
  },
  {
    title: "Morale Point Manager",
    path: "/morale-console",
    pathFragment: "morale-console",
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] },
      { claimKey: "committeeRank", claimValues: ["coordinator", "chair"] },
    ],
    element: <MoraleConsole />,
  },
  {
    title: "Notification Manager",
    path: "/notification-console",
    pathFragment: "notification-console",
    requiredClaims: [
      { claimKey: "dbRole", claimValues: ["committee"] },
      { claimKey: "committeeRank", claimValues: ["coordinator", "chair"] },
    ],
    element: <NotificationConsole />,
  },
];

export default routeList;
