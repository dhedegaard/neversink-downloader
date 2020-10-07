import { NextPage } from "next";
import React from "react";
import { useRemoteFilters } from "../hooks/useRemoteFilters";
import useSelectPoeDirectory from "../hooks/useSelectPoeDirectory";

const Index: NextPage = () => {
  const directory = useSelectPoeDirectory();

  const onClickSelectDirectory = React.useCallback(() => {
    directory.selectDirectory();
  }, [directory]);

  const remoteFilters = useRemoteFilters();

  const onClickWriteFilters = React.useCallback(async () => {
    if (remoteFilters.files.length === 0 || directory.handle == null) {
      return;
    }
    for (const filter of remoteFilters.files) {
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
      <p>Newest version: {remoteFilters.tag_name ?? "<Unknown>"}</p>
      <p>
        Currently installed version:{" "}
        {directory.currentlyInstalledVersion ?? "<None>"}
      </p>
      <button onClick={onClickSelectDirectory}>Vælg mappe!</button>
      {(remoteFilters.files.length > 0 || directory.handle != null) && (
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
        {remoteFilters.files.map((filter) => (
          <li key={filter.path}>{filter.path}</li>
        ))}
      </ul>
    </div>
  );
};

export default Index;
