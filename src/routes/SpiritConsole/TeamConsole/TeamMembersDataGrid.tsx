import { Add, Delete } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { DocumentSnapshot, FieldPath, arrayRemove, arrayUnion, deleteField, updateDoc, writeBatch } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useFirestore } from "reactfire";
import type { ObservableStatus } from "reactfire";

import { useLoading } from "../../../components/LoadingWrapper";
import { FirestoreTeamInfo } from "../../../firebase/types/FirestoreTeamInfo";

const TeamMembersDataGrid = ({ teamObservable }: {teamObservable: ObservableStatus<DocumentSnapshot<Partial<FirestoreTeamInfo>>>}) => {
  const firestore = useFirestore();

  const [ isLoading, setIsLoading ] = useLoading();
  useEffect(() => {
    setIsLoading(teamObservable.status === "loading");
  }, [ teamObservable.status, setIsLoading ]);

  const [ teamMembers, setTeamMembers ] = useState<{linkblue: string, name?: string, uid?: string, isCaptain?: boolean}[]>([]);
  useEffect(() => {
    if (teamObservable.status === "success") {
      const teamData = teamObservable.data.data();
      if (teamData?.members) {
        const parsedMembers = [];
        for (const memberLinkblue of teamData.members) {
          const memberName = teamData.memberNames?.[memberLinkblue] ?? undefined;
          const memberUid = teamData.memberAccounts?.[memberLinkblue] ?? undefined;
          const isCaptain = teamData.captains?.includes(memberLinkblue);
          parsedMembers.push({ linkblue: memberLinkblue, name: memberName, uid: memberUid, isCaptain });
        }
        setTeamMembers(parsedMembers);
      }
    }
  }, [ teamObservable.status, teamObservable.data ]);

  const [ newMemberLinkblue, setNewMemberLinkblue ] = useState("");

  return (
    <Box sx={{ flex: 5, flexDirection: "column" }}>
      <Box sx={{ height: "60vh", padding: "1em" }}>
        <DataGrid
          loading={isLoading}
          rows={teamMembers}
          onCellEditCommit={({
            field, value, id
          }) => {
            if (field === "isCaptain") {
              updateDoc(teamObservable.data.ref, { captains: value ? arrayUnion(id) : arrayRemove(id) });
            }
          }}
          getRowId={(row) => row.linkblue}
          columns={[
            {
              field: "linkblue",
              headerName: "Linkblue",
              flex: 2,
            },
            {
              field: "name",
              valueFormatter: ({ value }) => value ?? "Unknown",
              headerName: "Name",
              flex: 3,
            },
            {
              field: "uid",
              headerName: "User ID",
              flex: 4,
              valueFormatter: ({ value }) => value ?? "No associated account",
            },
            {
              field: "isCaptain",
              headerName: "Captain",
              flex: 1,
              type: "boolean",
              editable: true,
            },
            {
              field: "actions",
              headerName: "Actions",
              flex: 1,
              type: "actions",
              getActions: (rowData) => [
                <IconButton
                  key={0}
                  onClick={() => {
                    const { linkblue } = rowData.row;
                    const batch = writeBatch(firestore);
                    batch.update(teamObservable.data.ref, new FieldPath("members"), arrayRemove(linkblue));
                    batch.update(teamObservable.data.ref, new FieldPath("memberNames", linkblue), deleteField());
                    batch.update(teamObservable.data.ref, new FieldPath("memberAccounts", linkblue), deleteField());
                    batch.commit().catch((error) => {
                      console.error("Error removing member from team", error);
                      alert(`Error removing member from team:\n${error}`);
                    });
                  }}
                >
                  <Delete />
                </IconButton>
              ]
            }
          ]}
        />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", padding: "1em", gap: "1em" }}>
        <TextField
          label="Linkblue"
          value={newMemberLinkblue}
          onChange={(event) => setNewMemberLinkblue(event.target.value)}
        />
        <IconButton
          onClick={() => {
            if (newMemberLinkblue.length === 0) {
              alert("Please enter a Linkblue");
              return;
            } else if (teamMembers.some((member) => member.linkblue === newMemberLinkblue)) {
              alert("This Linkblue is already a member of this team");
              return;
            } else {
              updateDoc(teamObservable.data.ref, new FieldPath("members"), arrayUnion(newMemberLinkblue))
                .then(() => setNewMemberLinkblue(""))
                .catch((error) => {
                  console.error("Error adding member to team", error);
                  alert(`Error adding member to team:\n${error}`);
                });
            }
          }}
        >
          <Add />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TeamMembersDataGrid;
