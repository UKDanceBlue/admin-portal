import { Button } from "@mui/material";
import { getDownloadURL, ref } from "firebase/storage";
import { ImgHTMLAttributes, useEffect, useState } from "react";
import { useStorage } from "reactfire";

const LoadableImage = ({
  src, alt, isStorageUri, width, height, style, onLoaded
}: {src: string | (() => Promise<string>), alt: string, isStorageUri?: boolean, width?: number, height?: number, style?: ImgHTMLAttributes<unknown>["style"], onLoaded?: () => void}) => {
  const storage = useStorage();

  const [ loading, setLoading ] = useState(true);
  const [ shouldShowImage, setShouldShowImage ] = useState(false);
  const [ srcUrl, setSrcUrl ] = useState("");

  useEffect(() => {
    if (shouldShowImage) {
      if (typeof src === "function") {
        src().then((url) => {
          if (isStorageUri) {
            getDownloadURL(ref(storage, url)).then((downloadUrl) => {
              setSrcUrl(downloadUrl);
              setLoading(false);
              onLoaded?.();
            });
          } else {
            setSrcUrl(url);
            setLoading(false);
            onLoaded?.();
          }
        });
      } else if (isStorageUri) {
        getDownloadURL(ref(storage, src)).then((url) => {
          setSrcUrl(url);
          setLoading(false);
          onLoaded?.();
        });
      } else {
        setSrcUrl(src);
        setLoading(false);
        onLoaded?.();
      }
    }
  }, [
    isStorageUri, onLoaded, shouldShowImage, src, storage
  ]);


  if (!shouldShowImage) {
    return (
      <Button variant="contained" color="primary" onClick={() => setShouldShowImage(true)}>
        Show Image
      </Button>
    );
  } else if (loading) {
    return <div>Loading...</div>;
  } else {
    return <img alt={alt} src={srcUrl} height={height} width={width} style={{ width, height, ...style }} />;
  }
};

export default LoadableImage;
