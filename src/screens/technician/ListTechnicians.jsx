import React, { useEffect, useState } from "react";
import {
  addTechnicianAPI,
  deleteTechnicianAPI,
  listTechniciansAPI,
  updateTechnicianAPI,
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
function ListTechnicians() {
  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState("");
  const [totalPage, setTotalPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTechnicians();
  }, [searchKey]);

  const fetchTechnicians = async () => {
    try {
      const result = await listTechniciansAPI(1, 10, searchKey);
      console.log(result.data.data);
      setList(result.data.data);
      setTotalPage(result.data.total_pages);
    } catch (e) {
      console.log(e);
    }
  };

  const headers = [
    { label: "Name", accessor: "name" },
    { label: "Specialization", accessor: "specialization" },
    { label: "Mobile", accessor: "contact_number" },
    { label: "Email", accessor: "email" },
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
        specialization: row.specialization || "",
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
      specialization: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Name is required")
        .min(2, "Name should have at least 2 characters"),
      specialization: Yup.string()
        .required("Specialization is required")
        .min(2, "Specializaion should have at least 2 characters"),
      contact_number: Yup.string()
        .required("Contact number is required")
        .matches(/^[0-9]{10}$/, "Contact number must be 10 digits"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      console.log("Form data", values);
      setLoading(true);
      try {
        const data = {
          name: values.name,
          email: values.email,
          contact_number: values.contact_number,
          specialization: values.specialization,
        };
        if (isEdit) {
          var result = await updateTechnicianAPI(id, data);
        } else {
          var result = await addTechnicianAPI(data);
        }
        if (result.status === 200) {
          toast.success(result.data.message);
          handleClose();
          setLoading(false);
          fetchTechnicians();
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
      const result = await listTechniciansAPI(currentPage, 10, searchKey);
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
      const result = await deleteTechnicianAPI(id);
      if (result.status === 200) {
        toast.success(result.data.message);
        fetchTechnicians();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="content-area">
      <Breadcrumb title="Technician" breadcrumbItem="List Technicians" />
      <TableContainer
        headers={headers}
        data={list}
        onButtonClick={handleButtonClick}
        onAddClick={handleShow}
        addButtonText={"Add Technician"}
        searchPlaceHolder={"Search by technician name..."}
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
                placeholder="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.name && !!formik.errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.name}
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

            {/* Specialization */}
            <Form.Group className="mb-3">
              <Form.Control
                name="specialization"
                type="text"
                placeholder="Specialization"
                value={formik.values.specialization}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.specialization &&
                  !!formik.errors.specialization
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.specialization}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              S{" "}
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

export default ListTechnicians;
