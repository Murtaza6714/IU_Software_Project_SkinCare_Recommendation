"use client";
import React, { Fragment } from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { Box, Toolbar } from "@mui/material";
import { LOGO_URL } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import FooterComponent from "../footer";

const drawerWidth = 200;
interface QuestionLayoutProps {
  children: React.ReactNode;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const Main = styled("main")(({ theme }) => ({
  marginLeft: 0,
  paddingTop: 64,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const QuestionLayout = ({ children }: QuestionLayoutProps) => {
  return (
    <Fragment>
      <AppBar color="primary" position="fixed" open={false}>
        <Toolbar>
          <Box mt={1} flexGrow={1}>
          </Box>
        </Toolbar>
      </AppBar>
      <Main>{children}</Main>
    </Fragment>
  );
};

export default QuestionLayout;
