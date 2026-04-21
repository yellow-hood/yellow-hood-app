import { NextResponse } from "next/server";

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

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
