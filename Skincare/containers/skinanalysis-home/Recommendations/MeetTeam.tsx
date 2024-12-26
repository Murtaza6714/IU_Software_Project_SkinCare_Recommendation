import { Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import React from "react";
const belina = "imagesTeam.jpg";

const StyledMeetTeamWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  paddingTop: 75,
  paddingBottom: 75,
  backgroundColor: theme.palette.grey[100],
  "& .MuiTypography-h5": {
    fontWeight: 800,
    textTransform: "uppercase",
    color: theme.palette.grey[600],
  },
  "& .MuiTypography-h6": {
    fontWeight: 800,
    textTransform: "uppercase",
    marginTop: 15,
  },
  "& .MuiTypography-h4": {
    fontWeight: 800,
    fontSize: 35,
    marginTop: 45,
  },
  "& .MuiTypography-subtitle1": {
    marginBottom: 5,
  },
  "& .MuiTypography-h3": {
    fontWeight: 800,
  },
  "& span": {
    color: theme.palette.primary.main,
    marginRight: 10,
  },
  "& .author_image": {
    width: "100%",
    height: 400,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "top center",
    borderRadius: 20,
    marginTop: 20,
  },
}));

const MeetTeam = () => {
  return (
    <StyledMeetTeamWrapper>
    
    </StyledMeetTeamWrapper>
  );
};

export default MeetTeam;
