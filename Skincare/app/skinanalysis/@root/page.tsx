import React from "react";
import AnalysisForm from "@/containers/forms/AnalysisForm";
import authOptions from "@/app/api/auth/[...nextauth]/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/utils/routes";

const AnalysisRootPage = async () => {
  // const session = await getServerSession(authOptions);
  // if (session?.user) {
  //   return redirect(APP_ROUTES.SELFIE);
  // }
  return <AnalysisForm />;
};

export default AnalysisRootPage;
