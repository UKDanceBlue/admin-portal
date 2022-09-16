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

  const {
    name, fundraisingTotal, totalPoints, networkForGoodId, teamClass
  } = team.data.data() ?? {};

  return (
    <div>
      <Typography variant="h1" textAlign="center">{name ?? "Unnamed Spirit Team"}</Typography>
      <Typography variant="h6" textAlign="center">Fundraising Total: {fundraisingTotal ?? "[UNKNOWN]"}</Typography>
      <Typography variant="h6" textAlign="center">Total Points: {totalPoints ?? "[UNKNOWN]"}</Typography>
      <Typography variant="h6" textAlign="center">Network For Good Id: {networkForGoodId ?? "[UNKNOWN]"}</Typography>
      <Typography variant="h6" textAlign="center">Team Visibility (who can see it): {teamClass ?? "[UNKNOWN]"}</Typography>
      <Typography variant="body2" textAlign="center">Until I get editing working here, the above values (well most of them) are editable from the list of all teams (just double click)</Typography>
      <Typography variant="h2" textAlign="center">Members</Typography>
      <TeamMembersDataGrid teamObservable={team} />
      <Typography variant="h2" textAlign="center">Point Entries</Typography>
      <PointEntriesDataGrid />
    </div>
  );
};

export default TeamConsole;
