
import React from 'react';
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


export default function VijayVellanganniPopup({ open, onClose }) {
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
                        <h2>Vijay Vellanganni</h2>
                <h4>Commis 1</h4>
                <p>Our Commis 1,a remarkably talented baker and continental cuisine chef. With a flair for baking, Vijay crafts irresistible cookies, brownies, and an array of continental specialties. Beyond sweets, he’s mastered pizzas, puff, pastries, and savory dishes with finesse. Vijay brings professional experience from esteemed hospitality brands such as Pride Hotels, Grand Regent, and Get Sherlock, where his culinary expertise earned respect and praise in high quality hotel kitchens. Whether it's a perfectly chewy chocolate brownie or a crisp, flaky puff, Vijay blends passion and precision in every creation.</p>
                { /*<p className='paraalink'>
                            <Link href="/">
                            <span>LinkedIn</span>
                            </Link>
                        </p>*/ }
                  </div>
                </div>
            </DialogContent>
        </Dialog>
      </div>
    )
}
  