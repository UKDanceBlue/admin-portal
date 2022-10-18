import { Box, CircularProgress } from "@mui/material";
import { ReactNode, createContext, useCallback, useContext, useId, useReducer } from "react";

const LoadingContext = createContext<[Partial<Record<string, boolean>>, (state: boolean, id: string) => void]>([ {}, () => {} ]);

export const LoadingWrapper = ({ children }: { children: ReactNode }) => {
  const [ loadingReasons, updateLoadingReasons ] = useReducer(
    (state: Partial<Record<string, boolean>>, [ id, stateChange ]: [string, boolean]) => {
      return {
        ...state,
        [id]: stateChange,
      };
    },
    {}
  );

  const setLoading = useCallback((state: boolean, id: string) => {
    updateLoadingReasons([ id, state ]);
  }, []);

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

export const useLoading = (customId?: string): [boolean, (state: boolean) => void, Partial<Record<string, boolean>>] => {
  const autoId = useId();
  const loadingId = customId ?? autoId;

  const [ loadingReasons, setLoadingReasons ] = useContext(LoadingContext);

  const isLoading = loadingReasons[loadingId] ?? false;
  const setIsLoading = useCallback((state: boolean) => setLoadingReasons(state, loadingId), [ loadingId, setLoadingReasons ]);

  return [
    isLoading, setIsLoading, loadingReasons
  ];
};
