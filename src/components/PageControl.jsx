import React from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button';

const PageControl = ({ pageNumber, totalPages, Decrease, Increase }) => {
  const decreaseDisabled = pageNumber === 1
  const encreaseDisabled = pageNumber === totalPages
  return <div className="page-control">
    <Button
      disabled={decreaseDisabled}
      onClick={Decrease}
    >{'<'}</Button>
    <span className="mx-2">{`Página ${pageNumber}`}</span>
    <Button
      disabled={encreaseDisabled}
      onClick={Increase}
    >{'>'}</Button>
  </div>
}

PageControl.propTypes = {
  pageNumber: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  Decrease: PropTypes.func.isRequired,
  Increase: PropTypes.func.isRequired
}

export default PageControl