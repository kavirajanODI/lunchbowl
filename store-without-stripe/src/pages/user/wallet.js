import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Box,
  Typography,
  CircularProgress,
  Pagination,
} from "@mui/material";
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";
import { useSession } from "next-auth/react";
import AccountServices from "@services/AccountServices";

const StepHeader = ({ label }) => (
  <Box className="SetpTabNav" sx={{ textAlign: "center", mb: 6 }}>
    <Box
      className="SetpTabul"
      sx={{
        display: "flex",
        columnGap: 2,
        justifyContent: "space-between",
        paddingBottom: 2,
        borderBottom: "1px dashed #C0C0C0"
      }}
    >
      <Box className="SetpTabli" sx={{ bgcolor: "#FF6A00" }}>
        <Typography sx={{ color: "#fff" }}>{label}</Typography>
      </Box>
    </Box>

    <Box sx={{ height: "2px", borderRadius: "4px", mt: "-2px" }}>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          backgroundColor: "#FF6A00",
        }}
      />
    </Box>
  </Box>
);

const WalletPage = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);


  // Format date like "20 Nov 2025"
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Fetch wallet data
  const loadWallet = async (page = 1) => {
    setLoading(true);
    try {
    const res = await AccountServices.getAccountDetails(userId, null, {
      page,
      limit: 10,
    });
    const raw = res?.data ?? res;

    const data =
      raw?.data && raw.data.wallet
        ? raw.data
        : raw.wallet
          ? raw
          : null;

    setWallet(data.wallet);
    if (res.pagination) {
      setPagination(res.pagination);
    }
    } catch (e) {
      console.error("Failed to load wallet:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userId) loadWallet(currentPage);
  }, [userId, currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };


  return (
    <div className="mywalletpage">
      <Mainheader title="Wallet" description="User Wallet Details" />

      <div className="pagebody">
        {/* Banner Section */}
        <section className="pagebansec MyAccbanersec relative">
          <div className="container mx-auto h-full">
            <div className="pageinconter h-full flex items-center justify-center text-center">
              <div className="hworkTitle combtntb comtilte relative">
                <h1 className="flex flex-row textFF6514">
                  <span>Your</span>
                  <span className="ml-2">Wallet</span>
                </h1>
                <p>View your available points and activity.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mywalletContainer secpaddblock">
          <Box className="container mx-auto relative">
            <StepHeader label="WALLET DETAILS" />

            {loading ? (
              <Box className="cirprogrbox">
                <CircularProgress />
              </Box>
            ) : wallet ? (
              <Box className="walletSection">
                  <div className="walLeftcol">
                    {/* AVAILABLE POINTS CARD */}
                    <Box className="walletPointsBox">
                      <h4> AVAILABLE POINTS </h4>
                      <h2>{wallet.points}</h2>
                      <h5>POINTS</h5>
                    </Box>

                    {/* HOW IT WORKS */}
                    <Box className="walletnote">
                      <h4 className="mb-2">How It Works</h4>
                      <div className="notelistul">
                        <ul style={{ lineHeight: "1.8" }}>
                          <li>Points are added to your wallet when you <strong>cancel</strong> a meal.</li>
                          <li><strong>1Point = ₹1.</strong></li>
                          <li>Saved points can be redeemed in your <strong>next subscription</strong>.</li>
                          <li>Points cannot <strong>be transferred</strong> or <strong>exchanged</strong> for cash.</li>
                        </ul>
                      </div>
                    </Box>
                  </div>
                  <div className="walRightcol">
                    {/* RECENT ACTIVITY TABLE */}
                    <Box
                      className="activityBox"
                    >
                      <h4 className="mb-4">Recent Activity</h4>
                      <div className="tablescroll">
                        <table className="w-full" style={{ borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#F9F9F9" }}>
                              <th className="text-left p-3">DATE</th>
                              <th className="text-left p-3">CHILD NAME</th>
                              <th className="text-left p-3">CANCELLED MEAL</th>
                              <th className="text-left p-3">POINTS</th>
                            </tr>
                          </thead>

                          <tbody>
                            {wallet.history.map((item) => (
                              <tr key={item._id} style={{ borderBottom: "1px solid #eee" }}>
                                <td className="p-3">{formatDate(item.date)}</td>
                                <td className="p-3">{item.childName || "-"}</td>
                                <td className="p-3">{item.mealName || "-"}</td>
                                <td className="p-3">{item.change > 0 ? `+${item.change}` : item.change}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table> 
                      </div>
                        {/* PAGINATION */}
                        {pagination && pagination.totalPages > 1 && (
                        <Box className="paginationbox">
                            <Pagination
                              count={pagination.totalPages}
                              page={currentPage}
                              onChange={handlePageChange}
                            color="primary" className="paginationSec"
                            />
                          </Box>
                      )}
                    </Box>
                  </div>
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <h4>No wallet details available.</h4>
              </Box>
            )}
          </Box>
        </section>
      </div>

      <Mainfooter />
    </div>
  );
};

export default WalletPage;
