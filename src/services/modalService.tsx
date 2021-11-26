export enum ModalTypes {
  AccountInfo,
}

// not working!
class ModalService {
  currentModal: ModalTypes
  constructor() {}

  setModal(type: ModalTypes) {
    this.currentModal = type != this.currentModal ? type : null
  }
}

export default new ModalService()