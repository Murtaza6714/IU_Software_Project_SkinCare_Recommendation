import { dgftPlaceholderImg } from "@/utils/constants";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import React from "react";
import { Typography } from "@mui/material";

const StyledDgftConsultancy = styled(Box)(({ theme }) => ({
  padding: `100px 150px`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundSize: "cover",
  minHeight: 600,
  overflow: "hidden",
  position: "relative",
  "& .__overly": {
    position: "absolute",
    padding: `0px 150px`,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "& .MuiTypography-root": {
    color: theme.palette.common.white,
  },
  "& .MuiTypography-h2": {
    fontWeight: 800,
  },
}));

const DgftConsultancy = () => {
  return (
    <StyledDgftConsultancy
      style={{
        backgroundImage: `url(${dgftPlaceholderImg})`,
      }}
    >
      <Box component="div" className="__overly">
        <Grid container>
          <Grid item xs={12}>
            <Typography mb={4} textAlign="center" variant="h2">
              DGFT CONSULTANCY
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography mb={2} textAlign="justify">
              Elite Consultants is a professional consulting firm for importers
              and exporters in India. We help them for facilitation of various
              licences from DGFT (Directorate General of Foreign Trade). We
              provide support to clients in preparing applications,
              documentation of import-export statements, monitoring exports
              against licences taken from DGFT, representing them before DGFT
              and Customs Commissioners in case of any litigations and give the
              best advice for their import export related queries.
            </Typography>
            <Typography textAlign="justify">  1 We have been in this business since last two decades and we have
              accumulated vast knowledge in interpretation of the Foreign Trade
              Policy and the best practices to follow for doing imports and
              exports. There are various schemes from Govt. of India to make
              exports from India more competent in the International market.
              DGFT is the controlling office which monitors the operations of
              these schemes. We help businesses to get benefits of these schemes
              by following the prescribed procedures of DGFT</Typography>
          </Grid>
        </Grid>
      </Box>
    </StyledDgftConsultancy>
  );
};

export default DgftConsultancy;
