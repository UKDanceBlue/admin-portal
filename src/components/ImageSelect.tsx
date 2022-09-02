import { Paper, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";

import ImageUpload from "./ImageUpload";

type ImageMode = null | "url" | "upload";

export interface ImageSelectRef {
  setImageMode: Dispatch<SetStateAction<ImageMode>>;
}

const ImageSelect = ({
  value, onChange, isLoading = false, disabled = false, ref
}: {
  value: {
    file: File,
    width: number,
    height: number
  } | string | undefined;
  onChange: (image: {
    file: File,
    width: number,
    height: number
  } | string | undefined) => void;
  isLoading?: boolean;
  disabled?: boolean;
  ref?: MutableRefObject<ImageSelectRef | undefined>;
}) => {
  const [ imageMode, setImageMode ] = useState<ImageMode>(null);

  if (ref?.current != null) {
    ref.current.setImageMode = setImageMode;
  }

  return (
    <Paper sx={{ display: "flex", flexDirection: "column", gap: "1em", padding: "1em" }} elevation={4}>
      <Box sx={{ display: "flex", gap: "1em", padding: "1em" }}>
        <ToggleButtonGroup
          value={imageMode}
          exclusive
          onChange={(_, val) => {
            onChange(undefined);
            setImageMode(val);
          }}
          aria-label="text alignment"
          disabled={disabled}
        >
          <ToggleButton value="upload">
              Upload
          </ToggleButton>
          <ToggleButton value="url">
              Link
          </ToggleButton>
        </ToggleButtonGroup>
        <Typography>
              When possible, prefer the link option as it saves us a few cents of storage (basically, avoid downloading an image from a website and re-uploading here, just put the image&apos;s URL in the link field).
        </Typography>
      </Box>

      {
        imageMode === "upload" && <ImageUpload onUploaded={(file, {
          width, height
        }) => {
          if (file != null) {
            onChange({ file, width, height });
          }
        }} />
      }
      {
        imageMode === "url" && <TextField
          disabled={isLoading || disabled}
          label="Image URL"
          value={value ?? ""}
          fullWidth
          onChange={({ target: { value } }) => onChange(value.length > 0 ? value : undefined )}
        />
      }
    </Paper>
  );
};

export default ImageSelect;
