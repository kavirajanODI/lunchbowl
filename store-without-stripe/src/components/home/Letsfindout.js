import React from "react";
import { useState } from "react";
import SchoolServiceForm from "@components/home/SchoolServiceForm";
import SignUpPopup from "@components/logInSignUp/SignUpPopup";
import CategoryServices from "../../services/CategoryServices";
import useAsync from "../../hooks/useAsync";

const Letsfindout = () => {
  const [schoolName, setSchoolName] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [showSchoolForm, setShowSchoolForm] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [schoolError, setSchoolError] = useState(false);

  const {
    data: schools,
    loading,
    error,
    reload,
  } = useAsync(CategoryServices.getAllSchools);

  const handleInputChange = (e) => {
    setSchoolName(e.target.value);
  };

  const handleSchoolSelect = (e) => {
    setSelectedSchool(e.target.value);
  };

  const handleSelectSubmit = (e) => {
    console.log(("error----->", schoolError));
    e.preventDefault();
    if (!selectedSchool) {
      setSchoolError(true);
      return;
    }
    setSchoolError(false);
    setShowSignUp(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted school name:", schoolName);
    setShowSchoolForm(true);
  };

  // Null check for schools data
  const renderSchoolOptions = () => {
    if (loading) {
      return <option>Loading schools...</option>;
    }

    if (error) {
      return <option>Error loading schools</option>;
    }

    if (!schools || schools.length === 0) {
      return <option>No schools available</option>;
    }

    return schools.map((school) => (
      <option key={school._id} value={school.name}>
        {school.name} - {school.location}
      </option>
    ));
  };

  return (
    <>
      <div className="lfooutfild">
        <h6>Select a school to check its availability.</h6>
        <div className="inputbox bg-white p-[10px] rounded-[10px] flex ">
          <select
            name="schoolname"
            value={selectedSchool}
            onChange={(e) => {
              handleSchoolSelect(e);
              setSchoolError(false);
            }}
            className={`flex-1 p-2 rounded outline-none ${schoolError ? "border-2 border-red-500 bg-red-50" : "border-2 border-gray-200"
              }`}
          >
            <option value="">Select School Name</option>
            {renderSchoolOptions()}
          </select>

          <button
            className="btn"
            onClick={handleSelectSubmit}
            // disabled={!selectedSchool}
          >
            <span>Next</span>
          </button>
        </div>
        {schoolError && (
          <div className="flex justify-start mt-2">
            <div className="bg-red-100 text-red-600 text-sm rounded px-4 py-2">
              School is required
            </div>
          </div>
        )}

      </div>
      <div className="orfild flex items-center justify-center my-[2vh]">
        <h6>or</h6>
      </div>
      <div className="lfooutfild">
        <h6>
          Didn't find your school? Submit Request.{" "}
          <small>(Please make sure to include the Pincode.)</small>
        </h6>
        <div className="inputbox bg-white p-[10px] rounded-[10px] flex">
          <input
            name="shippingOption"
            type="text"
            value={schoolName}
            onChange={handleInputChange}
            placeholder="Enter School Name"
            className="form-radio outline-none focus:ring-0 text-emerald-500"
          />
          <button className="btn" onClick={handleSubmit}>
            <span>Next</span>
          </button>
        </div>
      </div>
      {showSchoolForm && (
        <SchoolServiceForm
          prefillSchool={schoolName}
          onClose={() => setShowSchoolForm(false)}
        />
      )}
      <SignUpPopup open={showSignUp} onClose={() => setShowSignUp(false)} />
    </>
  );
};

export default Letsfindout;