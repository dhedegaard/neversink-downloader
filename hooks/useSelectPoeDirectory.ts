import React from "react";
import { useIdb } from "./useIdb";

type Result = {
  filters: string[];
  currentlyInstalledVersion: string | undefined;
  type: "unsupported" | "not_selected_yet" | "selected";
  selectDirectory: () => void;
  handle: undefined | FileSystemDirectoryHandle;
};

const useSelectPoeDirectory = (): Result => {
  const database = useIdb();

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

  // Whenever the handle changes, store or fetch the directory handle against the indexed DB.
  React.useEffect(() => {
    if (database == null) {
      return;
    }
    (async () => {
      if (handle != null) {
        // If there's a handle, clear any old handle and store the new one.
        await database.delete("handle", "handle");
        await database.add("handle", handle, "handle");
      } else {
        // Otherwise, look for an old handle to reuse.
        const oldHandle:
          | FileSystemDirectoryHandle
          | undefined = await database.get("handle", "handle");
        if (oldHandle != null) {
          if (
            // @ts-expect-error
            (await oldHandle.requestPermission({ mode: "readwrite" })) !==
            "granted"
          ) {
            // The user cleared denied the request for access, clear the old handle.
            await database.delete("handle", "handle");
          } else {
            // The user accepted the permissions for the old handle, use it.
            setHandle(oldHandle);
            setType("selected");
          }
        }
      }
    })();
  }, [database, handle]);

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
        if (error.message.includes("The user aborted a request.")) {
          return;
        }
        console.error(error);
        alert(
          "Error selecting a valid directory, try again or check your logs"
        );
      });
  }, [setHandle, type]);

  return { type, handle, selectDirectory, filters, currentlyInstalledVersion };
};

export default useSelectPoeDirectory;
