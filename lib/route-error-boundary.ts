import { apiError } from "./api-response";
import { ApiErrorCode } from "./api-error-codes";

type RouteHandler = (request: Request) => Promise<Response>;

type ErrorBoundaryOptions = {
  onError?: (error: unknown) => Response;
};

export function withRouteErrorBoundary(
  handler: RouteHandler,
  options?: ErrorBoundaryOptions
): RouteHandler {
  return async (request: Request) => {
    try {
      return await handler(request);
    } catch (error) {
      if (options?.onError) {
        return options.onError(error);
      }

      console.error("[route-error-boundary]", error);
      return apiError("Internal server error", ApiErrorCode.INTERNAL_ERROR, 500);
    }
  };
}
