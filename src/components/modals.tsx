import * as React from 'react'
import modalService, { ModalTypes } from '../services/modalService'

// not working!
const Modals = () => {
  console.log('rerender')
  if (modalService.currentModal == null) {
    return null
  }
  return (
    <div className="modalContainer">
      { modalService.currentModal == ModalTypes.AccountInfo &&
        <div className="modalBody accountModal">
          <p>logout</p>
        </div>
      }
    </div>
  )
}

export default Modals