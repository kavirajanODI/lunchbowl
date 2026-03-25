import React from 'react';
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


export default function VijayAntonyPopup({ open, onClose }) {
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
                        <h2>Vijay Antony</h2>
                <h4>Commis 3</h4>
                <p>Our Commis 3, holds a diploma in hotel and catering management from Villupuram. Vijay is a passionate culinary professional with a deep love for cooking. His dedication to the craft, combined with hands-on experience, makes him a promising talent in the world of food and hospitality.</p>
                  </div>
                </div>
            </DialogContent>
        </Dialog>
      </div>
    )
}
  