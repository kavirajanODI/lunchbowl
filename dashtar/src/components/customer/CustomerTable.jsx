import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import dayjs from "dayjs";
import React, { useState } from "react";
import { FiZoomIn } from "react-icons/fi";

// internal import
import MainDrawer from "@/components/drawer/MainDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import Tooltip from "@/components/tooltip/Tooltip";
import CustomerDrawer from "@/components/drawer/CustomerDrawer";
import EditDeleteButton from "@/components/table/EditDeleteButton";

import CustomerViewModal from "@/components/customer/CustomerViewModal"; // You need to create this!

const CustomerTable = ({ customers }) => {
  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();

  // State for the view popup
  const [viewOpen, setViewOpen] = useState(false);
  const [viewId, setViewId] = useState(null);

  const handleViewOpen = (id) => {
    setViewId(id);
    setViewOpen(true);
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setViewId(null);
  };

  return (
    <>
      <DeleteModal id={serviceId} title={title} />
      <MainDrawer>
        <CustomerDrawer id={serviceId} />
      </MainDrawer>

      {/* View Modal/Drawer */}
      <CustomerViewModal
        open={viewOpen}
        onClose={handleViewClose}
        id={viewId}
      />

      <TableBody>
        {customers?.map((user) => (
          <TableRow key={user._id}>
            <TableCell>
              <span className="text-sm">
                {dayjs(user.createdAt).format("MMM D, YYYY")}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm">{user.name}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm">{user.email}</span>{" "}
            </TableCell>
            <TableCell>
              <span className="text-sm font-medium">{user.phone}</span>
            </TableCell>
            <TableCell>
              <div className="flex justify-end text-right">
                <span onClick={() => handleViewOpen(user._id)}>
                  <Tooltip
                    id={`view-tooltip-${user._id}`}
                    Icon={FiZoomIn}
                    title="View"
                    bgColor="#1e40af"
                  />
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default CustomerTable;