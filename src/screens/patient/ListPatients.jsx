import React, { useEffect, useState } from "react";
import {
  addPatientAPI,
  deletePatientAPI,
  listPatientsAPI,
  updatePatientAPI,
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
function ListPatients() {
  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState("");
  const [totalPage, setTotalPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, [searchKey]);

  const fetchPatients = async () => {
    try {
      const result = await listPatientsAPI(1, 10, searchKey);
      console.log(result.data.data);
      setList(result.data.data);
      setTotalPage(result.data.total_pages);
    } catch (e) {
      console.log(e);
    }
  };

  const headers = [
    { label: "Name", accessor: "name" },
    { label: "Mobile", accessor: "contact_number" },
    { label: "Email", accessor: "email" },
    { label: "Gender", accessor: "gender" },
    { label: "Address", accessor: "address" },
    { label: "Age", accessor: "age" },
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
        name: row.name || "",
        contact_number: row.contact_number || "",
        email: row.email || "",
        gender: row.gender || "",
        address: row.address || "",
        age: row.age || "",
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

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      contact_number: "",
      gender: "",
      address: "",
      age: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Name is required")
        .min(2, "Name should have at least 2 characters"),
      age: Yup.number()
        .required("Age is required")
        .positive("Age must be a positive number")
        .integer("Age must be an integer")
        .min(1, "Age must be at least 1"),
      gender: Yup.string()
        .required("Gender is required")
        .oneOf(["Male", "Female", "Other"], "Invalid gender selection"),
      contact_number: Yup.string()
        .required("Contact number is required")
        .matches(/^[0-9]{10}$/, "Contact number must be 10 digits"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      address: Yup.string()
        .required("Address is required")
        .min(5, "Address must have at least 5 characters"),
    }),
    onSubmit: async (values) => {
      console.log("Form data", values);
      setLoading(true);
      try {
        const data = {
          name: values.name,
          email: values.email,
          contact_number: values.contact_number,
          gender: values.gender,
          address: values.address,
          age: values.age,
        };
        if (isEdit) {
          var result = await updatePatientAPI(id, data);
        } else {
          var result = await addPatientAPI(data);
        }
        if (result.status === 200) {
          setLoading(false);
          handleClose();
          toast.success(result.data.message);
          fetchPatients();
          setIsEdit(false);
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  // Pagination
  const fetchPage = async (currentPage) => {
    try {
      const result = await listPatientsAPI(currentPage, 10, searchKey);
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
      const result = await deletePatientAPI(id);
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
      <Breadcrumb title="Patient" breadcrumbItem="List Patients" />
      <TableContainer
        headers={headers}
        data={list}
        onButtonClick={handleButtonClick}
        onAddClick={handleShow}
        addButtonText={"Add Patient"}
        searchOnChange={(e) => {
          setSearchKey(e.target.value);
        }}
        searchPlaceHolder={"Search by patient name..."}
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
          <Modal.Title>
            {isEdit ? "Edit Patient Details" : "Add New Patient"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            {/* Name */}
            <Form.Group className="mb-3">
              <Form.Control
                name="name"
                type="text"
                placeholder="Patient Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.name && !!formik.errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Age */}
            <Form.Group className="mb-3">
              <Form.Control
                name="age"
                type="number"
                placeholder="Age"
                value={formik.values.age}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.age && !!formik.errors.age}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.age}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Gender */}
            <Form.Group className="mb-3">
              <Form.Select
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.gender && !!formik.errors.gender}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formik.errors.gender}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Contact Number */}
            <Form.Group className="mb-3">
              <Form.Control
                name="contact_number"
                type="text"
                placeholder="Contact Number"
                value={formik.values.contact_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.contact_number &&
                  !!formik.errors.contact_number
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.contact_number}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Control
                name="email"
                type="email"
                placeholder="Email Address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.email && !!formik.errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Address */}
            <Form.Group className="mb-3">
              <Form.Control
                name="address"
                type="text"
                placeholder="Address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.address && !!formik.errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.address}
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

export default ListPatients;
