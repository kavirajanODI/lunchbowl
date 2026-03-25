import React from 'react';
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


export default function MuruganPopup({ open, onClose }) {
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
                        <h2>S. Murugan</h2>
                <h4>Executive Chef</h4>
                <p>He is an award-winning culinary professional with over 25 years of experience, including 13 years in management roles within the hospitality industry. He specializes in innovative cooking, menu development, and streamlining kitchen operations while maintaining high standards of quality and guest satisfaction. With expertise in Continental, Chinese, North Indian, South Indian, Tandoor, Italian, Asian, and European cuisines, he has successfully led culinary teams in various hotels across India and abroad. </p>
                  </div>
                </div>
            </DialogContent>
        </Dialog>
      </div>
    )
}
  