"use client";
import { useEffect, useState } from "react";
import { Card, Chip } from "@mui/material";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import getWardFromAddress from "@/helper/getWardFromAddress";
import splitAddressAndWard from "@/helper/splitAddressAndWard";
import {Domain} from "@mui/icons-material";

const BranchDetails = ({ params }: { params: { branchID: string }}) => {
  const [branch, setBranch] = useState({
    branchName: "",
    phoneNumber: "",
    address: "",
    ward: "",
    province: "",
    district: "",
    postalCode: "",
  });
  const [reloadBranch, setReloadBranch] = useState(true);
  const fetchBranch = async () => {
    const response = await fetch(`/api/branches/getbyid/${params.branchID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  };
  useEffect(() => {
    if (reloadBranch) {
      fetchBranch().then((data) => {
          const {address, ward} = splitAddressAndWard(data.data.address);
          setBranch({...data.data, address, ward});
          setReloadBranch(false);
      });
    }
  }, [reloadBranch]);

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          width: "fit-content",
          padding: "5px 20px",
          backgroundColor: "primary.main",
          color: "white",
        }}
      >
        <span>Details of branch ID: {params.branchID}</span>
      </Paper>
      <Divider />
      <Card sx={{
        padding: "20px",
        margin: "20px 0",
      }}>
        <h3>Branch Name: {branch.branchName}</h3>
        <p>Phone Number: {branch.phoneNumber}</p>
        <p>Address: {branch.address}</p>
        <p>Ward: {branch.ward}</p>
        <Chip label="Active" color="success" />
      </Card>
    </>
  )
}
export default BranchDetails;
