import axios from "axios";
import { useEffect, useState } from "react";
import { useQueries, UseQueryOptions } from "react-query";

/**
 * Wrapper for react-query's useQueries hook,
 * since it does not provide a nice interface for handling
 * the data and isloading states.
 *
 * @param queryEndpoints The list of endpoints that shall be queried.
 * @param additionalOptions Additional options for the react-query lib.
 */
const useMultiQuery = <T extends any>(
  queryEndpoints: string[],
  additionalOptions: UseQueryOptions
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [data, setData] = useState<T[]>([]);

  const multiQuery = useQueries(
    queryEndpoints.map((endpoint) => {
      return {
        queryKey: ["district", endpoint],
        queryFn: () => axios(endpoint),
        ...additionalOptions,
      };
    })
  );

  const refetch = () => {
    multiQuery.forEach((q) => {
      // q.remove();
      q.refetch();
    });
  };

  useEffect(() => {
    const doneQueries = multiQuery.filter((q) => !q.isLoading);
    setIsError(
      !!multiQuery.filter((q) => {
        // Also check for errors that are returned by API
        return q.isError || (!q.isLoading && (q.data as any).data?.error);
      }).length
    );

    // Set loading state
    const loading = doneQueries.length !== multiQuery.length;
    setIsLoading(loading);

    setData(doneQueries.map((e) => (e.data as any).data));
    // eslint-disable-next-line
  }, [multiQuery]);

  return {
    data,
    isLoading,
    refetch,
    isError,
  };
};

export default useMultiQuery;
