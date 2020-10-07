import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Link,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { NextPage } from "next";
import React from "react";
import { useRemoteFilters } from "../hooks/useRemoteFilters";
import useSelectPoeDirectory from "../hooks/useSelectPoeDirectory";

const Index: NextPage = () => {
  const directory = useSelectPoeDirectory();
  const remoteFilters = useRemoteFilters();

  const onClickSelectDirectory = React.useCallback(() => {
    directory.selectDirectory();
  }, [directory]);

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
        return;
      }
    }
    alert("Filters written succesfully");
  }, [remoteFilters, directory]);

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Container maxWidth="md">
            <Typography variant="h6">Neversink downloader</Typography>
          </Container>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        {directory.type === "unsupported" && (
          <Box mt={1}>
            <Alert severity="error">
              <b>Error</b>: Your browser does not support the required
              filesystem APIs. See what browsers are supported{" "}
              <Link
                href="https://caniuse.com/native-filesystem-api"
                rel="noopener noreferrer"
                target="_blank"
              >
                <b>here</b>
              </Link>
              .
            </Alert>
          </Box>
        )}
        <Box mt={2}>
          <Typography paragraph>
            A simple solution to helping you keep your Neversink lootfilter up
            to date.
          </Typography>
        </Box>
        <Typography paragraph>
          Newest version: {remoteFilters.tag_name ?? "<Unknown>"}
        </Typography>
        <Typography paragraph>
          Currently installed version:{" "}
          {directory.currentlyInstalledVersion ?? "<None>"}
        </Typography>
        <Box mb={2}>
          <Divider />
        </Box>
        <Box mb={2}>
          <Typography paragraph>
            <b>Step 1</b>, select your "My Games\Path of Exile" folder using the
            button below.
          </Typography>
          <Button
            color="primary"
            variant="contained"
            onClick={onClickSelectDirectory}
            disabled={directory.type === "unsupported"}
          >
            Choose the filter folder.
          </Button>
        </Box>
        <Box mb={2}>
          <Divider />
        </Box>
        <Typography paragraph>
          <b>Step 2</b>, write the most current filters to disk by clicking the
          button below.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onClickWriteFilters}
          disabled={
            remoteFilters.files.length === 0 ||
            directory.handle == null ||
            directory.type === "unsupported"
          }
        >
          Skriv filtre!
        </Button>
      </Container>
    </>
  );
};

export default Index;
