import React from "react";
import "./tableContainer.css";
import AreaTableAction from "../dashboard/areaTable/AreaTableAction"; // Assuming this is your custom action component
import "../dashboard/areaTable/AreaTable.scss";
// Table component that renders with provided heads and data
const TableContainer = ({
  headers,
  data,
  onButtonClick,
  searchOnChange,
  addButtonText,
  onAddClick,
  searchPlaceHolder,
}) => {
  return (
    <section className="content-area-table">
      <div className="topDiv">
        {/* <h4 className="data-table-title">Latest Orders</h4> */}
        <div>
          {" "}
          <input
            className="searchInput"
            type="text"
            placeholder={searchPlaceHolder}
            onChange={searchOnChange}
          />
        </div>
        <div>
          <button className="btn btn-primary" onClick={onAddClick}>
            {addButtonText}
          </button>
        </div>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {headers?.map((th, index) => (
                <th key={index}>{th.label}</th> // Render the header label
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((dataItem) => (
              <tr key={dataItem.id}>
                {headers?.map((header, colIndex) => {
                  return (
                    <td key={colIndex}>
                      {
                        header.button
                          ? // If the column has buttons, render them
                            header.button.map((btn, buttonIndex) => (
                              <button
                                key={buttonIndex}
                                onClick={() =>
                                  onButtonClick(dataItem, header, btn)
                                }
                                className="btn btn-primary ms-2"
                              >
                                {btn.label}
                              </button>
                            ))
                          : dataItem[header.accessor] // Default rendering for non-button columns
                      }
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TableContainer;
