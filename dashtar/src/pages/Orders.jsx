import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardBody,
  Table,
  TableContainer,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  Button,
  Input,
} from "@windmill/react-ui";
import PageTitle from "@/components/Typography/PageTitle";
import OrderServices from "@/services/OrderServices";

const PAGE_SIZE = 50;

// Helper to get today's date in yyyy-mm-dd format
const getTodayString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search/filter states
  const [childName, setChildName] = useState("");
  const [date, setDate] = useState(getTodayString());

  const childNameRef = useRef(null);
  const dateRef = useRef(null);

  // Dish summary state
  const [dishSummary, setDishSummary] = useState([]);

  // Fetch orders function
  const fetchOrders = async (
    pageNumber = 1,
    childNameVal = "",
    dateVal = ""
  ) => {
    setLoading(true);
    setError(null);
    try {
    let res;
    if (childNameVal || dateVal) {
      res = await OrderServices.searchOrders({
        childName: childNameVal,
        date: dateVal,
        page: pageNumber,
        limit: PAGE_SIZE,
      });
    } else {
      res = await OrderServices.getAllFoodOrders({
        page: pageNumber,
        limit: PAGE_SIZE,
      });
    }

    // ✅ FIX — properly extract response
    const data = res?.data || res;

    setOrders(data.orders || []);
    setTotal(data.total || 0);
    setDishSummary(data.dishSummary || []);

  } catch (err) {
    console.error("Fetch Orders Error:", err);
      setError(err.response?.data?.message || err.message);
      setOrders([]);
      setTotal(0);
      setDishSummary([]);
    } finally {
      setLoading(false);
    }
  };


  // Load today's orders on first render
  useEffect(() => {
    fetchOrders(1, "", getTodayString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When page changes (after initial load), keep current filters
  useEffect(() => {
    fetchOrders(page, childName, date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);


  // Format date as "DD MMM YYYY" (e.g., 10 Nov 2025)
  const formatDateDMY = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders(1, childName, date);
  };

  // Reset search: clear fields, load all data and clear dish summary
  const handleReset = () => {
    setChildName("");
    setDate("");
    if (childNameRef.current) childNameRef.current.value = "";
    if (dateRef.current) dateRef.current.value = "";
    setPage(1);
    setDishSummary([]);
    fetchOrders(1, "", "");
  };

  // CSV download function
  const downloadCSV = () => {
    // Dish Summary Section
    let dishSummarySection = "";
    if (date && dishSummary.length > 0) {
      dishSummarySection += `Dish Summary for ${formatDateDMY(date)}\n`;
      dishSummarySection += ["Dish", "Count"].join(",") + "\n";
      dishSummary.forEach((item) => {
        dishSummarySection +=
          [`"${item.dish.replace(/"/g, '""')}"`, `"${item.count}"`].join(",") +
          "\n";
      });
      dishSummarySection += "\n";
    }

    // Prepare CSV headers
    const headers = [
      "#",
      "Child Name",
      "Class & Section",
      "School",
      "Location",
      "Date",
      "Food",
    ].join(",");

    // Prepare CSV rows
    const rows = orders.map((order, idx) =>
      [
        (page - 1) * PAGE_SIZE + idx + 1,
        `${order.childFirstName} ${order.childLastName}`,
        order.childClass + " - " + order.section,
        order.school,
        order.location,
        order.date ? `\t${formatDateDMY(order.date)}` : "",
        order.food,
      ]
        .map((field) => `"${String(field).replace(/"/g, '""')}"`)
        .join(",")
    );

    // Combine dish summary and order table
    const csvContent = dishSummarySection + [headers, ...rows].join("\n");

    // Create download link
    const blob = new Blob(
      ["\uFEFF" + csvContent],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `orders_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pageCount = Math.ceil((total || 0) / PAGE_SIZE);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <PageTitle>Orders</PageTitle>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form
            onSubmit={handleSearch}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
          >
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                ref={childNameRef}
                type="search"
                name="childName"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Search by Child Name"
                className="mb-2"
              />
            </div>
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                ref={dateRef}
                type="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mb-2"
              />
            </div>
            <div className="flex items-center gap-2 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Button type="submit" className="h-12 w-full bg-emerald-700">
                Filter
              </Button>
              <Button
                layout="outline"
                onClick={handleReset}
                type="reset"
                className="px-4 md:py-1 py-2 h-12 text-sm dark:bg-gray-700"
              >
                <span className="text-black dark:text-gray-200">Reset</span>
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Dish summary cards */}
      {date && dishSummary.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-4">
          {dishSummary.map((item, idx) => (
            <Card
              key={item.dish}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 xl:w-1/6 min-w-[170px] bg-gradient-to-br from-emerald-200 to-emerald-100 border border-emerald-300"
            >
              <CardBody className="flex flex-col items-center text-center">
                <span className="text-xl font-semibold text-emerald-800 mb-1">
                  {item.dish}
                </span>
                <span className="text-3xl font-bold text-emerald-900">
                  {item.count}
                </span>
                <span className="text-xs text-emerald-700 mt-1">
                  {date ? `on ${formatDateDMY(date)}` : ""}
                </span>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Card className="min-w-0 shadow-xs overflow-hidden">
        <CardBody>
          {Array.isArray(orders) && orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <TableContainer>
              <Table>
                <TableHeader>
                  <tr>
                    <TableCell>#</TableCell>
                    <TableCell>Child Name</TableCell>
                      <TableCell>Class & Section</TableCell>
                    <TableCell>School</TableCell>
                      {/* <TableCell>Lunch Time</TableCell> */}
                    <TableCell>Location</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Food</TableCell>
                  </tr>
                </TableHeader>
                <TableBody>
                  {orders.map((order, idx) => (
                    <TableRow key={order.childId + order.date + order.food}>
                      <TableCell>{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
                      <TableCell>
                        {order.childFirstName} {order.childLastName}
                      </TableCell>
                      <TableCell>{order.childClass} - {order.section}</TableCell>
                      <TableCell>{order.school}</TableCell>
                      {/* <TableCell>{order.lunchTime}</TableCell> */}  
                      <TableCell>{order.location}</TableCell>
                      <TableCell>
                        {order.date
                          ? formatDateDMY(order.date)
                          : ""}
                      </TableCell>
                      <TableCell>{order.food}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination Controls and Download Button */}
          {total > 0 && (
            <div
              style={{
                marginTop: "1em",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button onClick={downloadCSV} layout="outline" size="small">
                Download CSV
              </Button>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  layout="outline"
                  size="small"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >
                  Prev
                </Button>
                <span style={{ margin: "0 1em" }}>
                  Page {page} of {pageCount}
                </span>
                <Button
                  layout="outline"
                  size="small"
                  onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
                  disabled={page === pageCount}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Orders;