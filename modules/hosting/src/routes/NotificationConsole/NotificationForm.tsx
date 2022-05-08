import { Autocomplete, Checkbox, CircularProgress, FormControl, TextField } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/firebaseApp";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
// import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { useEffect, useState } from "react";
import { GenericFirestoreDocument } from "../../firebase/types";

const uncheckedIcon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const NotificationForm = () => {
  const [shouldTeamsLoad, setShouldTeamsLoad] = useState(false);
  const [teams, setTeams] = useState<GenericFirestoreDocument[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [teamsError, setTeamsError] = useState<Error | null>(null);

  useEffect(() => {
    if (shouldTeamsLoad) {
      const teamsCollectionRef = collection(firestore, "teams").withConverter({
        toFirestore(data: GenericFirestoreDocument) {
          const dataToUpload = { ...data };
          delete dataToUpload.id;
          return dataToUpload;
        },
        fromFirestore(snapshot, options) {
          const data = snapshot.data(options);
          return { ...data, id: snapshot.id };
        },
      });
      getDocs(teamsCollectionRef)
        .then((snapshot) => {
          setTeams(snapshot.docs.map((doc) => doc.data()));
          setTeamsLoading(false);
        })
        .catch((error: Error) => {
          setTeamsError(error);
          setTeamsLoading(false);
        });
    }
  }, [shouldTeamsLoad]);

  return (
    <>
      <FormControl variant="outlined" fullWidth>
        {/* TODO: Convert this to a generic firebase dropdown */}
        <Autocomplete
          multiple
          onOpen={() => {
            setShouldTeamsLoad(true);
          }}
          options={teams ?? []}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          noOptionsText="No teams found"
          getOptionLabel={(option) => option.name?.toString() ?? "**no name**"}
          loading={!!(teamsLoading || teamsError)}
          disableCloseOnSelect
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <>
                <Checkbox
                  icon={uncheckedIcon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.name}
              </>
            </li>
          )}
          style={{ width: 500 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Team Selection"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {shouldTeamsLoad && (teamsLoading || teamsError) ? (
                      <CircularProgress color={teamsError ? "error" : "primary"} size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
              error={!!teamsError}
              helperText={teamsError?.message}
              FormHelperTextProps={{
                error: !!teamsError,
              }}
            />
          )}
        />
      </FormControl>
    </>
  );
};

export default NotificationForm;
