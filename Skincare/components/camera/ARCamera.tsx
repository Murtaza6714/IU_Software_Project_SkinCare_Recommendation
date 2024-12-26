import React, { useRef, useState } from "react";
import {
  camera,
  faceDetectionAdapter,
  loadFaceDetectorModels,
} from "@biopassid/face-sdk";
import { arCameraOptions } from "./config";
import Button from "@mui/material/Button";
import { Box, Grid, Typography, styled } from "@mui/material";
import { APP_BAR_SIZE } from "@/utils/constants";
import { Icon } from "@iconify/react";

const StyledARCameraComponent = styled(Box)(({ theme }) => ({
  height: `calc(100vh - ${APP_BAR_SIZE}px)`,
  width: "60%",
  display: "flex",
  flexDirection: "column",
  padding: 20,
  [theme.breakpoints.only("xs")]: {
    padding: 0,
    width: "100%",
    height: `calc(100vh - ${56}px)`,
  },
  "& .camera_capture_view": {
    flex: 1,
    width: "100%",
    position: "relative",
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: theme.palette.secondary.main,
    [theme.breakpoints.only("xs")]: {
      borderRadius: 0,
    },
    "& .info_view": {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.palette.secondary.main,
      "& .MuiTypography-body1": {
        color: theme.palette.common.white,
        fontSize: 18,
        width: "55%",
        lineHeight: 1.3,
        textAlign: "center",
        [theme.breakpoints.only("xs")]: {
          fontSize: 18,
          width: "95%",
        },
      },
      "& svg": {
        fontSize: 120,
        [theme.breakpoints.only("xs")]: {
          fontSize: 100,
        },
      },
    },
    "& .camera_view": {
      width: "100%",
      height: "100%",
    },
    "& .footer": {
      display: "none",
      position: "absolute",
      width: "100%",
      bottom: 40,
      "& .MuiButtonBase-root": {
        minWidth: 0,
      },
      [theme.breakpoints.only("xs")]: {
        padding: 10,
        display: "block",
      },
    },
  },
  "& .camera_view_footer": {
    minHeight: 70,
    maxHeight: 70,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "& .MuiButtonBase-root": {
      minWidth: 0,
    },
    [theme.breakpoints.only("xs")]: {
      padding: 10,
      display: "none",
    },
  },
}));

interface ARCameraComponentProps {
  onCaptured: (file: any) => void;
  onSkip: () => void;
  disabledSkipBtn?: boolean;
  initializing: boolean;
}

const ARCameraComponent = ({
  onCaptured,
  onSkip,
  disabledSkipBtn,
  initializing,
}: ARCameraComponentProps) => {
  const { takePicture } = camera();
  const [isCamOpen, setIsCamOpen] = useState<boolean>(false);
  const refAccessFiles = useRef<HTMLInputElement>(null);

  async function handleTakePicture() {
    setIsCamOpen(true);
    await loadFaceDetectorModels();
    try {
      const resp = await takePicture({
        element: document.querySelector("#elementId") as HTMLDivElement,
        faceDetectionAdapter: faceDetectionAdapter,
        options: arCameraOptions,
      });
      onCaptured(resp?.base64);
      setIsCamOpen(false);
    } catch (error) {
      setIsCamOpen(false);
    }
  }

  const handleUploadFiles = async (event: any) => {
    let file = event?.target?.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      onCaptured(reader.result);
    };
    reader.onerror = function (error) {
      alert("Something wrong please try again...");
    };
  };

  return (
    <StyledARCameraComponent>
      <Box component="div" className="camera_capture_view">
        {!isCamOpen && (
          <Box component="div" className="info_view">
            <Box mb={2}>
              <Icon icon="tabler:camera-selfie" />
            </Box>
            <Typography variant="body1">
              {initializing
                ? "Please wait..."
                : "Please, set your desired configurations and press the Capture button to start"}
            </Typography>
          </Box>
        )}
        {isCamOpen && (
          <Box component="div" id="elementId" className="camera_view"></Box>
        )}
        <Box component="div" className="footer">
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item xs={4}>
              <Button
                disabled={initializing}
                fullWidth={true}
                variant="contained"
                color="milkWhite"
                onClick={() => {
                  if (isCamOpen) {
                    return null;
                  } else {
                    refAccessFiles?.current?.click();
                  }
                }}
              >
                Gallery
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth={true}
                onClick={() => {
                  if (isCamOpen) {
                    return null;
                  } else {
                    handleTakePicture();
                  }
                }}
              >
                Capture
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                disabled={initializing}
                color="inherit"
                fullWidth={true}
                onClick={() => {
                  if (isCamOpen || disabledSkipBtn) {
                    return null;
                  } else {
                    onSkip();
                  }
                }}
              >
                Skip
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box component="div" className="camera_view_footer">
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={4}>
            <Button
              fullWidth={true}
              variant="outlined"
              disabled={initializing}
              onClick={() => {
                if (isCamOpen) {
                  return null;
                } else {
                  refAccessFiles?.current?.click();
                }
              }}
            >
              Gallery
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              fullWidth={true}
              disabled={isCamOpen || initializing}
              onClick={handleTakePicture}
            >
              Capture
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              color="inherit"
              disabled={disabledSkipBtn || initializing}
              fullWidth={true}
              onClick={() => {
                if (isCamOpen) {
                  return null;
                } else {
                  onSkip();
                }
              }}
            >
              Skip
            </Button>
          </Grid>
        </Grid>
      </Box>
      <input
        ref={refAccessFiles}
        type="file"
        accept="image/*"
        hidden
        onChange={handleUploadFiles}
      />
    </StyledARCameraComponent>
  );
};

export default ARCameraComponent;
