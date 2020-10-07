import React from "react";
import { IDBPDatabase } from "idb";
import * as idb from "idb";

/**
 * Opens an indexed DB and returns a ref to it.
 *
 * The outer component is re-rendered after the database is first opened.
 */
export const useIdb = (): IDBPDatabase | undefined => {
  const [database, setDatabase] = React.useState<IDBPDatabase>();

  React.useEffect(() => {
    idb
      .openDB("neversink-downloader", 2, {
        upgrade: (database, oldVersion) => {
          if (oldVersion < 2) {
            database.createObjectStore("handle");
          }
        },
      })
      .then((database) => {
        setDatabase(database);
      });
  }, [setDatabase]);

  return database;
};
