import Axios from "axios";

type CurrentVersionResponse = {
  tag_name: string;
  zipball_url: string;
  published_at: string;
};
export const fetchCurrentVersion = async (): Promise<
  CurrentVersionResponse
> => {
  const { data } = await Axios.get<CurrentVersionResponse>(
    "https://api.github.com/repos/NeverSinkDev/NeverSink-Filter/releases/latest"
  );
  return data;
};

export type FiltersResponse = Array<{
  path: string;
  content: string;
}>;

export const fetchLatestFilters = async () => {
  const { data } = await Axios.get<FiltersResponse>("/api/latest-zipball");
  return data;
};
