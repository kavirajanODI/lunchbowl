import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Box,
  useMediaQuery,
  useTheme,
  Dialog,
  CircularProgress,
  Tabs,
  Tab
} from "@mui/material";
import LeftPanel from "./LeftPanel";
import CenterPanel from "./CenterPanel";
import RightPanel from "./RightPanel";
import MealPlanDialog from "./MealPlanDialog";
import useRegistration from "@hooks/useRegistration";
import AttributeServices from "../../services/AttributeServices";
import useAsync from "../../hooks/useAsync";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useSession } from "next-auth/react";
import dietitianMealPlanData from "../../jsonHelper/Dietitian_meal_plan.json";
import { set } from "local-storage";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const MenuCalendar = () => {
  const { data: session } = useSession();

  const today = dayjs();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { data, reload } = useAsync(AttributeServices.getAllHolidays);
  // const [initialLoading, setInitialLoading] = useState(true);

  // New for multi-plan support
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);

  // Plan-dependent state
  const [children, setChildren] = useState([]);
  const [subscriptionStart, setSubscriptionStart] = useState(dayjs());
  const [subscriptionEnd, setSubscriptionEnd] = useState(dayjs());

  // All your existing state preserved below
  const [currentMonth, setCurrentMonth] = useState(today.month());
  const [currentYear, setCurrentYear] = useState(today.year());
  const [selectedDate, setSelectedDate] = useState(today.date());
  const [menuSelections, setMenuSelections] = useState({});
  const [activeChild, setActiveChild] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [mealPlanDialog, setMealPlanDialog] = useState({
    open: false,
    startDate: null,
  });
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [menus, setMenus] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [useMealPlan, setUseMealPlan] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState({});
  const [selectedMealPlanMeals, setSelectedMealPlanMeals] = useState([]);
  const [canPay, setCanPay] = useState(false);
  const [paidHolidays, setPaidHolidays] = useState([]);

  const _id = session?.user?.id;
  const { submitHandler, loading } = useRegistration();

  useEffect(() => {
    if (_id) fetchPaidHolidays();
  }, [_id]);

  const fetchPaidHolidays = async () => {
    try {
      const res = await submitHandler({
        _id: _id,
        path: "get-paid-holidays",
      });
      if (res.success) setPaidHolidays(res.data);
      else console.error("Failed to fetch paid holidays:", res.message);
    } catch (error) {
      console.error("Error fetching paid holidays:", error);
    }
  };

  useEffect(() => {
    if (data && Array.isArray(data) && subscriptionStart && subscriptionEnd) {
      const apiHolidays = data
        .map((h) => ({
          date: dayjs(h.date).format("YYYY-MM-DD"),
          name: h.name,
        }))
        .filter(
          (h) =>
            dayjs(h.date).isSameOrAfter(subscriptionStart, "day") &&
            dayjs(h.date).isSameOrBefore(subscriptionEnd, "day")
        );
      setHolidays(apiHolidays);
    }
  }, [data, subscriptionStart, subscriptionEnd]);

  const fetchSavedMealPlans = async () => {
    const currentPlanId = subscriptionPlans[selectedPlanIndex]?.id;

    try {
      const res = await submitHandler({
        _id,
        path: "get-saved-meals",
        planId: currentPlanId,
      });

      if (res.success && res.data) {
        // The backend returns: { [planId]: { [date]: { childId: mealName } } }
        // So we want the object for just the selected/current planId
        const savedMealsForCurrentPlan = res.data[currentPlanId] || {};

        setMenuSelections(savedMealsForCurrentPlan);

        // If your backend supports returning holidays, you could do this here too:
        // setHolidays((prev) => [...prev, ...(res.data.holidays || [])]);

        setCanPay(
          !savedMealsForCurrentPlan ||
          Object.keys(savedMealsForCurrentPlan).length === 0
        );
      }
    } catch (error) {
      console.error("Error loading saved meals:", error);
      setCanPay(true);
    } finally {
      setInitialLoadComplete(true);
    }
  };

  useEffect(() => {
    fetchSavedMealPlans();
  }, [selectedPlanIndex, subscriptionPlans]);


  // Fetch all plans on mount
  const fetchInitialData = async () => {
    try {
      const res = await submitHandler({
        _id: _id,
        path: "get-Menu-Calendar",
      });
      if (res.success && Array.isArray(res.data.plans)) {
        setSubscriptionPlans(res.data.plans);
        // Select active plan on first load
        const activeIndex = res.data.plans.findIndex((p) => p.status === "active");
        setSelectedPlanIndex(activeIndex !== -1 ? activeIndex : 0);
      }
      setMenus([
        "Veg Biriyani",
        "Phulka + Chole",
        "Pav Bhaji",
        "5 Spice Fried Rice",
        "Veg Noodles",
        "Alfredo Pasta",
        "Mac and Cheese",
        "Aloo Paratha",
        "Hummus and Pita",
        "Creamy Curry Rice",
        "Ghee Rice and Dal",
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setInitialLoadComplete(true);
    // 🔥 COMPLETE: API finished, now allow components to render
    // setInitialLoading(false);
    }
  };

  useEffect(() => {
    // Always fetch all plans and saved meals
    const fetchAllData = async () => {
      try {
        await fetchInitialData();
        await fetchSavedMealPlans();
      } catch (error) {
        console.error("Error in initial data loading:", error);
      }
    };
    fetchAllData();
  }, []);

  // --- Plan tab change: map children/calendar date range for selected plan
  useEffect(() => {
    if (!subscriptionPlans.length) return;
    const plan = subscriptionPlans[selectedPlanIndex];
    if (!plan) return;
    setChildren((plan.children || []).map((child, idx) => ({
      ...child,
      id: child.id || `child-${idx}`,
      name: `${child.firstName || ""} ${child.lastName || ""}`.trim(),
    })));
    setSubscriptionStart(dayjs(plan.startDate));
    setSubscriptionEnd(dayjs(plan.endDate));
    setCurrentMonth(dayjs(plan.startDate).month());
    setCurrentYear(dayjs(plan.startDate).year());
    setSelectedDate(dayjs(plan.startDate).date());
  }, [selectedPlanIndex, subscriptionPlans]);

  const handleMenuDataChange = (data) => {
    setMenuData(data);
  };

  // In MenuCalendar.js
  const getAllMenuData = () => {
    const allMenuData = [];

    let currentDate = dayjs(subscriptionStart);
    const endDate = dayjs(subscriptionEnd);

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")) {
      const dateKey = currentDate.format("YYYY-MM-DD");
      const day = currentDate.date();
      const month = currentDate.month();
      const year = currentDate.year();

      children.forEach((child) => {
        let childData = allMenuData.find((c) => c.childId === child.id);
        if (!childData) {
          childData = {
            childId: child.id,
            childName: child.name,
            meals: [],
          };
          allMenuData.push(childData);
        }

        const dish = menuSelections[dateKey]?.[child.id];

        if (!dish) return;

        const isHolidayDate = isHoliday(day, month, year);

        if (!isHolidayDate) {
          // ✅ Normal working day → allow saving
          childData.meals.push({
            mealDate: currentDate.toDate(),
            mealName: typeof dish === "string" ? dish : dish.mealName,
            deleted: typeof dish === "string" ? false : dish.deleted ?? false,
          });
        } else {
          // ✅ Holiday/weekend → only save if it’s in paidHolidays
          const isPaid = paidHolidays.some(
            (ph) =>
              ph.childId === child.id &&
              dayjs(ph.mealDate).isSame(currentDate, "day")
          );
          if (isPaid) {
            childData.meals.push({
              mealDate: currentDate.toDate(),
              mealName: typeof dish === "string" ? dish : dish.mealName,
              deleted: typeof dish === "string" ? false : dish.deleted ?? false,
            });
          }
        }
      });

      currentDate = currentDate.add(1, "day");
    }

    return allMenuData;
  };



  const handleMealPlanChange = (planId) => {
    // Assuming you want Meal Plan 1 meals or empty for now, add other plans if needed
    if (planId === 1) {
      setSelectedMealPlanMeals(dietitianMealPlanData.meal_plan.map(day => day.meal));
    } else {
      setSelectedMealPlanMeals([]);
    }
  };


  const saveSelectedMeals = async () => {
    const allMenuData = getAllMenuData();

    // Use selected plan's planId
    const currentPlanId = subscriptionPlans[selectedPlanIndex]?.id;

    const payload = {
      userId: _id,
      planId: currentPlanId,
      children: allMenuData.map((child) => ({
        childId: child.childId,
        meals: child.meals.map((m) => ({
          mealDate: m.mealDate,
          mealName: m.mealName,        // always use string directly
          deleted: m.deleted === true, // preserve deleted status exactly
        })),
      })),
    };

    try {
      const res = await submitHandler({
        _id,
        path: "save-meals",
        data: payload,
      });

      if (res.success) {
        setCanPay(false);

        setMenuSelections((prev) => {
          const updatedSelections = { ...prev };

          let currentDate = dayjs(subscriptionStart);
          const endDate = dayjs(subscriptionEnd);

          while (
            currentDate.isBefore(endDate, "day") ||
            currentDate.isSame(endDate, "day")
          ) {
            const day = currentDate.date();
            const month = currentDate.month();
            const year = currentDate.year();
            const dateKey = currentDate.format("YYYY-MM-DD");

            // Only clear if holiday and NOT paid
            if (isHoliday(day, month, year)) {
            for (const child of children) {
              const isPaid = paidHolidays.some(
                (ph) =>
                  ph.childId === child.id &&
                  dayjs(ph.mealDate).isSame(currentDate, "day")
              );

              if (!isPaid) {
                if (updatedSelections[dateKey]?.[child.id]) {
                  updatedSelections[dateKey][child.id] = "";
                }
              }
            }
          }

            currentDate = currentDate.add(1, "day");
          }
          return updatedSelections;
        });

      } else {
        console.error("Failed to save meals:", res.message);
      }
    } catch (error) {
      console.error("Error saving meals:", error);
    }
  };


  // 2. For normal save button, just call saveSelectedMeals
  const handleSave = async () => {
    await saveSelectedMeals();
  };

  const formatDate = (day) =>
    `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

  const isHoliday = (day, month = currentMonth, year = currentYear) => {
    // If month and year are the default values, we might have received only day
    if (month === currentMonth && year === currentYear) {
      const date = dayjs(formatDate(day));
      return (
        date.day() === 0 ||
        date.day() === 6 ||
        holidays.some((h) => h.date === date.format("YYYY-MM-DD"))
      );
    }

    // Normal case with all parameters
    const date = dayjs(`${year}-${month + 1}-${day}`);
    const isWeekend = date.day() === 0 || date.day() === 6;
    const dateString = date.format("YYYY-MM-DD");
    const isCustomHoliday = holidays.some((h) => h.date === dateString);
    return isWeekend || isCustomHoliday;
  };

  const handleMenuChange = (childId, dish) => {
    const dateKey = formatDate(selectedDate);
    setMenuSelections((prev) => ({
      ...prev,
      [dateKey]: {
        ...(prev[dateKey] || {}),
        [childId]: typeof dish === "string"
          ? { mealName: dish, deleted: false }
          : dish,
      },
    }));
    if (editMode) {
      setEditMode(false);
      if (isSmall) setOpenDialog(false);
    }
  };

  const getDayName = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const getCalendarGridDates = () => {
    const daysInMonth = dayjs(
      `${currentYear}-${currentMonth + 1}`
    ).daysInMonth();
    const startDay =
      (dayjs(`${currentYear}-${currentMonth + 1}-01`).day() + 6) % 7;

    const daysArray = [];
    for (let i = 0; i < startDay; i++) daysArray.push(null);
    for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);
    return daysArray;
  };

  const applyMealPlan = (planId, childId) => {
    let selectedPlanMeals;

    if (planId === 1) {
      selectedPlanMeals = dietitianMealPlanData.meal_plan.map((day) => day.meal);
    } else {
      selectedPlanMeals = [...menus].reverse();
  }

    const updates = {};
    const firstDayOfMonth = dayjs(`${currentYear}-${currentMonth + 1}-01`);
    const daysInMonth = firstDayOfMonth.daysInMonth();
    const now = dayjs();

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = dayjs(
        `${currentYear}-${currentMonth + 1}-${String(day).padStart(2, "0")}`
      );

      const mealDate = currentDate.format("YYYY-MM-DD");

      // ⛔ SKIP: outside subscription range
    if (
      currentDate.isBefore(subscriptionStart, "day") ||
      currentDate.isAfter(subscriptionEnd, "day")
      ) continue;

      // ⛔ SKIP: holidays
      if (isHoliday(day, currentMonth, currentYear)) continue;

      // ⛔ SKIP: locked days
      if (currentDate.diff(now, "hour") < 48) continue;

      // ⛔ SKIP: deleted meals
      const existing = menuSelections[mealDate]?.[childId];
      if (existing && existing.deleted === true) {
        console.log("Skipping deleted day:", mealDate);
      continue;
    }

      // ✅ apply meal
    const meal = selectedPlanMeals[(day - 1) % selectedPlanMeals.length];

    updates[mealDate] = {
      ...(menuSelections[mealDate] || {}),
      [childId]: { mealName: meal, deleted: false },
    };
  }

    setMenuSelections((prev) => ({
      ...prev,
      ...updates,
    }));

    if (Object.keys(updates).length === 0) {
      alert("Nothing applied: All available days are locked, holidays, or deleted.");
    }
  };





  const calendarDates = getCalendarGridDates();

  const handleMonthChange = (direction) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    const newMonthStart = dayjs(`${newYear}-${newMonth + 1}-01`);
    const newMonthEnd = newMonthStart.endOf("month");

    // Prevent moving outside subscription range
    if (
      newMonthEnd.isBefore(subscriptionStart) ||
      newMonthStart.isAfter(subscriptionEnd)
    ) {
      return;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);

    // Reset meal plan options
    setUseMealPlan(false);
    setSelectedPlans({});

    // -----------------------------
    // ✅ Auto-select correct date
    // -----------------------------
    const subStart = dayjs(subscriptionStart);
    const subEnd = dayjs(subscriptionEnd);

    if (subEnd.year() === newYear && subEnd.month() === newMonth) {
      setSelectedDate(subEnd.date());            // Last day of plan
    } else if (subStart.year() === newYear && subStart.month() === newMonth) {
      setSelectedDate(subStart.date());          // First day of plan
    } else {
      setSelectedDate(1);                        // Normal month first day
    }
  };


  const handleDateClick = (date) => {
    setSelectedDate(date);
    setEditMode(false);
    setUseMealPlan(false);
    if (isSmall) {
      setOpenDialog(true);
    }
  };

  const handleEditClick = (dateString) => {
    const [year, month, day] = dateString.split("-");
    setCurrentMonth(parseInt(month) - 1);
    setCurrentYear(parseInt(year));
    setSelectedDate(parseInt(day));
    setEditMode(true);
    setUseMealPlan(false);
    if (isSmall) {
      setOpenDialog(true);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditMode(false);
  };

  const getSavedMenuDatesForChild = (childId) => {
    // menuSelections: { "YYYY-MM-DD": { childId: dish, ... }, ... }
    return Object.entries(menuSelections)
      .filter(([date, selections]) => selections[childId])
      .map(([date]) => date);
  };

  const savedMenuDates = getSavedMenuDatesForChild(children[activeChild]?.id);

  // if (loading || !children.length) {
  //   return <CircularProgress />;
  // }

  // if (initialLoading) {
  //   return (
  //     <Box display="flex" justifyContent="center" mt={5}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  if (!initialLoadComplete) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }


  return (
    <>
      {/* Plan Tabs */}
      <Tabs
        value={selectedPlanIndex}
        onChange={(e, val) => setSelectedPlanIndex(val)}
        variant="scrollable"
        scrollButtons="auto"
        className="menucalnmaintab"
      >
        {subscriptionPlans.map((plan, i) => (
          <Tab
            key={i}
            label={`${dayjs(plan.startDate).format("DD MMM")} - ${dayjs(plan.endDate).format("DD MMM")} (${plan.status})`}
          />
        ))}
      </Tabs>
    <Box
      className="MCMainPanel"
      display="flex"
      flexDirection={isSmall ? "column" : "row"}
      bgcolor="#fff"
      mx="auto"
      borderRadius={2}
      boxShadow={2}
      overflow="hidden"
    >
      {isSmall && (
        <CenterPanel
          isSmall={isSmall}
          currentMonth={currentMonth}
          currentYear={currentYear}
          handleMonthChange={handleMonthChange}
          calendarDates={calendarDates}
          selectedDate={selectedDate}
          setSelectedDate={handleDateClick}
          isHoliday={(day) => isHoliday(day, currentMonth, currentYear)}
          dummyHolidays={holidays}
          subscriptionStart={subscriptionStart}
          subscriptionEnd={subscriptionEnd}
          savedMenuDates={savedMenuDates}
        />
      )}

      {isSmall && (
        <LeftPanel
          isSmall={isSmall}
          currentYear={currentYear}
          currentMonth={currentMonth}
            isHoliday={isHoliday}
          activeChild={activeChild}
          setActiveChild={setActiveChild}
          dummyChildren={children}
          menuSelections={menuSelections}
          subscriptionStart={subscriptionStart}
          subscriptionEnd={subscriptionEnd}
          onEditClick={handleEditClick}
          onMenuDataChange={handleMenuDataChange}
            reloadSavedMeals={fetchSavedMealPlans}
          setUseMealPlan={setUseMealPlan}
          setSelectedPlans={setSelectedPlans}
            subscriptionId={subscriptionPlans[selectedPlanIndex]?.id}
            userId={_id}  
        />
      )}

      {!isSmall && (
        <>
          <LeftPanel
            isSmall={isSmall}
            currentYear={currentYear}
            currentMonth={currentMonth}
            activeChild={activeChild}
            setActiveChild={setActiveChild}
              isHoliday={isHoliday}
            dummyChildren={children}
            menuSelections={menuSelections}
            subscriptionStart={subscriptionStart}
            subscriptionEnd={subscriptionEnd}
            onEditClick={handleEditClick}
            onMenuDataChange={handleMenuDataChange}
              reloadSavedMeals={fetchSavedMealPlans}
            sx={{ width: "29%" }}
            setUseMealPlan={setUseMealPlan}
            setSelectedPlans={setSelectedPlans}
              subscriptionId={subscriptionPlans[selectedPlanIndex]?.id}
              userId={_id} 
          />

          <CenterPanel
            isSmall={isSmall}
            currentMonth={currentMonth}
            currentYear={currentYear}
            handleMonthChange={handleMonthChange}
            calendarDates={calendarDates}
            selectedDate={selectedDate}
            setSelectedDate={handleDateClick}
            isHoliday={(day) => isHoliday(day, currentMonth, currentYear)}
            dummyHolidays={holidays}
            subscriptionStart={subscriptionStart}
            subscriptionEnd={subscriptionEnd}
            sx={{ width: "44%" }}
            savedMenuDates={savedMenuDates}
          />

          <RightPanel
            isSmall={isSmall}
            selectedDate={selectedDate}
            getDayName={getDayName}
            isHoliday={isHoliday}
            dummyChildren={children}
            menuSelections={menuSelections}
            handleMenuChange={handleMenuChange}
              reloadSavedMeals={fetchSavedMealPlans}
            dummyMenus={menus}
            formatDate={formatDate}
            editMode={editMode}
            setEditMode={setEditMode}
            sx={{ width: "29%" }}
            applyMealPlan={applyMealPlan} // Pass the function
            setMealPlanDialog={setMealPlanDialog}
            activeChild={activeChild} // Add this
            setActiveChild={setActiveChild}
            onSave={handleSave}
            saveSelectedMeals={saveSelectedMeals}
            onMealPlanChange={handleMealPlanChange}
            useMealPlan={useMealPlan}
            setUseMealPlan={setUseMealPlan}
            selectedPlans={selectedPlans}
            setSelectedPlans={setSelectedPlans}
            canPay = {canPay}
            subscriptionStart={subscriptionStart}
            subscriptionEnd={subscriptionEnd}
              subscriptionPlans={subscriptionPlans}        // ✅ added
              selectedPlanIndex={selectedPlanIndex}
          />
        </>
      )}

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
        className="popmenuselt"
      >
        <RightPanel
          isSmall={isSmall}
          selectedDate={selectedDate}
          getDayName={getDayName}
          isHoliday={isHoliday}
          dummyChildren={children}
          menuSelections={menuSelections}
            reloadSavedMeals={fetchSavedMealPlans}
          handleMenuChange={handleMenuChange}
          dummyMenus={menus}
          formatDate={formatDate}
          onClose={handleDialogClose}
          editMode={editMode}
          setEditMode={setEditMode}
          applyMealPlan={applyMealPlan} // Pass the function
          setMealPlanDialog={setMealPlanDialog}
          activeChild={activeChild} // Add this
          setActiveChild={setActiveChild}
          onSave={handleSave}
          saveSelectedMeals={saveSelectedMeals}
          onMealPlanChange={handleMealPlanChange}
          useMealPlan={useMealPlan}
          setUseMealPlan={setUseMealPlan}
          selectedPlans={selectedPlans}
          setSelectedPlans={setSelectedPlans}
          canPay={canPay}
          subscriptionStart={subscriptionStart}
          subscriptionEnd={subscriptionEnd}
            subscriptionPlans={subscriptionPlans}        // ✅ added
            selectedPlanIndex={selectedPlanIndex}

          goToPrevDate={() => {
            let prev = dayjs(`${currentYear}-${currentMonth + 1}-${selectedDate}`).subtract(1, "day");

            // ⛔ skip Sundays
            while (prev.day() === 0) {
              prev = prev.subtract(1, "day");
            }

            if (prev.isBefore(subscriptionStart, "day")) return;
            setCurrentMonth(prev.month());
            setCurrentYear(prev.year());
            setSelectedDate(prev.date());
          }}

          goToNextDate={() => {
            let next = dayjs(`${currentYear}-${currentMonth + 1}-${selectedDate}`).add(1, "day");

            // ⛔ skip Sundays
            while (next.day() === 0) {
              next = next.add(1, "day");
            }

            if (next.isAfter(subscriptionEnd, "day")) return;
            setCurrentMonth(next.month());
            setCurrentYear(next.year());
            setSelectedDate(next.date());
          }}
        />
      </Dialog>

      <MealPlanDialog
        open={mealPlanDialog.open}
        onClose={() => setMealPlanDialog({ ...mealPlanDialog, open: false })}
        startDate={mealPlanDialog.startDate}
        planId={mealPlanDialog.plan} // Pass the selected plan ID
      />
    </Box>
    </>
  );
};

export default MenuCalendar;
