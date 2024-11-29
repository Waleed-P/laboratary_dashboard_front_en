import React from "react"
import PropTypes from 'prop-types'
import { Link } from "react-router-dom"
import { Row ,Col, BreadcrumbItem } from "react-bootstrap"

const Breadcrumb = props => {
  return (
    <Row>
      <Col xs="12">
        <div className="page-title-box d-sm-flex align-items-center justify-content-between p-3">
          <h4 className="mb-0 font-size-20">{props.breadcrumbItem}</h4>
          <div className="page-title-right">
            <ol className="breadcrumb m-0">
              <BreadcrumbItem active>
               {props.title}
              </BreadcrumbItem>
              <BreadcrumbItem active >{props.breadcrumbItem}</BreadcrumbItem>
            </ol>
          </div>
        </div>
      </Col>
    </Row>
  )
}

export default Breadcrumb
