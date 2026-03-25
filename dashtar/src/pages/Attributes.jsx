import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  TableContainer,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
} from "@windmill/react-ui";
import { FiPlus, FiTrash2, FiEdit } from "react-icons/fi";
import PageTitle from "@/components/Typography/PageTitle";
import useAsync from "@/hooks/useAsync";
import HolidayServices from "@/services/HolidayServices";
import { useTranslation } from "react-i18next";
import HolidayModal from "@/components/drawer/HolidayModal";

const Holidays = () => {
  const { t } = useTranslation();
  const {
    data = [],
    loading,
    reload,
  } = useAsync(HolidayServices.getAllHolidays);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHoliday, setCurrentHoliday] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState(null);

  const openAddModal = () => {
    setCurrentHoliday(null);
    setIsModalOpen(true);
  };

  const openEditModal = (holiday) => {
    setCurrentHoliday(holiday);
    setIsModalOpen(true);
  };

  const openDeleteModal = (holiday) => {
    setHolidayToDelete(holiday);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await HolidayServices.deleteHoliday(holidayToDelete._id);
      reload();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting holiday:", error);
    }
  };

  return (
    <>
      <PageTitle>{t("Holidays")}</PageTitle>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <ModalHeader>{t("Confirm Deletion")}</ModalHeader>
        <ModalBody>
          {t("Are you sure you want to delete the holiday")}{" "}
          <strong>{holidayToDelete?.name}</strong> ({holidayToDelete?.date})?{" "}
          {t("This action cannot be undone.")}.
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={() => setIsDeleteModalOpen(false)}>
            {t("Cancel")}
          </Button>
          <Button layout="danger" onClick={handleDelete}>
            {t("Delete")}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Add/Edit Holiday Modal */}
      <HolidayModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reload();
        }}
        holiday={currentHoliday}
      />

      {/* Add Holiday Button */}
      <Card className="min-w-0 shadow-xs overflow-hidden mb-5">
        <CardBody>
          <div className="flex justify-end">
            <Button
              onClick={openAddModal}
              className="rounded-md"
              iconLeft={FiPlus}
            >
              {t("Add Holiday")}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Holidays Table */}
      <Card className="min-w-0 shadow-xs overflow-hidden">
        <CardBody>
          {loading ? (
            <p>{t("Loading holidays...")}</p>
          ) : data.length === 0 ? (
            <p>{t("No holidays found. Add your first holiday.")}</p>
          ) : (
            <TableContainer>
              <Table>
                <TableHeader>
                  <tr>
                    <TableCell>{t("Date")}</TableCell>
                    <TableCell>{t("Name")}</TableCell>
                    <TableCell>{t("Actions")}</TableCell>
                  </tr>
                </TableHeader>
                <TableBody>
                  {data.map((holiday) => (
                    <TableRow key={holiday._id}>
                      <TableCell>
                        {new Date(holiday.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{holiday.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <Button
                            layout="link"
                            size="small"
                            onClick={() => openEditModal(holiday)}
                          >
                            <FiEdit className="w-5 h-5" />
                          </Button>
                          <Button
                            layout="link"
                            size="small"
                            onClick={() => openDeleteModal(holiday)}
                          >
                            <FiTrash2 className="w-5 h-5 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default Holidays;
