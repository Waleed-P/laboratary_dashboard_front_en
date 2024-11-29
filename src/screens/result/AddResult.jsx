import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Button, Col, Row } from "react-bootstrap";
import {
  addResultAPI,
  listPatientsAPI,
  updateResultAPI,
} from "../../services/allAPI";
import toast from "react-hot-toast";
import Breadcrumb from "../../components/common/Breadcrumb";
import Spinner from 'react-bootstrap/Spinner';
function AddResult() {
  // Define the formik instance with validation schema
  const isEdit = localStorage.getItem("isEdit");
  const [initialData, setInitialData] = useState(null);
  const [id, setId] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchPatients = async () => {
    try {
      const result = await listPatientsAPI(1, 100);
      setPatients(result.data.data);
    } catch (e) {
      console.log(e);
    }
  };
  //patient selection
  const handlePatientChange = (e) => {
    const selectedPatientName = e.target.value;
    const selectedPatient = patients.find(
      (patient) => patient.name === selectedPatientName
    );

    if (selectedPatient) {
      formik.setFieldValue("patient_id", selectedPatient._id);
      formik.setFieldValue("patient_name", selectedPatient.name);
    }
  };
  useEffect(() => {
    fetchPatients();
    if (isEdit) {
      console.log("edit");
      // Fetch existing data here, for example:
      const existingData = JSON.parse(localStorage.getItem("editData")); // Example: Get from localStorage or API
      console.log(existingData);
      setId(existingData.id);
      setInitialData({
        ...existingData,
        medical_history: existingData.medical_history?.join(", "),
        medications: existingData.medications?.join(", "),
        symptoms: existingData.symptoms?.join(", "),
      });
    } else {
      console.log("not edit", isEdit);
      setInitialData({
        test: "",
        age: "",
        gender: "",
        weight: "",
        height: "",
        medical_history: "",
        hemoglobin: "",
        wbc: "",
        rbc: "",
        cholesterol: "",
        smoking: false,
        alcohol: false,
        activity_level: "",
        medications: "",
        symptoms: "",
        patient_name: "",
        patient_id: "",
      });
    }
    return () => {
      localStorage.removeItem("isEdit");
      localStorage.removeItem("editData");
    };
  }, [isEdit]);
  const formik = useFormik({
    enableReinitialize: true, // Allow reinitialization when initialData changes
    initialValues: initialData || {
      test: "",
      age: "",
      gender: "",
      weight: "",
      height: "",
      medical_history: "",
      hemoglobin: "",
      wbc: "",
      rbc: "",
      cholesterol: "",
      smoking: false,
      alcohol: false,
      activity_level: "",
      medications: "",
      symptoms: "",
      patient_id: "",
      patient_name: "",
    },
    validationSchema: Yup.object({
      test: Yup.string().required("Test is required"),
      age: Yup.number()
        .required("Age is required")
        .positive("Age must be positive"),
      gender: Yup.string().required("Gender is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const processedValues = {
        ...values,
        medical_history: values.medical_history
          .split(",")
          .map((item) => item.trim()),
        medications: values.medications.split(",").map((item) => item.trim()),
        symptoms: values.symptoms.split(",").map((item) => item.trim()),
      };

      try {
        let result;
        if (isEdit) {
          result = await updateResultAPI(id, processedValues);
        } else {
          result = await addResultAPI(processedValues);
        }
        if (result.status === 200) {
          toast.success(result.data.message);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to save the result. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="content-area-table">
      <Breadcrumb title="Result" breadcrumbItem="Add Result" />
      <Form onSubmit={formik.handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="test">
            <Form.Label>Test</Form.Label>
            <Form.Control
              type="text"
              name="test"
              onChange={formik.handleChange}
              value={formik.values.test}
              isInvalid={formik.touched.test && !!formik.errors.test}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.test}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId="age">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              name="age"
              onChange={formik.handleChange}
              value={formik.values.age}
              isInvalid={formik.touched.age && !!formik.errors.age}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.age}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId="gender">
            <Form.Label>Gender</Form.Label>
            <Form.Control
              as="select"
              name="gender"
              onChange={formik.handleChange}
              value={formik.values.gender}
              isInvalid={formik.touched.gender && !!formik.errors.gender}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {formik.errors.gender}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="weight">
            <Form.Label>Weight</Form.Label>
            <Form.Control
              type="number"
              name="weight"
              onChange={formik.handleChange}
              value={formik.values.weight}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="height">
            <Form.Label>Height</Form.Label>
            <Form.Control
              type="number"
              name="height"
              onChange={formik.handleChange}
              value={formik.values.height}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Select a Patient</Form.Label>
            <Form.Control
              as="select"
              name="patient_name"
              onChange={(e) => {
                formik.handleChange(e);
                handlePatientChange(e);
              }}
              value={formik.values.patient_name}
            >
              <option value="" disabled>
                -- Select Patient --
              </option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient.name}>
                  {patient.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="medical_history">
          <Form.Label>Medical History</Form.Label>
          <Form.Control
            type="text"
            name="medical_history"
            onChange={formik.handleChange}
            value={formik.values.medical_history}
            placeholder="Comma-separated values"
          />
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="hemoglobin">
            <Form.Label>Hemoglobin</Form.Label>
            <Form.Control
              type="number"
              name="hemoglobin"
              onChange={formik.handleChange}
              value={formik.values.hemoglobin}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="wbc">
            <Form.Label>WBC</Form.Label>
            <Form.Control
              type="number"
              name="wbc"
              onChange={formik.handleChange}
              value={formik.values.wbc}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="rbc">
            <Form.Label>RBC</Form.Label>
            <Form.Control
              type="number"
              name="rbc"
              onChange={formik.handleChange}
              value={formik.values.rbc}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="cholesterol">
            <Form.Label>Cholesterol</Form.Label>
            <Form.Control
              type="number"
              name="cholesterol"
              onChange={formik.handleChange}
              value={formik.values.cholesterol}
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="smoking">
            <Form.Check
              type="checkbox"
              label="Smoking"
              name="smoking"
              onChange={formik.handleChange}
              checked={formik.values.smoking}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="alcohol">
            <Form.Check
              type="checkbox"
              label="Alcohol"
              name="alcohol"
              onChange={formik.handleChange}
              checked={formik.values.alcohol}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="activity_level">
            <Form.Label>Activity Level</Form.Label>
            <Form.Control
              as="select"
              name="activity_level"
              onChange={formik.handleChange}
              value={formik.values.activity_level}
            >
              <option value="">Select</option>
              <option value="Sedentary">Sedentary</option>
              <option value="Moderate">Moderate</option>
              <option value="Active">Active</option>
            </Form.Control>
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="medications">
          <Form.Label>Medications</Form.Label>
          <Form.Control
            type="text"
            name="medications"
            onChange={formik.handleChange}
            value={formik.values.medications}
            placeholder="Comma-separated values"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="symptoms">
          <Form.Label>Symptoms</Form.Label>
          <Form.Control
            type="text"
            name="symptoms"
            onChange={formik.handleChange}
            value={formik.values.symptoms}
            placeholder="Comma-separated values"
          />
        </Form.Group>

        <Button variant="primary" disabled={loading} type="submit">
          {loading ? (
            <>
              <Spinner size="sm" />
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </Form>
    </div>
  );
}

export default AddResult;
