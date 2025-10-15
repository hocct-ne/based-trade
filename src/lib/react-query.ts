import handleAPIError from "@/helpers/handleReactQueryAPIError";
import {
  MutationCache,
  QueryCache,
  QueryClientConfig,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

export const queryConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // With SSR, we usually want to set some default staleTime
      // above 0 to avoid refetching immediately on the client
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 3,
    },
  },
  queryCache: new QueryCache({
    onError: (error: Error, query) => {
      if (!query?.meta?.disableErrorHandler) {
        handleAPIError({ error });
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: Error, _variables, _context, mutation) => {
      if (!mutation?.meta?.disableErrorHandler) {
        handleAPIError({ error });
      }
    },
  }),
};

export type ExtractFnReturnType<
  FnType extends (...args: unknown[]) => unknown
> = Awaited<ReturnType<FnType>>;

export type QueryConfig<QueryFnType extends (...args: unknown[]) => unknown> =
  Omit<
    UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
    "queryKey" | "queryFn"
  >;

export type MutationConfig<
  MutationFnType extends (...args: unknown[]) => unknown
> = UseMutationOptions<
  ExtractFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;
