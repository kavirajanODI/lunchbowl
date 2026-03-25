import React from "react";
import dayjs from "dayjs"; // Add this import at the top
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import mealPlanData from "../../jsonHelper/Dietitian_meal_plan.json";


// const meals = [
//   "Phulka Channa Masala",
//   "Veg Fried Rice – Veg in Black Bean Sauce",
//   "Paneer Bao -Butter and Garlic Saute Vegetables",
//   "Steamed Momos & Hot Garlic Sauce",
//   "Veg Pulav & Raita",
//   "Veg Fried Rice – Veg in Black Bean Sauce",
//   "Paneer Shashlik & Butter Garlic Rice",
//   "Thai Green Curry with Butter Garlic Rice",
//   "Veg Noodles & Veg Manchurian Gravy",
//   "Sambar Rice & Coined Baby Potato Fry",
//   "Veg Biryani – Raita",
//   "Steamy Rice – Dal Makhani",
//   "Paneer Kati Roll – Khatta Meeta Sauce",
//   "Saffron & Nuts Rice with Kadai Veg",
//   "Phulka Aloo Mutter",
//   "Dal Khichidi & Baby Potato Fry",
//   "Veg Noodles & Veg Manchurian Gravy",
//   "Veg Stroganoff with Butter Garlic Rice",
//   "Veg Alfredo Pasta – Garlic Bread",
//   "Coconut Rice & Brown Chana Poriyal",
//   "Veg Kati Roll – Khatta Meeta Sauce",
//   "Veg Fried Rice – Veg in Black Bean Sauce",
//   "Mint Paratha with Kashmiri Kofta",
//   "Veg Pizza",
//   "Jeera Rice with Aloo Mutter",
//   "Phulka Channa Masala",
//   "Phulka Paneer Butter Masala",
//   "Steamed Momos & Hot Garlic Sauce",
//   "Creamy Curd Rice with Potato Roast",
//   "Coconut Pulav with Crispy Peanut & Bhindi Fry",
//   "Lemon Rice & Sliced Potato Fry"
// ];


const MealPlanDialog = ({
  open,
  onClose,
  startDate,
  planId = 1, // Add this prop
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const [tabValue, setTabValue] = React.useState(planId ? planId - 1 : 0);

  const mealPlans = {
    1: {
      name: "Meal Plan",
      meals: mealPlanData.meal_plan
    },
    2: {
      name: "Meal Plan 2",
      meals: [...mealPlanData.meal_plan].reverse()
    }
  };


  // const handleTabChange = (event, newValue) => {
  //   setTabValue(newValue);
  // };

  // const handleApply = () => {
  //   onApplyPlan(tabValue + 1);
  //   onClose();
  // };
  const plan = mealPlans[planId] || mealPlans[1];
  const renderPlan = (planId) => {
    //const plan = mealPlans[planId];
    const firstCol = plan.meals.slice(0, Math.ceil(plan.meals.length / 2));
    const secondCol = plan.meals.slice(Math.ceil(plan.meals.length / 2));


    const renderColumn = (data, startIndex) => (
      <Box>
        <Box
          display="flex"
          fontWeight="bold"
          borderBottom="1px solid #e0e0e0"
          pb={1}
          mb={1}
        >
          <Box width="30%">DAY</Box>
          {/* <Box width="40%">DATE</Box> */}
          <Box width="30%">MEAL</Box>
        </Box>
        {data.map((item, idx) => {
          const dayNumber = startIndex + idx + 1;
          const mealDate = dayjs(startDate)
            .add(dayNumber - 1, "day")
            .format("MMM D, YYYY");

          return (
            <Box
              key={idx}
              display="flex"
              py={0.5}
              borderBottom="1px solid #f0f0f0"
            >
              <Box width="30%" color="#666">
                {item.day}
              </Box>

              <Box width="30%" color="#333">
                {item.meal}
              </Box>
            </Box>
          );
        })}

      </Box>
    );

    return (
      <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={4}>
        <Box flex={1}>{renderColumn(firstCol, 0)}</Box>
        <Box flex={1}>{renderColumn(secondCol, firstCol.length)}</Box>
      </Box>
    );
  };

  return (
    <Dialog className="MenuplanDialogpop"
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          width: isMobile ? "100%" : "1500px",
          maxWidth: isMobile ? "100%" : "1500px",
          height: isMobile ? "100%" : "auto",
          borderRadius: isMobile ? 0 : 3,
          p: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle className="poptitle"
        sx={{
          width: "100%",
          textAlign: "center",
          color: "#f97316",
          fontWeight: "bold",
          fontSize: "1.8rem",
          textTransform: "uppercase",
          letterSpacing: 1,
          pb: 0,
          position: "relative",
        }}
      >
        {mealPlans[planId]?.name}
        <IconButton className="popclose"
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#999",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>{renderPlan()}</DialogContent>
    </Dialog>
  );
};

export default MealPlanDialog;