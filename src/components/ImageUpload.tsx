import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { ChangeEvent, useState } from "react";

const ImageUpload = ({ onUploaded }: {onUploaded?: (file: File | null, imageData: {width: number, height: number}) => void}) => {
  const [ previewedImage, setPreviewedImage ] = useState<any>(null);

  return (
    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <Box sx={{ flexDirection: "column", justifyContent: "space-around" }}>
        <Button
          variant="contained"
          component="label"
          fullWidth
        >
          Upload Image
          <input
            accept="image/*"
            type="file"
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
          <br />
          <button onClick={() => setPreviewedImage(null)}>Remove</button>
        </div>
      )}
    </Box>
  );
};

export default ImageUpload;
