import { NextPage } from "next";
import React from "react";
import { fetchCurrentVersion } from "../fetcher";
import { useRemoteFilters } from "../hooks/useRemoteFilters";
import useSelectPoeDirectory from "../hooks/useSelectPoeDirectory";

type Props = {
  tag_name?: string;
  published_at?: string;
};
const Index: NextPage<Props> = ({ tag_name, published_at }) => {
  const directory = useSelectPoeDirectory();

  const onClickSelectDirectory = React.useCallback(() => {
    directory.selectDirectory();
  }, [directory]);

  const remoteFilters = useRemoteFilters();

  const onClickWriteFilters = React.useCallback(async () => {
    if (remoteFilters.length === 0 || directory.handle == null) {
      return;
    }
    for (const filter of remoteFilters) {
      try {
        // @ts-expect-error
        const handle = await directory.handle.getFileHandle(filter.path, {
          create: true,
        });
        const stream = await handle.createWritable();
        await stream.write(filter.content);
        await stream.close();
        console.log(filter.path);
      } catch (error) {
        console.error(error);
        alert(
          `Error writing filter: ${filter.path}, try again or check your logs`
        );
      }
    }
  }, [remoteFilters, directory]);

  return (
    <div>
      <p>Newest version: {tag_name}</p>
      <p>
        Currently installed version:{" "}
        {directory.currentlyInstalledVersion ?? "<None>"}
      </p>
      <p>
        Published:{" "}
        {published_at != null
          ? new Date(published_at).toLocaleString()
          : "<Error fetching latest version>"}
      </p>
      <button onClick={onClickSelectDirectory}>Vælg mappe!</button>
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

Index.getInitialProps = async () => {
  return (await fetchCurrentVersion()) ?? {};
};

export default Index;
