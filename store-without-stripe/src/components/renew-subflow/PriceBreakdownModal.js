import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from "@mui/material";

const PriceBreakdownModal = ({
  open,
  onClose,
  numberOfChildren,
  currentPlan,
  walletPoints,
  useWallet,
  BASE_PRICE_PER_DAY = 200,
}) => {

  if (!currentPlan) return null;

  // STEP 1 → Base Price
  const basePrice =
    currentPlan.workingDays * BASE_PRICE_PER_DAY * numberOfChildren;

  // STEP 2 → Discount Calculation
  const discountAmount = basePrice * currentPlan.discount;
  const priceAfterDiscount = basePrice - discountAmount;

  // STEP 3 → Wallet Calculation (Max 80% of discounted price)
  const maxWalletRedeem = priceAfterDiscount * 0.8;
  const walletUsed = useWallet ? Math.min(walletPoints, maxWalletRedeem) : 0;
  const walletLeft = walletPoints - walletUsed;

  // STEP 4 → Final Payable (WITHOUT GST)
  const finalPayable = priceAfterDiscount - walletUsed;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          fontWeight: 700,
          color: "#FF6A00",
          fontSize: "18px",
          borderBottom: "1px solid #eee",
        }}
      >
        Price Breakdown
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
            color: "#232323",
          }}
        >
          <tbody>

            {/* --- CHILDREN --- */}
            <tr>
              <td><strong>No. of Children</strong></td>
              <td>{numberOfChildren}</td>
            </tr>

            {/* --- WORKING DAYS --- */}
            <tr>
              <td><strong>Total Working Days</strong></td>
              <td>{currentPlan.workingDays} days</td>
            </tr>

            {/* --- PRICE CALCULATIONS --- */}
            <tr>
              <td><strong>Price Per Day</strong></td>
              <td>₹ {BASE_PRICE_PER_DAY.toLocaleString("en-IN")}</td>
            </tr>

            <tr>
              <td><strong>Total Before Discount</strong></td>
              <td>
                {currentPlan.workingDays} days × ₹{BASE_PRICE_PER_DAY} ×{" "}
                {numberOfChildren} child(ren) = <br />
                <strong>₹ {basePrice.toLocaleString("en-IN")}</strong>
              </td>
            </tr>

            {/* --- DISCOUNT --- */}
            <tr>
              <td>
                <strong>Discount ({currentPlan.discount * 100}%)</strong>
              </td>
              <td>− ₹ {discountAmount.toLocaleString("en-IN")}</td>
            </tr>

            <tr>
              <td><strong>Price After Discount</strong></td>
              <td>₹ {priceAfterDiscount.toLocaleString("en-IN")}</td>
            </tr>

            {/* --- WALLET --- */}
            {/* <tr>
              <td><strong>Max Wallet Redeem (80% rule)</strong></td>
              <td>₹ {maxWalletRedeem.toLocaleString("en-IN")}</td>
            </tr> */}

            <tr>
              <td><strong>Wallet Used</strong></td>
              <td>
                {useWallet
                  ? `₹ ${walletUsed.toLocaleString("en-IN")}`
                  : "Not Applied"}
              </td>
            </tr>

            <tr>
              <td><strong>Wallet Remaining</strong></td>
              <td>₹ {walletLeft.toLocaleString("en-IN")}</td>
            </tr>

            {/* --- FINAL PAYABLE (NO GST) --- */}
            <tr>
              <td>
                <strong style={{ color: "#FF6A00" }}>
                  Final Amount To Pay
                </strong>
              </td>
              <td
                style={{
                  fontWeight: 700,
                  color: "#FF6A00",
                  fontSize: "16px",
                }}
              >
                ₹ {finalPayable.toLocaleString("en-IN")}
              </td>
            </tr>

          </tbody>
        </table>

        {/* Footer Note */}
        <Typography
          mt={2}
          variant="body2"
          sx={{ textAlign: "center", color: "#888" }}
        >
          <Typography mt={1} fontSize={12} color="#232323">
            <strong>Note:</strong> If your wallet points exceed the subscription amount, only 80% of the wallet value will be applied. The remaining points will be available in the wallet and can be redeemed during the next subscription.
          </Typography>
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          sx={{ color: "#FF6A00", fontWeight: 600, textTransform: "none" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PriceBreakdownModal;
