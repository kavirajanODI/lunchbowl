
import React from 'react';
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


export default function ArulMathanThangamPopup({ open, onClose }) {
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
                        <h2>Arul Mathan Thangam </h2>
                <h4>Sous Chef</h4>
                <p>Our Sous Chef, is a skilled culinary professional with expertise in food production, customer service, and maintaining quality standards.  With a strong background in preparing diverse cuisines and ensuring proper food handling practices, he excels in creating flavourful dishes while adhering to hygiene and safety protocols. His proficiency in culinary techniques, ingredient preparation, and production processes makes him a reliable and efficient chef dedicated to delivering exceptional dining experiences.  Fluent in Tamil, English, and Hindi, he is committed to continuous learning and adapting to new culinary trends.</p>
                  </div>
                </div>
            </DialogContent>
        </Dialog>
      </div>
    )
}
  