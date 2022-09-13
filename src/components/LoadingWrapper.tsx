import { CircularProgress } from "@mui/material";
import { ReactNode, createContext, useContext, useId, useState } from "react";

const LoadingContext = createContext<[Record<string, boolean>, (state: boolean, id: string) => void]>([ {}, () => {} ]);

export const LoadingWrapper = ({ children }: { children: ReactNode }) => {
  const [ loadingReasons, setLoadingReasons ] = useState<Record<string, boolean>>({});

  const setLoading = (state: boolean, id: string) => {
    setLoadingReasons({ ...loadingReasons, [id]: state });
  };

  return (
    <LoadingContext.Provider value={[ loadingReasons, setLoading ]}>
      {
        (Object.values(loadingReasons).some((val) => val)) &&
        (<CircularProgress style={{ position: "fixed", top: "48vw", left: "48vw", width: "4vw", height: "4vw" }} />)
      }
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): [boolean, (state: boolean) => void] => {
  const loadingId = useId();

  const [ loadingReasons, setLoadingReasons ] = useContext(LoadingContext);

  const isLoading = loadingReasons[loadingId] ?? false;
  const setIsLoading = (state: boolean) => setLoadingReasons(state, loadingId);

  return [ isLoading, setIsLoading ];
};
