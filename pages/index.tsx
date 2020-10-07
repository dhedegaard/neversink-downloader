import { NextPage } from "next";
import React from "react";
import {
  fetchCurrentVersion,
  fetchLatestFilters,
  FiltersResponse,
} from "../fetcher";
import useSelectPoeDirectory from "../hooks/useSelectPoeDirectory";
import Axios from "axios";

type Props = {
  tag_name: string;
  published_at: string;
};
const Index: NextPage<Props> = ({ tag_name, published_at }) => {
  const directory = useSelectPoeDirectory();

  const onClickSelectDirectory = React.useCallback(() => {
    directory.selectDirectory();
  }, [directory]);

  const [remoteFilters, setRemoteFilters] = React.useState<FiltersResponse>([]);
  const onClickUpdatefilters = React.useCallback(() => {
    fetchLatestFilters().then((resp) => {
      setRemoteFilters(resp);
    });
  }, [setRemoteFilters, fetchLatestFilters]);

  const onClickWriteFilters = React.useCallback(async () => {
    if (remoteFilters.length === 0 || directory.handle == null) {
      return;
    }
    for (const filter of remoteFilters) {
      // @ts-expect-error
      const handle = await directory.handle.getFileHandle(filter.path, {
        create: true,
      });
      const stream = await handle.createWritable();
      await stream.write(filter.content);
      await stream.close();
      console.log(filter.path);
    }
  }, [remoteFilters, directory]);

  return (
    <div>
      <p>Newest version: {tag_name}</p>
      <p>
        Currently installed version:{" "}
        {directory.currentlyInstalledVersion ?? "<None>"}
      </p>
      <p>Published: {new Date(published_at).toLocaleString()}</p>
      <button onClick={onClickSelectDirectory}>Vælg mappe!</button>
      <button onClick={onClickUpdatefilters}>Opdatér filtre</button>
      {(remoteFilters.length > 0 || directory.handle != null) && (
        <button onClick={onClickWriteFilters}>Skriv filtre!</button>
      )}
      <h1>Local filters:</h1>
      <ul>
        {directory.filters.map((filter) => (
          <li key={filter}>{filter}</li>
        ))}
      </ul>
      {}
      <h1>Remote filters:</h1>
      <ul>
        {remoteFilters.map((filter) => (
          <li key={filter.path}>{filter.path}</li>
        ))}
      </ul>
    </div>
  );
};

Index.getInitialProps = () => fetchCurrentVersion();

export default Index;
