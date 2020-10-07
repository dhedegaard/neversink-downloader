import React from "react";

type Result = {
  filters: string[];
  currentlyInstalledVersion: string | undefined;
  type: "unsupported" | "not_selected_yet" | "selected";
  selectDirectory: () => void;
  handle: undefined | FileSystemDirectoryHandle;
};

const useSelectPoeDirectory = (): Result => {
  const [type, setType] = React.useState<Result["type"]>(
    process.browser && !("showDirectoryPicker" in window)
      ? "unsupported"
      : "not_selected_yet"
  );
  const [handle, setHandle] = React.useState<
    FileSystemDirectoryHandle | undefined
  >(undefined);
  const [filters, setFilters] = React.useState<string[]>([]);
  const [
    currentlyInstalledVersion,
    setCurrentlyInstalledVersion,
  ] = React.useState<string | undefined>(undefined);

  // Whenever the handle changes, iterate the files in the directory.
  React.useEffect(() => {
    if (handle == null) {
      return;
    }
    (async () => {
      const filters = [];
      // @ts-expect-error
      for await (const entry of handle.values()) {
        if (!(entry.kind === "file" && entry.name.endsWith(".filter"))) {
          continue;
        }
        filters.push(entry.name);
        entry
          .getFile()
          // @ts-expect-error
          .then((file) => file.text())
          // @ts-expect-error
          .then((content) => {
            const versionLine = content
              .split("\n")
              // @ts-expect-error
              .find((line) => line.startsWith("# VERSION:"));
            if (versionLine == null) {
              return;
            }
            const parts = versionLine.trim().split(" ");
            const version = parts[parts.length - 1];
            setCurrentlyInstalledVersion(version);
          });
      }
      setFilters(filters);
    })();
  }, [handle, setCurrentlyInstalledVersion]);

  const selectDirectory = React.useCallback(() => {
    if (type === "unsupported") {
      return;
    }
    window.showDirectoryPicker!()
      .then((handle) => {
        setHandle(handle);
        setType("selected");
      })
      .catch((error) => {
        console.error(error);
        alert(
          "Error selecting a valid directory, try again or check your logs"
        );
      });
  }, [setHandle, type]);

  return { type, handle, selectDirectory, filters, currentlyInstalledVersion };
};

export default useSelectPoeDirectory;
