import {
  AppBar,
  Box,
  Button,
  Chip,
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
import CheckIcon from "@material-ui/icons/Check";
import FlagIcon from "@material-ui/icons/Flag";

const Index: NextPage = () => {
  const directory = useSelectPoeDirectory();
  const remoteFilters = useRemoteFilters();
  const [writeFilterStatus, setWriteFilterStatus] = React.useState("");

  const onClickSelectDirectory = React.useCallback(() => {
    directory.selectDirectory();
  }, [directory]);

  const onClickWriteFilters = React.useCallback(async () => {
    if (remoteFilters.files.length === 0 || directory.handle == null) {
      return;
    }
    try {
      const length = remoteFilters.files.length;
      for (const [index, filter] of remoteFilters.files.entries()) {
        // @ts-expect-error
        const handle = await directory.handle.getFileHandle(filter.path, {
          create: true,
        });
        const stream = await handle.createWritable();
        await stream.write(filter.content);
        await stream.close();
        console.log(filter.path);
        setWriteFilterStatus(`[${index + 1} / ${length}] Writing filters`);
      }
      setWriteFilterStatus(
        `[${length} / ${length}] All filters written succesfully!`
      );
    } catch (error) {
      console.error(error);
      setWriteFilterStatus(`Error: ${error.message ?? error.toString()}`);
      return;
    }
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
              filesystem APIs. Take a look at the{" "}
              <Link
                href="https://caniuse.com/native-filesystem-api"
                rel="noopener noreferrer"
                target="_blank"
              >
                <b>supported browser versions</b>
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
          Newest version: <b>{remoteFilters.tag_name ?? "<Unknown>"}</b>
        </Typography>
        <Typography paragraph>
          Installed version:{" "}
          <b>
            {directory.currentlyInstalledVersion ??
              (directory.type !== "selected"
                ? "<Choose folder first>"
                : "<Not installed>")}
            &nbsp;&nbsp;
            {directory.currentlyInstalledVersion === remoteFilters.tag_name ? (
              <Chip
                color="primary"
                icon={<CheckIcon />}
                label="Up to date"
                size="small"
              />
            ) : (
              <Chip
                color="secondary"
                icon={<FlagIcon />}
                label="Outdated"
                size="small"
              />
            )}
          </b>
        </Typography>
        <Box mb={2}>
          <Divider />
        </Box>
        <Box mb={2}>
          <Typography paragraph>
            <b>Step 1</b>, select your "My Games\Path of Exile" folder using the
            button below.
          </Typography>
          <Box display="flex" alignItems="center">
            <Button
              color="primary"
              variant="contained"
              onClick={onClickSelectDirectory}
              disabled={directory.type === "unsupported"}
            >
              Choose the filter folder
            </Button>
            {directory.type === "selected" && (
              <Box ml={2} display="flex" alignItems="center">
                <CheckIcon fontSize="small" />
                <Box ml={1}>
                  <Typography color="primary">
                    Filter folder selected
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
        <Box mb={2}>
          <Divider />
        </Box>
        <Typography paragraph>
          <b>Step 2</b>, write the most current filters to disk by clicking the
          button below.
        </Typography>
        <Box display="flex" alignItems="center">
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
            Write the filter files
          </Button>
          <Box ml={2}>
            <Typography>{writeFilterStatus}</Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Index;
