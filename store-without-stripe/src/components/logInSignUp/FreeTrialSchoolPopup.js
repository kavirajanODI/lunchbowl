import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const FreeTrialSchoolPopup = ({ open, onClose, onSubmit, schools, loadingSchools, errorLoadingSchools }) => {
  const [selectedSchool, setSelectedSchool] = useState("");
  const isButtonEnabled = !!selectedSchool;

  const renderSchoolOptions = () => {
    if (loadingSchools) {
      return <MenuItem disabled>Loading schools...</MenuItem>;
    }
    if (errorLoadingSchools) {
      return <MenuItem disabled>Error loading schools</MenuItem>;
    }
    if (!schools || schools.length === 0) {
      return <MenuItem disabled>No schools available</MenuItem>;
    }
    return schools.map((school) => (
      <MenuItem key={school._id} value={school.name}>
        {school.name} - {school.location}
      </MenuItem>
    ));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" className="ftscholpopup">
      <DialogContent dividers className="ftscholpopupbody">
        <IconButton
          className="ftscholpopupclose"
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          size="large"
        >
          <CloseIcon />
        </IconButton>
        <Typography gutterBottom>
          Dear user, as you want a free trial we have limited it only for this school. If you are part of this school, you can straight away sign up here and have your free trial of our healthy bowl.
        </Typography>
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="school-select-label">Select your school</InputLabel>
          <Select
            labelId="school-select-label"
            id="school-select"
            value={selectedSchool}
            label="Select your school"
            onChange={e => setSelectedSchool(e.target.value)}
          >
            <MenuItem value="">
              <em>-- Select School --</em>
            </MenuItem>
            {renderSchoolOptions()}
          </Select>
        </FormControl>
        <Button onClick={() => onSubmit(selectedSchool)} disabled={!isButtonEnabled} variant="contained" className="ftscholpopupokbtn">
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FreeTrialSchoolPopup;
