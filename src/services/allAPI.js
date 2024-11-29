import { commonAPI } from "./commonAPI"
import { SERVER_URL } from "./serverURL"
//register api
export const registerAPI = async (reqBody)=>{
    return await  commonAPI("POST",`${SERVER_URL}/register`,reqBody)
}
//login
export const loginAPI = async (reqBody)=>{
    return await  commonAPI("POST",`${SERVER_URL}/login`,reqBody)
}
//---------------------Doctors---------------------//
//get doctors
export const listDoctorsAPI = async (page_no,page_size,search_key)=>{
    return await  commonAPI("GET",`${SERVER_URL}/get_doctors?page_size=${page_size}&page_no=${page_no}&search=${search_key}`)
}
//add doctor
export const addDoctorAPI = async (data)=>{
    return await  commonAPI("POST",`${SERVER_URL}/add_doctor`,data)
}
//edit doctor
export const updateDoctorAPI = async (id,data)=>{
    return await  commonAPI("PUT",`${SERVER_URL}/update_doctor/${id}`,data)
}
//delete doctor
export const deleteDoctorAPI = async (id)=>{
    return await  commonAPI("DELETE",`${SERVER_URL}/remove_doctor/${id}`)
}
//---------------------patients-------------------//
//get patients
export const listPatientsAPI = async (page_no,page_size,search_key)=>{
    return await  commonAPI("GET",`${SERVER_URL}/get_patients?page_size=${page_size}&page_no=${page_no}&search=${search_key}`)
}
//add patient
export const addPatientAPI = async (data)=>{
    return await  commonAPI("POST",`${SERVER_URL}/add_patient`,data)
}
//update patient
export const updatePatientAPI = async (patient_id,data)=>{
    return await  commonAPI("PUT",`${SERVER_URL}/update_patient/${patient_id}`,data)
}
//delete patient
export const deletePatientAPI = async (patient_id)=>{
    return await  commonAPI("DELETE",`${SERVER_URL}/remove_patient/${patient_id}`)
}
//----------------Technician------------------------------//
//get technicians
export const listTechniciansAPI = async (page_no,page_size,search_key)=>{
    return await  commonAPI("GET",`${SERVER_URL}/get_technicians?page_size=${page_size}&page_no=${page_no}&search=${search_key}`)
}
//add technician
export const addTechnicianAPI = async (data)=>{
    return await  commonAPI("POST",`${SERVER_URL}/add_technician`,data)
}
//update technician
export const updateTechnicianAPI = async (technician_id,data)=>{
    return await  commonAPI("PUT",`${SERVER_URL}/update_technician/${technician_id}`,data)
}
//delete technician
export const deleteTechnicianAPI = async (technician_id)=>{
    return await  commonAPI("DELETE",`${SERVER_URL}/remove_technician/${technician_id}`)
}

//------------------test-----------------//
//get tests
export const listTestsAPI = async (page_no,page_size,search_key)=>{
    return await  commonAPI("GET",`${SERVER_URL}/get_tests?page_size=${page_size}&page_no=${page_no}&search=${search_key}`)
}
//add test
export const addTestAPI = async (data)=>{
    return await  commonAPI("POST",`${SERVER_URL}/add_test`,data)
}
//update test
export const updateTestAPI = async (test_id,data)=>{
    return await  commonAPI("PUT",`${SERVER_URL}/update_test/${test_id}`,data)
}
//delete test
export const deleteTestAPI = async (test_id)=>{
    return await  commonAPI("DELETE",`${SERVER_URL}/remove_test/${test_id}`)
}

//-----------------------result-----------------------//
//get result
export const listResultsAPI = async (page_no,page_size,search_key)=>{
    return await  commonAPI("GET",`${SERVER_URL}/get_results?page_size=${page_size}&page_no=${page_no}&search=${search_key}`)
}
//add result
export const addResultAPI = async (data)=>{
    return await  commonAPI("POST",`${SERVER_URL}/add_result`,data)
}
//update result
export const updateResultAPI = async (result_id,data)=>{
    return await  commonAPI("PUT",`${SERVER_URL}/update_result/${result_id}`,data)
}
//delete result
export const deleteResultAPI = async (result_id)=>{
    return await  commonAPI("DELETE",`${SERVER_URL}/remove_result/${result_id}`)
}