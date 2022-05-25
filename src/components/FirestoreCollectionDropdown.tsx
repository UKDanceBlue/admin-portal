import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  Checkbox,
  CircularProgress,
  TextField,
} from "@mui/material";
import { CollectionReference, getDocs } from "firebase/firestore";
import { SyntheticEvent, useEffect, useState } from "react";

import { GenericFirestoreDocument } from "../firebase/types";

const uncheckedIcon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const getOptionNameFromUnknown = (option: unknown) => {
  if (!option) {
    return "**no label**";
  }
  if (typeof option === "string") {
    return option;
  }
  if (typeof option === "number" || typeof option === "boolean" || typeof option === "bigint") {
    return option.toString();
  }
  if (typeof option === "object") {
    if (typeof option.toString === "function") {
      return option.toString();
    } else {
      return JSON.stringify(option);
    }
  }
  return "**no label**";
};

const FirestoreCollectionDropdown = ({
  collectionRef,
  label,
  getLabel,
  onChange,
}: {
  collectionRef: CollectionReference;
  label: string;
  getLabel: (doc: GenericFirestoreDocument) => unknown;
  onChange: (
    event: SyntheticEvent,
    value: Array<GenericFirestoreDocument>,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<GenericFirestoreDocument>
  ) => void;
}) => {
  const [shouldOptionsLoad, setShouldOptionsLoad] = useState(false);
  const [options, setOptions] = useState<GenericFirestoreDocument[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState<Error | null>(null);

  useEffect(() => {
    if (shouldOptionsLoad) {
      getDocs(collectionRef)
        .then((snapshot) => {
          setOptions(snapshot.docs.map((doc) => doc.data()));
          setOptionsLoading(false);
        })
        .catch((error: Error) => {
          setOptionsError(error);
          setOptionsLoading(false);
        });
    }
  }, [shouldOptionsLoad, collectionRef]);

  return (
    <Autocomplete
      multiple
      onOpen={() => {
        if (!shouldOptionsLoad) {
          setShouldOptionsLoad(true);
        }
      }}
      onChange={onChange}
      options={options ?? []}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      noOptionsText="No options found"
      getOptionLabel={(option) => getOptionNameFromUnknown(getLabel(option))}
      loading={!!(optionsLoading || optionsError)}
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
            {getLabel(option)}
          </>
        </li>
      )}
      style={{ width: 500 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {shouldOptionsLoad && (optionsLoading || optionsError) ? (
                  <CircularProgress color={optionsError ? "error" : "primary"} size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          error={!!optionsError}
          helperText={optionsError?.message}
          FormHelperTextProps={{
            error: !!optionsError,
          }}
        />
      )}
    />
  );
};

export default FirestoreCollectionDropdown;
