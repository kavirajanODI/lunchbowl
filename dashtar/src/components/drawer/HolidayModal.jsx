import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import HolidayServices from "@/services/HolidayServices";

const HolidayModal = ({ isOpen, onClose, holiday }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    date: "",
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (holiday) {
      // Format date to YYYY-MM-DD for the date input
      const formattedDate = new Date(holiday.date).toISOString().split('T')[0];
      setFormData({
        date: formattedDate,
        name: holiday.name,
      });
    } else {
      setFormData({
        date: "",
        name: "",
      });
    }
  }, [holiday]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let response;
      if (holiday) {
        response = await HolidayServices.updateHoliday(holiday._id, formData);
      } else {
        response = await HolidayServices.addHoliday(formData);
      }

      if (response.success) {
        onClose();
      }
    } catch (error) {
      console.error("Error saving holiday:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        {holiday ? t("Update Holiday") : t("Add Holiday")}
      </ModalHeader>
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="grid gap-4">
            <Label>
              <span>{t("Date")} *</span>
              <Input
                className="mt-1"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Label>

            <Label>
              <span>{t("Holiday Name")} *</span>
              <Input
                className="mt-1"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. New Year's Day"
                required
              />
            </Label>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            layout="outline"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t("Cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span>Processing...</span>
            ) : holiday ? (
              t("Update")
            ) : (
              t("Save")
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default HolidayModal;