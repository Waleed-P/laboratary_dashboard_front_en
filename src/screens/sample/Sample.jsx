import React, { useEffect, useState } from "react";
import {
  addResultAPI,
  deleteResultAPI,
  listResultsAPI,
  updateResultAPI,
} from "../../services/allAPI";
import ReactPaginate from "react-paginate";
import { AreaTop } from "../../components";
import TableContainer from "../../components/common/TableContainer";
import { Modal, Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import WarningModal from "../../components/common/WarningModal";

function Sample() {
  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState("");
  const [totalPage, setTotalPage] = useState(1);
  const [dynamicFields, setDynamicFields] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const result = await listResultsAPI();
      console.log(result.data.data);
      setList(result.data.data);
      setTotalPage(result.data.total_pages);
    } catch (e) {
      console.log(e);
    }
  };

  const headers = [
    { label: "Test", accessor: "test" },
    { label: "Result", accessor: "result" },
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
        test: row.test || "",
        result: row.result || "",
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
      test: "",
      dynamicResults: [], // Stores the array of key-value pairs
    },
    validationSchema: Yup.object({
      test: Yup.string()
        .required("Test name is required")
        .min(2, "Test name should have at least 2 characters"),
    }),
    onSubmit: async (values) => {
      console.log("Form data", values);
      handleClose();
      try {
        const data = {
          test: values.test,
          result: values.dynamicResults,
        };
        console.log(data);
        if (isEdit) {
          var result = await updateResultAPI(id, data);
        } else {
          var result = await addResultAPI(data);
        }
        if (result.status === 200) {
          toast.success(result.data.message);
          fetchPatients();
          setIsEdit(false);
          setDynamicFields([]);
        }
      } catch (e) {
        console.log(e);
      }
    },
  });
  //result dynamic field
  const handleAddField = () => {
    setDynamicFields([...dynamicFields, { key: "", value: "" }]);
  };

  // Update the value of a dynamic field
  const handleDynamicFieldChange = (index, field, value) => {
    const updatedFields = [...dynamicFields];
    updatedFields[index][field] = value;
    setDynamicFields(updatedFields);
    formik.setFieldValue("dynamicResults", updatedFields);
  };

  // Remove a dynamic field
  const handleRemoveField = (index) => {
    const updatedFields = dynamicFields.filter((_, i) => i !== index);
    setDynamicFields(updatedFields);
    formik.setFieldValue("dynamicResults", updatedFields);
  };

  // Pagination
  const fetchPage = async (currentPage) => {
    try {
      const result = await listResultsAPI(currentPage, 10);
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
      const result = await deleteResultAPI(id);
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
      <AreaTop />
      <TableContainer
        headers={headers}
        data={list}
        onButtonClick={handleButtonClick}
        onAddClick={handleShow}
        addButtonText={"Add Result"}
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
          <Modal.Title>{isEdit ? "Edit Result" : "Add New Result"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            {/* Test Name */}
            <Form.Group className="mb-3">
              <Form.Control
                name="test"
                type="text"
                placeholder="Test Name"
                value={formik.values.test}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.test && !!formik.errors.test}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.test}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Dynamic Result Inputs */}
            <div>
              <h6>Result Details:</h6>
              {dynamicFields.map((field, index) => (
                <div className="d-flex mb-2" key={index}>
                  <Form.Control
                    type="text"
                    placeholder="Key"
                    value={field.key}
                    onChange={(e) =>
                      handleDynamicFieldChange(index, "key", e.target.value)
                    }
                    className="me-2"
                  />
                  <Form.Control
                    type="text"
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) =>
                      handleDynamicFieldChange(index, "value", e.target.value)
                    }
                    className="me-2"
                  />
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveField(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button variant="primary" onClick={handleAddField}>
                Add Field
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={formik.isSubmitting}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Sample;
