import { Box, CircularProgress } from "@mui/material";
import { ReactNode, createContext, useCallback, useContext, useEffect, useId, useReducer } from "react";

const LoadingContext = createContext<[Partial<Record<string, boolean>>, (state: boolean, id: string) => void]>([ {}, () => undefined ]);

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
          <Box style={{ position: "fixed", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: Number.MAX_SAFE_INTEGER }}>
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

  const [ loadingReasons, setLoading ] = useContext(LoadingContext);


  useEffect(() => {
    return () => {
      setLoading(false, loadingId);
    };
  }, [ loadingId, setLoading ]);

  const isLoading = loadingReasons[loadingId] ?? false;
  const setIsLoading = useCallback((state: boolean) => setLoading(state, loadingId), [ loadingId, setLoading ]);

  return [
    isLoading, setIsLoading, loadingReasons
  ];
};
