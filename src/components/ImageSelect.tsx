import { Paper, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";

import ImageUpload from "./ImageUpload";

type ImageMode = null | "url" | "upload";

export interface ImageSelectModeRef {
  setImageMode: Dispatch<SetStateAction<ImageMode>>;
}

const ImageSelect = ({
  onChange, isLoading = false, disabled = false, modeRef, allowedModes = [ "url", "upload" ], initialValue
}: {
  onChange: (image: {
    file: File,
    width: number,
    height: number
  } | string | undefined) => void;
  isLoading?: boolean;
  disabled?: boolean;
  modeRef?: MutableRefObject<ImageSelectModeRef | undefined>;
  allowedModes?: (Omit<ImageMode, "null">)[];
  initialValue?: string | HTMLImageElement
}) => {
  type ImageSelectValue = {
    file: File;
    width: number;
    height: number;
  } | string | undefined;

  const [ value, setValue ] = useState<ImageSelectValue>(undefined);

  const [ imageMode, setImageMode ] = useState<ImageMode>(
    initialValue == null ? null : (typeof initialValue === "string" ? "url" : "upload")
  );

  if (modeRef?.current != null) {
    modeRef.current.setImageMode = setImageMode;
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
          {
            allowedModes.includes("upload") && (
              <ToggleButton value="upload">
              Upload
              </ToggleButton>
            )
          }
          {
            allowedModes.includes("url") && (
              <ToggleButton value="url">
              Link
              </ToggleButton>
            )
          }
        </ToggleButtonGroup>
        <Typography>
              When possible, prefer the link option as it saves us a few cents of storage (basically, avoid downloading an image from a website and re-uploading here, just put the image&apos;s URL in the link field).
        </Typography>
      </Box>

      {
        imageMode === "upload" && <ImageUpload
          onUploaded={(file, {
            width, height
          }) => {
            if (file != null) {
              setValue({
                file,
                width,
                height
              });
              onChange({ file, width, height });
            }
          }}
          initialPreview={initialValue instanceof HTMLImageElement ? initialValue : undefined}
        />
      }
      {
        imageMode === "url" && <TextField
          disabled={isLoading || disabled}
          label="Image URL"
          value={value ?? (typeof initialValue === "string" ? initialValue : "")}
          fullWidth
          onChange={({ target: { value } }) => {
            setValue(value);
            onChange(value.length > 0 ? value : undefined );
          }}
        />
      }
    </Paper>
  );
};

export default ImageSelect;
