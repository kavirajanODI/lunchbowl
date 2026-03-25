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
  Select,
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
import SchoolServices from "@/services/SchoolServices";
import { useTranslation } from "react-i18next";
import SchoolModal from "@/components/drawer/SchoolModal"; // Make sure the path is correct

const School = () => {
  const { t } = useTranslation();
  const { data, loading, reload } = useAsync(SchoolServices.getAllSchools);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSchool, setCurrentSchool] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState(null);

  const openAddModal = () => {
    setCurrentSchool(null);
    setIsModalOpen(true);
  };

  const openEditModal = (school) => {
    setCurrentSchool(school);
    setIsModalOpen(true);
  };

  const openDeleteModal = (school) => {
    setSchoolToDelete(school);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await SchoolServices.deleteSchool(schoolToDelete._id);
      reload(); // 🧠 Re-fetch updated data
      setIsDeleteModalOpen(false);
    } catch (error) {}
  };

  return (
    <>
      <PageTitle>{t("Schools")}</PageTitle>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <ModalHeader>{t("Confirm Deletion")}</ModalHeader>
        <ModalBody>
          {t("Are you sure you want to delete")}{" "}
          <strong>{schoolToDelete?.name}</strong>?{" "}
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

      {/* Add/Edit School Modal */}
      <SchoolModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reload(); // 🧠 Re-fetch updated data
        }}
        school={currentSchool}
      />

      {/* Add School Button */}
      <Card className="min-w-0 shadow-xs overflow-hidden mb-5">
        <CardBody>
          <div className="flex justify-end">
            <Button
              onClick={openAddModal}
              className="rounded-md"
              iconLeft={FiPlus}
            >
              {t("Add School")}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Schools Table */}
      <Card className="min-w-0 shadow-xs overflow-hidden">
        <CardBody>
          {loading ? (
            <p>{t("Loading schools...")}</p>
          ) : data?.length === 0 ? (
            <p>{t("No schools found. Add your first school.")}</p>
          ) : (
            <TableContainer>
              <Table>
                <TableHeader>
                  <tr>
                    <TableCell>{t("Name")}</TableCell>
                    <TableCell>{t("Location")}</TableCell>
                    <TableCell>{t("LunchTime")}</TableCell>
                    <TableCell>{t("Actions")}</TableCell>
                  </tr>
                </TableHeader>
                <TableBody>
                  {data.map((school) => (
                    <TableRow key={school._id}>
                      <TableCell>{school.name}</TableCell>
                      <TableCell>{school.location}</TableCell>
                      <TableCell>
                        {school.lunchTime} {school.timeFormat}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <Button
                            layout="link"
                            size="small"
                            onClick={() => openEditModal(school)}
                          >
                            <FiEdit className="w-5 h-5" />
                          </Button>
                          <Button
                            layout="link"
                            size="small"
                            onClick={() => openDeleteModal(school)}
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

export default School;
