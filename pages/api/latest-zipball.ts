import Axios from "axios";
import { NextApiHandler } from "next";
import { fetchCurrentVersion } from "../../fetcher";
import unzipper from "unzipper";
import { ReadStream } from "fs";

type Entry = {
  path: string;
  content: string;
};

/** Extracts all the relevant files with their content, returning a list of them. */
const getAllFilters = async (data: ReadStream): Promise<Entry[]> => {
  const result: Entry[] = [];
  const zip = data.pipe(unzipper.Parse({ forceStream: true }));
  for await (const entry of zip) {
    const fileName: string = entry.path.slice(entry.path.indexOf("/") + 1);
    if (fileName.endsWith(".filter") && !fileName.includes("/")) {
      const chunks: any[] = [];
      for await (const chunk of entry) {
        chunks.push(chunk);
      }
      result.push({
        path: fileName,
        content: Buffer.concat(chunks).toString("utf8"),
      });
    } else {
      entry.autodrain();
    }
  }
  return result;
};

const latestZipball: NextApiHandler = async (req, res) => {
  const { zipball_url, tag_name } = await fetchCurrentVersion();

  if (zipball_url == null || tag_name == null) {
    return res.status(500).end("Error fetching release info from Github.");
  }

  const { data } = await Axios.get(zipball_url, { responseType: "stream" });
  const entries = await getAllFilters(data);
  return res.json({
    files: entries,
    tag_name,
  });
};

export default latestZipball;
