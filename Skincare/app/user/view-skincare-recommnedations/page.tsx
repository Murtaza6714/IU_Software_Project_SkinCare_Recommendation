"use client";
import React from "react";
import UserSkinAnalysisRecommendation from "@/containers/skinanalysis-home/ViewUserSkincareRecommendations";
import VisiterLayout from "@/components/layouts/VisiterLayout";
import _ from "lodash";

const ViewSkinCareRecommendations = () => {
  return (
    <VisiterLayout>
      <UserSkinAnalysisRecommendation />
    </VisiterLayout>
  );
};

export default ViewSkinCareRecommendations;
