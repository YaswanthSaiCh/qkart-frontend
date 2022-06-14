import * as React from "react";
// import Box from '@mui/material/Box';
import Rating from "@mui/material/Rating";
// import Typography from '@mui/material/Typography';

export default function BasicRating(prop) {
  return (
    <>
      {/* <Typography component="legend">Read only</Typography> */}
      <Rating name="read-only" value={prop.rating} readOnly />
    </>
  );
}