import normalizeException from "normalize-exception";
import {
  isRouteErrorResponse,
  useLocation,
  useRouteError,
} from "react-router-dom";
import NotFound from "../NotFound";
import ErrorPage from "./display";

export default function RouteErrorPage() {
  const routeError = useRouteError();
  const location = useLocation();
  const error = normalizeException(routeError);

  if (
    typeof routeError === "object" &&
    routeError !== null &&
    error === routeError
  ) {
    // Regular error
    return (
      <ErrorPage
        errorText={error.message}
        debuggingDetails={`時期: ${new Date().toISOString()}
Location: ${JSON.stringify(location)}
Uncaught ${error.name}: ${error.message}
Traceback:
${error.stack || JSON.stringify(error)}`}
        traceback={error.stack || JSON.stringify(error)}
      />
    );
  }
  if (isRouteErrorResponse(routeError)) {
    // Not found, etc. error (404)
    console.log(routeError);
    return <NotFound />;
  }
  // Route error
  const text =
    typeof routeError === "object" &&
    routeError !== null &&
    "statusText" in routeError
      ? String(routeError.statusText)
      : error.message;
  return (
    <ErrorPage
      errorText={text}
      debuggingDetails={`
Location: ${JSON.stringify(location)}
Route error:
${JSON.stringify(routeError)}`}
      traceback={JSON.stringify(routeError)}
    />
  );
}

interface ScriptErrorPageProps {
  error: Error;
}

export function ScriptErrorPage({ error }: ScriptErrorPageProps) {
  return (
    <ErrorPage
      errorText={error.message}
      debuggingDetails={`Uncaught ${error.name}: ${
        error.message
      }\nTraceback:\n${error.stack || JSON.stringify(error)}`}
      traceback={error.stack || JSON.stringify(error)}
    />
  );
}
