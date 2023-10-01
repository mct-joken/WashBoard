import type {
  FetcherWithComponents,
  SubmitFunction,
  SubmitOptions,
} from "@remix-run/react";

export const fetcherSubmitter =
  <API extends Parameters<SubmitFunction>["0"]>(
    fetcher: FetcherWithComponents<any>,
    action: string,
    method: NonNullable<SubmitOptions["method"]>
  ) =>
  (data: API) =>
    fetcher.submit(data, { action: action, method: method });
