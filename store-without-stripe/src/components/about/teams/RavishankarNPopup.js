import React from 'react';
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


export default function RavishankarNPopup({ open, onClose }) {
    return (   
      <div>
        <Dialog
            className="compopups overflow-hidden"
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <IconButton
                className="popClose"
                onClick={onClose}
                sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 1,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                },
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent sx={{ p: 0, height: "100%" }}>
                <div className='TeamMemberPopSec'>
                  <div className='TeamMemberTitles' data-aos="fade-left" data-aos-duration="1000" >                    
                        <h2>Ravishankar N</h2>
                <h4>Manager Operations</h4>
                <p>Ravi is an experienced operations specialist and supervisor with a strong background in managing processes across several notable private firms. With a sharp eye for efficiency and a deep understanding of operations, Ravi has consistently driven results through structured execution and team leadership. Now bringing his expertise into the food industry, he is set to apply his operational acumen to streamline workflows, enhance service quality, and contribute to building scalable systems in this dynamic sector.</p>
                  </div>
                </div>
            </DialogContent>
        </Dialog>
      </div>
    )
}
  