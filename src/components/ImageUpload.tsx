import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { ChangeEvent, useState } from "react";

const ImageUpload = ({
  onUploaded, disabled = false, initialPreview
}: {onUploaded?: (file: File | null, imageData: {width: number, height: number}) => void, disabled?: boolean, initialPreview?: HTMLImageElement}) => {
  const [ previewedImage, setPreviewedImage ] = useState<HTMLImageElement | null>(initialPreview ?? null);

  if (previewedImage != null) {
    previewedImage.height = Math.min(200, previewedImage.height);
    previewedImage.width = previewedImage.height * (previewedImage.naturalWidth / previewedImage.naturalHeight);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <Box sx={{ flexDirection: "column", justifyContent: "space-around" }}>
        <Button
          variant="contained"
          component="label"
          disabled={disabled}
          fullWidth
        >
          Upload Image
          <input
            accept="image/*"
            type="file"
            disabled={disabled}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const image = new Image();
              image.onload = () => {
                onUploaded?.(event.target.files?.[0] ?? null, { width: image.naturalWidth, height: image.naturalHeight });
              };
              image.src = event.target.files?.[0] == null ? "" : URL.createObjectURL(event.target.files?.[0]);
              setPreviewedImage(image);
            }}
            hidden
          />
        </Button>
      </Box>

      {previewedImage && (
        <div style={{ paddingLeft: "5em", paddingRight: "5em" }}>
          <div dangerouslySetInnerHTML={{ __html: previewedImage.outerHTML }}/>
        </div>
      )}
    </Box>
  );
};

export default ImageUpload;
