import Axios from "axios";

export type FiltersResponse = {
  files: Array<{
    path: string;
    content: string;
  }>;
  tag_name: string;
};

export const fetchLatestFilters = async () => {
  const { data } = await Axios.get<FiltersResponse>("/api/latest-zipball");
  return data;
};
