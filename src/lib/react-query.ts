import handleAPIError from "@/helpers/handleReactQueryAPIError";
import {
  MutationCache,
  QueryCache,
  QueryClientConfig,
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
