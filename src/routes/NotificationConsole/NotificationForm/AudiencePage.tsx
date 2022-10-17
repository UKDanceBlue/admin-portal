import { Box, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { CollectionReference, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useFirestore } from "reactfire";

import { useRemoteConfigParsedJson } from "../../../customHooks";
import { SpiritTeamsRootDoc } from "../../../firebase/types/SpiritTeamsRootDoc";

import { NotificationFormPendingState } from ".";

const knownAttributes: { [attributeName: string]: { [attributeValue: string]: string } } = {
  committee: {
    "tech-committee": "Tech Committee",
    "corporate-committee": "Corporate Committee",
    "marketing-committee": "Marketing Committee",
    "programming-committee": "Programming Committee",
    "operations-committee": "Operations Committee",
    "dancer-relations-committee": "Dancer Relations Committee",
    "community-relations-committee": "Community Relations Committee",
    "family-relations-committee": "Family Relations Committee",
    "overall-committee": "Overall Committee",
    "fundraising-committee": "Fundraising Committee",
    "mini-marathons-committee": "Mini Marathons Committee",
    "morale-committee": "Morale Committee",
    _name: "Committee",
  },
  dbRole: {
    public: "General Public (i.e. no team or committee members)",
    "team-member": "Team Member",
    committee: "Committee",
    _name: "Role",
  },
  committeeRank: {
    advisor: "Advisor",
    "overall-chair": "Overall Chair",
    chair: "Chair",
    coordinator: "Coordinator",
    "committee-member": "Committee Member",
    _name: "Committee Rank",
  },
};

function mapAttribute(attributeValue: unknown, attributeName: string): string {
  if (typeof attributeValue === "boolean") {
    return attributeValue ? "Yes" : "No";
  } else if (typeof attributeValue === "number") {
    return attributeValue.toString();
  } else if (typeof attributeValue === "string") {
    return knownAttributes[attributeName]?.[attributeValue] ?? attributeValue;
  } else {
    return "";
  }
}

const AudiencePage = ({
  pendingState,
  handlePageUpdated,
}: {
  pendingState: NotificationFormPendingState;
  handlePageUpdated: (changedContent: NotificationFormPendingState) => void;
}) => {
  const firestore = useFirestore();

  const [ spiritTeamInfo, setSpiritTeamInfo ] = useState<SpiritTeamsRootDoc | null>(null);

  const validAttributes = useRemoteConfigParsedJson<{
    [key: string]: { value: string }[] | { type: "string" | "number" | "boolean" };
  }>("valid_attributes");

  const [ notificationAudiences, setNotificationAudiences ] = useState<
    NotificationFormPendingState["notificationAudiences"]
  >(pendingState.notificationAudiences ?? {});
  const [ sendToAll, setSendToAll ] = useState(false);

  useEffect(() => {
    if (sendToAll) {
      handlePageUpdated({ sendToAll, notificationAudiences: undefined });
    } else if (notificationAudiences) {
      const filteredNotificationAudiences: Parameters<typeof handlePageUpdated>[0]["notificationAudiences"] = Object.fromEntries(
        Object.entries(notificationAudiences).filter(([ , value ]) => Array.isArray(value) && value.length > 0)
      );
      handlePageUpdated({ notificationAudiences: filteredNotificationAudiences, sendToAll: undefined });
    }
  }, [
    handlePageUpdated, notificationAudiences, sendToAll
  ]);

  useEffect(() => {
    const spiritTeamInfoRef = getDoc(doc<SpiritTeamsRootDoc>(firestore as unknown as CollectionReference<SpiritTeamsRootDoc>, "spirit", "teams"));
    spiritTeamInfoRef.then((doc) => {
      if (doc.exists()) {
        setSpiritTeamInfo(doc.data());
      }
    });
  }, [firestore]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ mt: "1rem", alignSelf: "flex-start", mx: "5rem" }}>
        <Typography variant="body2">
          Select the audiences that will receive this notification.
        </Typography>
        <Typography variant="body2" sx={{ mt: "1em" }}>
          If you want to ignore a criteria, simply leave the box blank. To override all filters and
          send a notification to everyone possible, simply select &quot;Send to All&quot;. Selecting
          multiple options for a field will allow that field to be any one of them, however selecting
          multiple fields will require each field. That&apos;s kinda confusing, so as an example, let&apos;s say you select teams X,
          Y, and Z, and also select &quot;Team&nbsp;Captain:&nbsp;yes&quot;, this will send a notification to any
          team captain on teams X, Y, or Z as you are telling the server &quot;send a notification to the captains of X, Y,
          and Z&quot;. On the other hand if you instead selected Team Z, Y, or Z as well and &quot;Committee&nbsp;rank:&nbsp;coordinator&quot;,
          you would be unlikely to send a notification to anyone as you would be telling the server
          &quot;send a notification to all the coordinators on team X, Y, or Z&quot;. Again, if you have any
          questions about how this works, <i>please</i> contact the app coordinator. If you would like more
          granular control over who receives this notification, feel free to reach out to the
          tech committee, there is a lot of room for improvement here and I am down for it.
        </Typography>
      </Box>
      <FormControlLabel control={<Checkbox
        checked={sendToAll}
        onChange={(val) => setSendToAll(val.target.checked)}
        inputProps={{ "aria-label": "controlled" }}
      />}
      label="Send to All" />
      <FormControl sx={{ width: "90%", mt: "1rem" }} disabled={sendToAll}>
        <InputLabel id={"select-spiritTeamId-label"}>Team</InputLabel>
        <Select
          labelId={"select-spiritTeamId-label"}
          id={"select-spiritTeamId"}
          value={notificationAudiences?.spiritTeamId ?? []}
          label="Team"
          disabled={sendToAll}
          multiple
          onClick={(event) => {
            event.preventDefault();
          }}
          onChange={(event) => {
            const currentNotificationAudiences = { ...notificationAudiences };
            if (Array.isArray(event.target.value)) {
              currentNotificationAudiences.spiritTeamId = event.target.value;
            } else if (event.target.value === "") {
              delete currentNotificationAudiences.spiritTeamId;
            } else {
              currentNotificationAudiences.spiritTeamId = [event.target.value];
            }
            setNotificationAudiences(currentNotificationAudiences);
          }}
        >
          {spiritTeamInfo == null ? null : (
            Object.entries(spiritTeamInfo.basicInfo).map(([ id, { name } ]) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
      {validAttributes.data &&
        Object.entries(validAttributes.data)?.map(([ attributeName, attributeValues ]) => {
          if (Array.isArray(attributeValues)) {
            return (
              <FormControl key={attributeName} sx={{ width: "90%", mt: "1rem" }} disabled={sendToAll}>
                <InputLabel id={`select-${attributeName}-label`}>{knownAttributes[attributeName]._name ?? attributeName}</InputLabel>
                <Select
                  labelId={`select-${attributeName}-label`}
                  id={`select-${attributeName}`}
                  value={notificationAudiences?.[attributeName] ?? []}
                  label={attributeName}
                  disabled={sendToAll}
                  multiple
                  onClick={(event) => {
                    event.preventDefault();
                  }}
                  onChange={(event) => {
                    const currentNotificationAudiences = { ...notificationAudiences };
                    if (Array.isArray(event.target.value)) {
                      currentNotificationAudiences[attributeName] = event.target.value;
                    } else if (event.target.value === "") {
                      delete currentNotificationAudiences[attributeName];
                    } else {
                      currentNotificationAudiences[attributeName] = [event.target.value];
                    }
                    setNotificationAudiences(currentNotificationAudiences);
                  }}
                >
                  {attributeValues.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {mapAttribute(item.value, attributeName)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          } else {
            return null;
          }
        })}
    </Box>
  );
};

export default AudiencePage;
