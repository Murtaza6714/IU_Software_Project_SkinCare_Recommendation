"use client";
import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import { AiFillInstagram, AiFillYoutube, AiFillFacebook } from "react-icons/ai";

import Typography from "@mui/material/Typography";
import { Divider, IconButton } from "@mui/material";
import { APP_COLORS } from "@/theme/colors/colors";

const StyledFooterMainBox = styled(Box)(({ theme }) => ({
  height: "100%",
  backgroundColor: APP_COLORS.DARK_NAVGREEN_BLUE,
  paddingTop: 75,
  paddingBottom: 75,
  "& .logo__title": {
    color: theme.palette.common.white,
    marginBottom: 20,
    fontWeight: 700,
  },
  "& .address": {
    color: theme.palette.common.white,
    marginTop: 10,
    fontSize: 14,
    width: "56%",
    margin: "0px auto",
  },
  "& .menu_heading": {
    color: theme.palette.common.white,
    marginBottom: 20,
  },
}));

const StyledSectionDivider = styled(Divider)(({ theme }) => ({
  width: 300,
  borderColor: theme.palette.grey[800],
  marginTop: 20,
  marginBottom: 10,
}));

const FooterComponent = () => {
  const handleSocialLinkNavigation = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <StyledFooterMainBox>
      <Container maxWidth="lg">
        <Grid
          container
          alignItems="center"
          direction="column"
          justifyContent="center"
        >
          <Grid item>
            <Box mb={3} textAlign="center">
            </Box>
            <Typography
              className="address"
              color=""
              textAlign="center"
              variant="body1"
            >
              3/2 Nai Bagad, Rani Pura, Indore - 452007
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <StyledSectionDivider />
          </Grid>
          <Grid item alignItems="center" justifyContent="center" container>
            <Grid item>
              <IconButton
                
                sx={(theme) => ({ color: theme.palette.common.white })}
              >
                <AiFillInstagram />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                
                sx={(theme) => ({ color: theme.palette.common.white })}
              >
                <AiFillYoutube />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                sx={(theme) => ({ color: theme.palette.common.white })}
              >
                <AiFillFacebook />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </StyledFooterMainBox>
  );
};

export default FooterComponent;
