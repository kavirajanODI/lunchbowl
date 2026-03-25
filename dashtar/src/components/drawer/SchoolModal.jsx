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
import { FiClock } from "react-icons/fi";
import SchoolServices from "@/services/SchoolServices";

const SchoolModal = ({ isOpen, onClose, school, onSuccess  }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    lunchTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (school) {
      setFormData({
        name: school.name,
        location: school.location,
        lunchTime: school.lunchTime,
      });
    } else {
      setFormData({
        name: "",
        location: "",
        lunchTime: "",
      });
    }
  }, [school]);

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
      if (school) {
        response = await SchoolServices.updateSchool(school._id, formData);
      } else {
        response = await SchoolServices.addSchool(formData);
      }

      if (response.success) {
        onClose();
        onSuccess();
      } else {
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        {school ? t("Update School") : t("Add School")}
      </ModalHeader>
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="grid gap-4">
            <Label>
              <span>{t("School Name")} *</span>
              <Input
                className="mt-1"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Sunshine Elementary"
                required
              />
            </Label>

            <Label>
              <span>{t("Location")} *</span>
              <Input
                className="mt-1"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. 123 Main St, City"
                required
              />
            </Label>

            <Label>
              <span>{t("Lunch Time")} *</span>
              <div className="flex items-center mt-1">
                <Input
                  type="time"
                  className="w-32"
                  name="lunchTime"
                  value={formData.lunchTime}
                  onChange={handleChange}
                  required
                />
                <FiClock className="ml-2 text-gray-500" />
              </div>
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
            ) : school ? (
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

export default SchoolModal;