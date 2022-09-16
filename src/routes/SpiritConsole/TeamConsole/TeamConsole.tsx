import { Typography } from "@mui/material";
import { collection, doc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useFirestore, useFirestoreDoc } from "reactfire";

import { FirestoreTeamInfo } from "../../../firebase/types/FirestoreTeamInfo";

import PointEntriesDataGrid from "./PointEntriesDataGrid";
import TeamMembersDataGrid from "./TeamMembersDataGrid";

const TeamConsole = () => {
  const { teamId } = useParams<{teamId: string}>();

  const firestore = useFirestore();
  const team = useFirestoreDoc<Partial<FirestoreTeamInfo>>(doc(collection(firestore, "spirit/teams/documents"), teamId));

  return (
    <div>
      <Typography variant="h1" textAlign="center">{team.data?.get("name") ?? "Unnamed Spirit Team"}</Typography>
      <TeamMembersDataGrid teamObservable={team} />
      <PointEntriesDataGrid />
    </div>
  );
};

export default TeamConsole;
