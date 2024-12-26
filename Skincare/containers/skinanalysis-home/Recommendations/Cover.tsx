import { Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import React from "react";
const StyledDietCharWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  paddingTop: 75,
  paddingBottom: 75,
  minHeight: 400,
  [theme.breakpoints.only('xs')]:{
    minHeight: 200,
  },
  [theme.breakpoints.only('sm')]:{
    minHeight: 250,
  },
  [theme.breakpoints.up('sm')]:{
    minHeight: 300,
  },
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.primary.main,
  "& .MuiTypography-h2": {
    fontWeight: 800,
    textTransform: "uppercase",
    color: theme.palette.common.white,
    [theme.breakpoints.only('xs')]:{
      fontSize:30
    },
    [theme.breakpoints.only('sm')]:{
      fontSize:35
    },
    [theme.breakpoints.up('sm')]:{
      fontSize:55
    },
  },
  "& .MuiTypography-subtitle1": {
    fontWeight: 400,
    color: theme.palette.common.white,
    letterSpacing:2,
    fontSize:26,
    [theme.breakpoints.between('xs','sm')]:{
      fontSize:20
    }
  },
}));

const CoverPage = () => {
  return (
    <StyledDietCharWrapper>
      <Box>
        <Grid container flexDirection="column">
          <Grid item>
            <Typography textAlign="center" variant="h2">Unleash YOUR GLOW ON</Typography>
            <Typography textAlign="center" variant="subtitle1">Analysis & Recommendations</Typography>
          </Grid>
        </Grid>
      </Box>
    </StyledDietCharWrapper>
  );
};

export default CoverPage;
