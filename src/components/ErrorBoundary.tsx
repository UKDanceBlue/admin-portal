import WarningIcon from "@mui/icons-material/Warning";
import { Dialog, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Component, ReactElement, ReactNode } from "react";

const errorStyle = {
  width: "100%",
  borderRadius: "0.5em",
  padding: "0.1em",
  backgroundColor: "lightgrey",
};

function FormattedBlock({ children }: {children: ReactNode}): ReactElement {
  if (children) {
    return (
      <Box sx={errorStyle} component="pre">
        <Typography fontFamily="monospace" component="output">
          {children}
        </Typography>
      </Box>
    );
  } else {
    return (<></>);
  }
}

class ErrorBoundary extends Component<{children: ReactNode}, { error: unknown, errorInfo: unknown }> {
  state = { error: null, errorInfo: null };

  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    this.setState({ error, errorInfo });
  }

  render() {
    const {
      error, errorInfo
    } = this.state;

    let componentStack: ReactNode = null;
    if ((errorInfo as unknown as {componentStack?: string})?.componentStack) {
      componentStack = (
        <>
          <p>Component Stack:</p>
          <FormattedBlock>{((errorInfo as unknown as { componentStack?: string; })?.componentStack?.trim())}</FormattedBlock>
        </>
      );
    }

    if (error !== null) {
      // You can render any custom fallback UI
      return (
        <>
          <Box bgcolor="GrayText" height="100%" width="100%" sx={{ backgroundRepeat: "repeat" }} />
          <Dialog open={true} fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
              <WarningIcon htmlColor="red" fontSize="large"/>
            Something went wrong.
              <WarningIcon htmlColor="red" fontSize="large"/>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <p>Something went wrong, Try refreshing the page.</p>
                <br/>
                <p>If that doesn&apos;t work, please contact the site administrator, error is as follows:</p>
                {
                  (typeof error === "object" && (error as object) instanceof Error)
                    ? (
                      <>
                        <p>Error Name:</p>
                        <FormattedBlock>
                          {(error as Error).name}
                        </FormattedBlock>

                        <p>Message:</p>
                        <FormattedBlock>
                          {(error as Error).message}
                        </FormattedBlock>
                        {(error as Error).cause && (
                          <>
                            <p>Cause:</p>
                            <FormattedBlock>
                              {JSON.stringify((error as Error).cause)}
                            </FormattedBlock>
                          </>
                        )}
                      </>
                    )
                    : (
                      <FormattedBlock>
                        {JSON.stringify(error)}
                      </FormattedBlock>
                    )
                }
                {errorInfo && (
                  <>
                    <br/>
                    <p>Additional information:</p>
                    <details>
                      {componentStack}
                    Raw Error Info:
                      <FormattedBlock>{JSON.stringify(errorInfo, null, 2)}</FormattedBlock>
                    </details>
                  </>
                )}
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
