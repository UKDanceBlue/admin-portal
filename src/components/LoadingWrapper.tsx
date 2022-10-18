import { Box, CircularProgress } from "@mui/material";
import { ReactNode, createContext, useCallback, useContext, useId, useState } from "react";

const LoadingContext = createContext<[Record<string, boolean>, (state: boolean, id: string) => void]>([ {}, () => {} ]);

export const LoadingWrapper = ({ children }: { children: ReactNode }) => {
  const [ loadingReasons, setLoadingReasons ] = useState<Record<string, boolean>>({});

  const setLoading = (state: boolean, id: string) => {
    setLoadingReasons({ ...loadingReasons, [id]: state });
  };

  return (
    <LoadingContext.Provider value={[ loadingReasons, setLoading ]}>
      {
        (
          Object.values(loadingReasons).some((val) => val)
        ) && (
          <Box style={{ position: "fixed", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress size="5vw" />
          </Box>
        )
      }
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): [boolean, (state: boolean) => void] => {
  const loadingId = useId();

  const [ loadingReasons, setLoadingReasons ] = useContext(LoadingContext);

  const isLoading = loadingReasons[loadingId] ?? false;
  const setIsLoading = useCallback((state: boolean) => setLoadingReasons(state, loadingId), [ loadingId, setLoadingReasons ]);

  return [ isLoading, setIsLoading ];
};
