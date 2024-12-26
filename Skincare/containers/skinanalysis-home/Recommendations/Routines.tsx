import {
  Box,
  Card,
  CardContent,
  Container,
  Dialog,
  Grid,
  IconButton,
  Typography,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import VideoCard from "@/components/cards/video-card/VideoCard";
import { routineVideos } from "@/utils/constants";
import ModalVideo from "react-modal-video";
const StyledDietCharWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  paddingTop: 75,
  paddingBottom: 75,

  backgroundColor: theme.palette.common.white,

  "& .image_wrapper": {
    width: "100%",
    height: "300px",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  "& .MuiTypography-h5": {
    fontWeight: 800,
    textTransform: "uppercase",
    color: theme.palette.grey[500],
    fontSize: 30,
    [theme.breakpoints.only("xs")]: {
      textAlign: "center",
      fontSize: 20,
    },
    [theme.breakpoints.only("sm")]: {
      textAlign: "center",
      fontSize: 25,
    },
  },
  "& .MuiTypography-h2": {
    fontWeight: 800,
    //textTransform: "uppercase",
    color: theme.palette.common.white,
    fontSize: 30,
  },
  "& .MuiTypography-h6": {
    fontWeight: 800,
    textTransform: "uppercase",
    marginTop: 15,
  },
  "& .MuiTypography-h3": {
    fontWeight: 800,
    [theme.breakpoints.only("xs")]: {
      fontSize: 35,
    },
    [theme.breakpoints.only("sm")]: {
      fontSize: 45,
    },
  },
  "& span": {
    color: theme.palette.primary.main,
    marginRight: 10,
  },
  "& .video-card": {
    width: "100%",
    height: 200,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "top",
    backgroundColor: theme.palette.grey[100],
    borderRadius: 10,
    "& .overly": {
      position: "absoulte",
      width: "100%",
      height: "100%",
      //borderRadius: 10,
      border: `10px solid ${theme.palette.common.white}`,
      top: 0,
      left: 0,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: `0px 0px 6px 3px rgba(0,0,0,0.16)`,
      "& svg": {
        fontSize: 50,
        color: theme.palette.common.white,
      },
    },
  },
}));

const Routine = () => {
  const [videoLink, setVideoLink] = useState<string | null>(null);
  return (
    <StyledDietCharWrapper>
      <Container maxWidth="lg">
        
      </Container>
      
    </StyledDietCharWrapper>
  );
};

export default Routine;
