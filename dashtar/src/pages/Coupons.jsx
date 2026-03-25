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
import axios from "axios";

const PAGE_SIZE = 10;

const SubscriptionTable = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [fatherName, setFatherName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  // Local state to store last used filters
  const [lastFilters, setLastFilters] = useState({
    fatherName: "",
    mobile: "",
    email: "",
  });

  const fatherNameRef = useRef(null);
  const mobileRef = useRef(null);
  const emailRef = useRef(null);

  // Fetch subscriptions with filters and pagination
  const fetchSubscriptions = async (
    pageNumber = 1,
    fatherNameVal = "",
    mobileVal = "",
    emailVal = ""
  ) => {
    setLoading(true);
    setError(null);
    try {
      const hasFilter =
        fatherNameVal.trim() || mobileVal.trim() || emailVal.trim();
      const url = hasFilter
        ? "https://api.lunchbowl.co.in/api/orders/get-All/user-Subscription/search"
        : "https://api.lunchbowl.co.in/api/orders/get-All/user-Subscription";

      const res = await axios.get(url, {
        params: {
          page: pageNumber,
          limit: PAGE_SIZE,
          fatherName: fatherNameVal,
          mobile: mobileVal,
          email: emailVal,
        },
      });
      setSubscriptions(res.data.subscriptions || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setSubscriptions([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Initial load (no filters)
  useEffect(() => {
    setLastFilters({ fatherName: "", mobile: "", email: "" });
    setPage(1); // 🔥 pagination effect will handle fetch
  }, []);


  // When page changes, use last used filters
  useEffect(() => {
    fetchSubscriptions(
      page,
      lastFilters.fatherName,
      lastFilters.mobile,
      lastFilters.email
    );
  }, [page, lastFilters]);



  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  const handleSearch = (e) => {
    e.preventDefault();
    setLastFilters({ fatherName, mobile, email });
    setPage(1); // 🔥 triggers API call automatically
  };


  const handleReset = () => {
    setFatherName("");
    setMobile("");
    setEmail("");
    if (fatherNameRef.current) fatherNameRef.current.value = "";
    if (mobileRef.current) mobileRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";

    setLastFilters({ fatherName: "", mobile: "", email: "" });
    setPage(1); // 🔥 pagination effect will refetch
  };


  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <PageTitle>User Subscriptions</PageTitle>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form
            onSubmit={handleSearch}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
          >
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                ref={fatherNameRef}
                type="search"
                name="fatherName"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                placeholder="Search by Father's Name"
                className="mb-2"
              />
            </div>
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                ref={mobileRef}
                type="search"
                name="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Search by Mobile"
                className="mb-2"
              />
            </div>
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                ref={emailRef}
                type="search"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Search by Email"
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

      <Card className="min-w-0 shadow-xs overflow-hidden">
        <CardBody>
          {Array.isArray(subscriptions) && subscriptions.length === 0 ? (
            <p>No subscriptions found.</p>
          ) : (
            <TableContainer>
              <Table>
                <TableHeader>
                  <tr>
                      {/* <TableCell>#</TableCell> */}
                    <TableCell>Father Name</TableCell>
                    <TableCell>Mobile</TableCell>
                      <TableCell>Email</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                      <TableCell>Working Days</TableCell>

                      {/* <TableCell>Amount</TableCell> */}
                      {/* <TableCell>Payment Status</TableCell> */}
                  </tr>
                </TableHeader>
                <TableBody>
                    {subscriptions.map((sub, idx) => (
                      <TableRow key={idx}>
                        {/* <TableCell>{(page - 1) * PAGE_SIZE + idx + 1}</TableCell> */}

                        {/* Father Name */}
                        <TableCell>{sub.parentDetails?.name || ""}</TableCell>

                        {/* Mobile */}
                        <TableCell>{sub.parentDetails?.mobile || ""}</TableCell>

                        {/* Email */}
                        <TableCell>{sub.parentDetails?.email || ""}</TableCell>



                        {/* Start Date */}
                        <TableCell>
                          {sub.subscriptionDetails?.startDate
                            ? formatDate(sub.subscriptionDetails?.startDate)
                            : ""}
                        </TableCell>

                        {/* End Date */}
                        <TableCell>
                          {sub.subscriptionDetails?.endDate
                            ? formatDate(sub.subscriptionDetails?.endDate)
                            : ""}
                        </TableCell>

                        {/* Working Days */}
                        <TableCell>
                          {sub.subscriptionDetails?.workingDays || ""}
                        </TableCell>

                        {/* Optional: Price */}
                        {/*
      <TableCell>
        {sub.subscriptionDetails?.price
          ? `₹${sub.subscriptionDetails.price}`
          : ""}
      </TableCell>
      */}
                      </TableRow>
                    ))}
                  </TableBody>

              </Table>
            </TableContainer>
          )}

          {/* Pagination Controls */}
          {total > 0 && (
            <div
              style={{
                marginTop: "1em",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
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
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default SubscriptionTable;