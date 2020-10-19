import React from "react";
import { fetchLatestFilters, FiltersResponse } from "../fetcher";

export const useRemoteFilters = () => {
  const [filters, setFilters] = React.useState<
    FiltersResponse & { loading: boolean }
  >({
    files: [],
    tag_name: "<Fetching>",
    loading: true,
  });

  const innerFetchRemoteFilters = React.useCallback(() => {
    setFilters({
      files: [],
      tag_name: "<Fetching>",
      loading: true,
    });
    fetchLatestFilters()
      .then((resp) => {
        setFilters({
          ...resp,
          loading: false,
        });
      })
      .catch((error) => {
        console.error(error);
        alert(
          "Error fetching the latest filters, check your logs or try again"
        );
      });
  }, []);

  const refetchRemoteFilters = React.useCallback(() => {
    if (filters.loading) {
      return;
    }
    innerFetchRemoteFilters();
  }, [filters, innerFetchRemoteFilters]);

  React.useEffect(() => {
    innerFetchRemoteFilters();
  }, [innerFetchRemoteFilters]);

  return { filters, refetchRemoteFilters };
};
