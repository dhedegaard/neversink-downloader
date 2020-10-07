import React from "react";
import { fetchLatestFilters, FiltersResponse } from "../fetcher";

export const useRemoteFilters = () => {
  const [filters, setFilters] = React.useState<FiltersResponse>([]);

  React.useEffect(() => {
    fetchLatestFilters()
      .then((resp) => {
        setFilters(resp);
      })
      .catch((error) => {
        console.error(error);
        alert(
          "Error fetching the latest filters, check your logs or try again"
        );
      });
  }, [setFilters]);

  return filters;
};
