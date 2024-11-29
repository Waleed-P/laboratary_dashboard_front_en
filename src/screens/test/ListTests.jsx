import React, { useEffect, useState } from "react";
import {
  addTestAPI,
  deleteTestAPI,
  listDoctorsAPI,
  listPatientsAPI,
  listTechniciansAPI,
  listTestsAPI,
  updateTestAPI,
} from "../../services/allAPI";
import ReactPaginate from "react-paginate";
import { AreaTop } from "../../components";
import TableContainer from "../../components/common/TableContainer";
import { Modal, Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import WarningModal from "../../components/common/WarningModal";
import Breadcrumb from "../../components/common/Breadcrumb";
import Spinner from 'react-bootstrap/Spinner';
function ListTests() {
  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState("");
  const [totalPage, setTotalPage] = useState(1);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDoctorsPatientsTechnicians = async () => {
    try {
      const patient_result = await listPatientsAPI(1, 100,"");
      const doctor_result = await listDoctorsAPI(1, 100,"");
      const technician_result = await listTechniciansAPI(1, 100,"");
      setPatients(patient_result.data.data);
      setDoctors(doctor_result.data.data);
      setTechnicians(technician_result.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [searchKey]);
  useEffect(() => {
    fetchDoctorsPatientsTechnicians();
  }, []);

  const fetchPatients = async () => {
    try {
      const result = await listTestsAPI(1, 10, searchKey);
      console.log(result.data.data);
      setList(result.data.data);
      setTotalPage(result.data.total_pages);
    } catch (e) {
      console.log(e);
    }
  };

  const headers = [
    { label: "Name", accessor: "test_name" },
    { label: "Description", accessor: "description" },
    { label: "Category", accessor: "category" },
    { label: "Price", accessor: "price" },
    { label: "Patient", accessor: "patient_name" },
    { label: "Doctor", accessor: "doctor_name" },
    { label: "Technician", accessor: "technician_name" },
    {
      label: "Action",
      accessor: "status",
      button: [
        { label: "Edit", action: "edit" }, // First button
        { label: "Delete", action: "delete" }, // Second button
      ],
    },
  ];

  const handleButtonClick = (row, header, btn) => {
    if (btn.action === "edit") {
      setIsEdit(true);
      setId(row._id);
      const rowValues = {
        name: row.test_name || "",
        description: row.description || "",
        price: row.price || "",
        category: row.category || "",
        patient: row.patient_name || "",
        doctor: row.doctor_name || "",
        technician: row.technician_name || "",
        patient_id:row.patient_id || "",
        doctor_id:row.doctor_id || "",
        technician_id:row.technician_id || "",
      };
      formik.setValues(rowValues); // Populate form with row data
      handleShow(); // Show modal
    } else if (btn.action === "delete") {
      setId(row._id);
      openWarningModal();
    }
  };

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };
  const handleShow = () => setShow(true);

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

  const handleDoctorChange = (e) => {
    const selectedName = e.target.value;
    const selectedItem = doctors.find((item) => item.name === selectedName);

    if (selectedItem) {
      formik.setFieldValue("doctor_id", selectedItem._id);
      formik.setFieldValue("doctor_name", selectedItem.name);
    }
  };
  const handleTechnicianChange = (e) => {
    const selectedName = e.target.value;
    const selectedItem = technicians.find((item) => item.name === selectedName);

    if (selectedItem) {
      formik.setFieldValue("technician_id", selectedItem._id);
      formik.setFieldValue("technician_name", selectedItem.name);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      doctor_id: "",
      patient_id: "",
      patient_name: "",
      doctor_name: "",
      technician_name: "",
      technician_id: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Test name is required")
        .min(2, "Name should have at least 2 characters"),
      description: Yup.string()
        .required("Description is required")
        .min(10, "Description should have at least 10 characters"),
      price: Yup.number()
        .required("Price is required")
        .positive("Price must be positive"),
      category: Yup.string().required("Category is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const data = {
          test_name: values.name,
          description: values.description,
          price: values.price,
          category: values.category,
          patient_id: values.patient_id,
          patient_name: values.patient_name,
          doctor_name: values.doctor_name,
          doctor_id: values.doctor_id,
          technician_name: values.technician_name,
          technician_id: values.technician_id,
        };
        if (isEdit) {
          var result = await updateTestAPI(id, data);
        } else {
          var result = await addTestAPI(data);
        }
        if (result.status === 200) {
          toast.success(result.data.message);
          handleClose();
          setLoading(false);
          fetchPatients();
          setIsEdit(false);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    },
  });

  // Pagination
  const fetchPage = async (currentPage) => {
    try {
      const result = await listTestsAPI(currentPage, 10, searchKey);
      const newList = result.data.data;
      return newList;
    } catch (error) {
      console.error("Error fetching", error);
      return [];
    }
  };

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    const dataFromServer = await fetchPage(currentPage);
    setList(dataFromServer);
  };
  //warning modal
  const [showWarningModal, setShowWarningModal] = useState(false);

  const openWarningModal = () => {
    setShowWarningModal(true);
  };

  const closeWarningModal = () => {
    setShowWarningModal(false);
  };

  const handleDelete = async () => {
    closeWarningModal();
    try {
      const result = await deleteTestAPI(id);
      if (result.status === 200) {
        toast.success(result.data.message);
        fetchPatients();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="content-area">
      <Breadcrumb title="Test" breadcrumbItem="List Tests" />
      <TableContainer
        headers={headers}
        data={list}
        onButtonClick={handleButtonClick}
        onAddClick={handleShow}
        addButtonText={"Add Test"}
        searchPlaceHolder={"Search by test name..."}
        searchOnChange={(e) => {
          setSearchKey(e.target.value);
        }}
      />
      <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        breakLabel={"..."}
        pageCount={totalPage}
        marginPagesDisplayed={1}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName="page-item"
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
      <WarningModal
        show={showWarningModal}
        handleClose={closeWarningModal}
        handleDelete={handleDelete}
      />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit Test" : "Add New Test"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            {/* Test Name */}
            <Form.Group className="mb-3">
              <Form.Control
                name="name"
                type="text"
                placeholder="Test Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.name && !!formik.errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.name}
              </Form.Control.Feedback>
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
            <Form.Group className="mb-2">
              <Form.Label>Select a Doctor</Form.Label>
              <Form.Control
                as="select"
                name="doctor_name"
                onChange={(e) => {
                  formik.handleChange(e);
                  handleDoctorChange(e);
                }}
                value={formik.values.doctor_name}
              >
                <option value="" disabled>
                  -- Select Doctor --
                </option>
                {doctors.map((item) => (
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Select a Technician</Form.Label>
              <Form.Control
                as="select"
                name="technician_name"
                onChange={(e) => {
                  formik.handleChange(e);
                  handleTechnicianChange(e);
                }}
                value={formik.values.technician_name}
              >
                <option value="" disabled>
                  -- Select Technician --
                </option>
                {technicians.map((item) => (
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Description */}
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Test Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.description && !!formik.errors.description
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Price */}
            <Form.Group className="mb-3">
              <Form.Control
                name="price"
                type="number"
                placeholder="Price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.price && !!formik.errors.price}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.price}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Category */}
            <Form.Group className="mb-3">
              <Form.Control
                name="category"
                type="text"
                placeholder="Category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.category && !!formik.errors.category}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.category}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default ListTests;
