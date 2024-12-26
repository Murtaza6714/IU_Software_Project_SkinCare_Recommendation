import React from "react";
import { Page, View, Text, StyleSheet, Image } from "@react-pdf/renderer";
import { APP_COLORS } from "@/theme/colors/colors";
const belina = "/images/belna.png";
interface TeamViewProps {
  fontFamily: string;
}

const TeamView = ({ fontFamily }: TeamViewProps) => {
  const styles = StyleSheet.create({
    page: {
      display: "flex",
      flexDirection: "column",
      padding: 20,
    },
    pageTitle: {
      fontFamily: fontFamily,
      fontWeight: 900,
      fontSize: 26,
      textAlign: "center",
      marginBottom: 6,
    },
    pageSubTitle: {
      fontFamily: fontFamily,
      fontWeight: 500,
      fontSize: 14,
      textAlign: "center",
    },
    pageContent: {
      fontFamily: fontFamily,
      fontWeight: 500,
      fontSize: 14,
      textAlign: "justify",
      paddingLeft: 30,
      paddingRight: 30,
    },
    teamImage: {
      flex: 1,
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    teamContent: {
      flex: 1,
      width: "100%",
      padding: 20,
      paddingTop: 30,
    },
  });

  return (
    <Page size="A4" style={{ ...styles.page }}>
     
    </Page>
  );
};

export default TeamView;
