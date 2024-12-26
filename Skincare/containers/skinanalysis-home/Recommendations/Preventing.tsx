import { Divider, Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import React, { Fragment } from "react";
import { useSession } from "next-auth/react";

interface PreventingInfoProps {
  useData: any;
  data: any;
}

const StyledPreventingWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  paddingTop: 75,
  paddingBottom: 75,
  minHeight: 400,
  display: "flex",
  backgroundColor: "#eccc68",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",

  "& .user_profile_image": {
    width: 300,
    height: 350,
    [theme.breakpoints.only("xs")]: {
      width: 200,
      height: 220,
    },
    [theme.breakpoints.only("sm")]: {
      width: 200,
      height: 220,
    },
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: 20,
    border: `5px solid ${theme.palette.common.white}`,
    boxShadow: `0px 0px 65px -28px rgba(0,0,0,0.75)`,
  },
  "& .MuiTypography-h5": {
    fontWeight: 800,
    textTransform: "uppercase",
    color: theme.palette.grey[900],
  },
  "& .MuiTypography-h6": {
    fontWeight: 700,
    fontSize: 25,
    [theme.breakpoints.only("xs")]: {
      textAlign: "center",
      fontSize: 20,
    },
    [theme.breakpoints.only("sm")]: {
      textAlign: "center",
      fontSize: 25,
    },
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
  "& .MuiTypography-subtitle1": {
    fontWeight: 400,
    [theme.breakpoints.only("xs")]: {
      textAlign: "center",
    },
    [theme.breakpoints.only("sm")]: {
      textAlign: "center",
    },
  },
  "& span": {
    color: theme.palette.primary.main,
    marginRight: 10,
  },
}));

const PreventingView = ({ useData, data }: PreventingInfoProps) => {
  const { data: session } = useSession();

  return (
    <StyledPreventingWrapper>
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs={12}>
            <Box mb={4}>
              <Typography gutterBottom textAlign="center" variant="h5">
                WHAT'S PREVENTING YOU TO
              </Typography>
              <Typography textAlign="center" variant="h3">
              Unleash <span>Your Glow</span>On
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box mt={4}>
          <Grid container spacing={6}>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              item
              xs={12}
              md={6}
            >
              <Box
                component="div"
                className="user_profile_image"
                sx={{ backgroundImage: `url(${useData?.data?.url})` }}
              ></Box>
            </Grid>
            <Grid container item xs={12} md={6}>
              <Grid item xs={12}>
                {session?.user?.skinType && (
                  <Fragment>
                    <Typography
                      mb={2}
                      fontWeight={700}
                      variant="subtitle1"
                      gutterBottom
                    >
                      Your Skin Type
                    </Typography>
                    <Typography fontWeight={700} variant="h6" gutterBottom>
                      {session?.user?.skinType}
                    </Typography>
                    <Box mt={2} mb={2}>
                      <Divider />
                    </Box>
                  </Fragment>
                )}

                <Typography
                  mb={2}
                  fontWeight={700}
                  variant="subtitle1"
                  gutterBottom
                >
                  Skin Analysis Atributes
                </Typography>
                {data?.data?.[0]?.attributeCode?.map(
                  (item: any, index: number) => (
                    <Typography
                      key={index}
                      fontWeight={700}
                      variant="h6"
                      gutterBottom
                    >
                     
                     ({item.code})-{item?.attribute.replace("_", " ")}
                    </Typography>
                  )
                )}

                {data?.data?.[0]?.skinSummary && (
                  <Box mt={2}>
                    <Typography
                      mb={2}
                      fontWeight={700}
                      variant="subtitle1"
                      gutterBottom
                    >
                      Skin Analysis Summary
                    </Typography>
                    <Typography fontWeight={700}>{data?.data?.[0]?.skinSummary}</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </StyledPreventingWrapper>
  );
};

export default PreventingView;
