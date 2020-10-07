interface Window {
  /** Patch in the "showDirectoryPicker" function, it's not in the typescript types yet. */
  showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
}

interface FileSystemDirectoryHandle {
  kind: "directory" | "file";
  name: string;
}
