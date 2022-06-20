import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useFirestore } from "reactfire";

import FirestoreCollectionDropdown from "../../../components/FirestoreCollectionDropdown";
import { useRemoteConfigParsedJson } from "../../../customHooks";

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
  },
  dbRole: {
    public: "General Public (exclusive)",
    "team-member": "Team Member",
    committee: "Committee",
  },
  committeeRank: {
    advisor: "Advisor",
    "overall-chair": "Overall Chair",
    chair: "Chair",
    coordinator: "Coordinator",
    "committee-member": "Committee Member",
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

  const validAttributes = useRemoteConfigParsedJson<{
    [key: string]: { value: string }[] | { type: "string" | "number" | "boolean" };
  }>("valid_attributes");

  const [ notificationAudiences, setNotificationAudiences ] = useState<
    NotificationFormPendingState["notificationAudiences"]
  >(pendingState.notificationAudiences ?? {});

  useEffect(() => {
    handlePageUpdated({ notificationAudiences });
  }, [ handlePageUpdated, notificationAudiences ]);

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
          Note that Leaving a box blank means that the server will completely ignore that field.
          However, if you select every value for an audience then you will exclude anyone who does
          not have a value for that field. For example selecting both &quot;yes&quot; and
          &quot;no&quot; for Spirit captain is usually the same as just selecting &quot;yes&quot; as
          dancers&apos; spirit captain field is blank in the database. Again, if you have any
          questions about how this works, please contact the app coordinator. If you would like more
          granular control over who receives this notification, please feel free to reach out to the
          tech committee.
        </Typography>
      </Box>
      <FirestoreCollectionDropdown
        sx={{ width: "90%", mt: "1rem" }}
        label="Team Selection"
        getLabel={(doc) => doc.name}
        onChange={(__, value) => {
          setNotificationAudiences({
            ...notificationAudiences,
            team: value.map((doc) => doc.id),
          });
        }}
        collectionRef={collection(firestore, "teams")}
      />
      {validAttributes.data &&
        Object.entries(validAttributes.data)?.map(([ attributeName, attributeValues ]) => {
          if (Array.isArray(attributeValues)) {
            return (
              <FormControl key={attributeName} sx={{ width: "90%", mt: "1rem" }}>
                <InputLabel id={`select-${attributeName}-label`}>{attributeName}</InputLabel>
                <Select
                  labelId={`select-${attributeName}-label`}
                  id={`select-${attributeName}`}
                  value={notificationAudiences?.[attributeName] ?? []}
                  label={attributeName}
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
