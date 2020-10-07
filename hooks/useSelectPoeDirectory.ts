import React from "react";

type Result = {
  filters: string[];
  currentlyInstalledVersion: string | undefined;
} & (
  | {
      type: "unsupported";
      selectDirectory: () => void;
      handle: undefined;
    }
  | { type: "not_selected_yet"; selectDirectory: () => void; handle: undefined }
  | {
      type: "selected";
      handle: FileSystemDirectoryHandle;
      selectDirectory: () => void;
    }
);

const useSelectPoeDirectory = (): Result => {
  const [type, setType] = React.useState<Result["type"]>(
    "showDirectoryPicker" in globalThis ? "not_selected_yet" : "unsupported"
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
      for await (const entry of handle.values()) {
        if (!(entry.kind === "file" && entry.name.endsWith(".filter"))) {
          continue;
        }
        filters.push(entry.name);
        entry
          .getFile()
          .then((file) => file.text())
          .then((content) => {
            const versionLine = content
              .split("\n")
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
      });
  }, [setHandle, type]);

  return { type, handle, selectDirectory, filters, currentlyInstalledVersion };
};

export default useSelectPoeDirectory;
