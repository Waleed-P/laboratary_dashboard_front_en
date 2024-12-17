import React, { useEffect, useState } from "react";
import {
  addResultAPI,
  deleteResultAPI,
  generatePredictionAPI,
  listResultsAPI,
  updateResultAPI,
} from "../../services/allAPI";
import ReactMarkdown from "react-markdown";
import ReactPaginate from "react-paginate";
import { AreaTop } from "../../components";
import TableContainer from "../../components/common/TableContainer";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import WarningModal from "../../components/common/WarningModal";
import { Link } from "react-router-dom";
import Breadcrumb from "../../components/common/Breadcrumb";
import Placeholder from "react-bootstrap/Placeholder";

function ListResults() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [id, setId] = useState("");
  const [totalPage, setTotalPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [showPredictionModal, setShowPredictionModal] = useState(false);

  // Functions to handle modal open/close
  const closePredictionModal = () => setShowPredictionModal(false);
  const openPredictionModal = () => setShowPredictionModal(true);

  useEffect(() => {
    fetchPatients();
  }, [searchKey]);

  const fetchPatients = async () => {
    try {
      const result = await listResultsAPI(1, 10, searchKey);
      console.log(result.data.data);
      setList(result.data.data);
      setTotalPage(result.data.total_pages);
    } catch (e) {
      console.log(e);
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  const [predicion, setPredicion] = useState("");
  const generatePrediction = async (result_id) => {
    try {
      setIsLoading(true);
      const result = await generatePredictionAPI(result_id);
      if (result.status == 200) {
        setIsLoading(false);
        setPredicion(result.data.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const headers = [
    { label: "Test", accessor: "test" },
    { label: "Patient Name", accessor: "patient_name" },
    {
      label: "Action",
      accessor: "status",
      button: [
        { label: "Edit", action: "edit" },
        { label: "Delete", action: "delete" },
        { label: "View", action: "view" },
        { label: "Generate Prediction", action: "predict" },
      ],
    },
  ];
  const [resultDetails, setResultDetails] = useState({
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
  });

  const handleButtonClick = (row, header, btn) => {
    if (btn.action === "edit") {
      const data = {
        id: row._id,
        test: row.test,
        age: row.age,
        gender: row.gender,
        weight: row.weight,
        height: row.height,
        medical_history: row.medical_history,
        hemoglobin: row.hemoglobin,
        wbc: row.wbc,
        rbc: row.rbc,
        cholesterol: row.cholesterol,
        smoking: row.smoking,
        alcohol: row.alcohol,
        activity_level: row.activity_level,
        medications: row.medications,
        symptoms: row.symptoms,
      };
      localStorage.setItem("editData", JSON.stringify(data));
      localStorage.setItem("isEdit", true);
      navigate("/add_result");
    } else if (btn.action === "delete") {
      setId(row._id);
      openWarningModal();
    } else if (btn.action === "view") {
      handleShow();
      setResultDetails({
        ...resultDetails,
        test: row.test,
        age: row.age,
        gender: row.gender,
        weight: row.weight,
        height: row.height,
        medical_history: row.medical_history,
        hemoglobin: row.hemoglobin,
        wbc: row.wbc,
        rbc: row.rbc,
        cholesterol: row.cholesterol,
        smoking: row.smoking,
        alcohol: row.alcohol,
        activity_level: row.activity_level,
        medications: row.medications,
        symptoms: row.symptoms,
      });
    } else if (btn.action === "predict") {
      openPredictionModal();
      generatePrediction(row._id);
    }
  };
  // Pagination
  const fetchPage = async (currentPage) => {
    console.log(currentPage);
    try {
      const result = await listResultsAPI(currentPage, 10, searchKey);
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
  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <div className="content-area">
      <Breadcrumb title="Results" breadcrumbItem="List Results" />

      <TableContainer
        headers={headers}
        data={list}
        onButtonClick={handleButtonClick}
        onAddClick={() => {
          navigate("/add_result");
        }}
        addButtonText={"Add Result"}
        searchPlaceHolder={"Search by patient name..."}
        searchOnChange={(e) => setSearchKey(e.target.value)}
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
      <Modal size="xl" show={showPredictionModal} onHide={closePredictionModal}>
        <Modal.Header closeButton>
          <Modal.Title>Patients future predictions and suggestions</Modal.Title>
        </Modal.Header>
        {isLoading ? (
          <Modal.Body>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={6} /> <Placeholder xs={8} />{" "}
              <Placeholder xs={4} />
            </Placeholder>
          </Modal.Body>
        ) : (
          <Modal.Body>
            <ReactMarkdown>{predicion}</ReactMarkdown>
          </Modal.Body>
        )}
      </Modal>
      <WarningModal
        show={showWarningModal}
        handleClose={closeWarningModal}
        handleDelete={handleDelete}
      />
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Result Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Object.entries(resultDetails).map(([key, value]) => (
            <div key={key} style={{ marginBottom: "10px" }}>
              <strong style={{ textTransform: "capitalize" }}>
                {key.replace("_", " ")}:
              </strong>{" "}
              <span>
                {value === true ? "Yes" : value === false ? "No" : value}
              </span>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ListResults;
