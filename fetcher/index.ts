import Axios from "axios";

type CurrentVersionResponse = {
  tag_name?: string;
  zipball_url?: string;
  published_at?: string;
};
export const fetchCurrentVersion = async (): Promise<
  CurrentVersionResponse
> => {
  try {
    const { data } = await Axios.get<CurrentVersionResponse>(
      "https://api.github.com/repos/NeverSinkDev/NeverSink-Filter/releases/latest"
    );
    return data ?? {};
  } catch (error) {
    console.error(error.message);
    return {};
  }
};

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
