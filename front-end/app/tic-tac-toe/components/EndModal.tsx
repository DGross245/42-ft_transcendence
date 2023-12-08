"use client"

import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

const EndModal = ({ isOpen, onClose }) => {
	return (
	  <Modal
		backdrop="opaque"
		isOpen={isOpen}
		onClose={onClose}
		classNames={{
		  backdrop: 'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20'
		}}
		style={{ 
			backgroundColor: 'rgba(25, 25, 25, 0.8)',
		}}
	  >
		<ModalContent>
		<ModalHeader className="flex flex-col gap-1 items-center justify-center">
			Win
		</ModalHeader>
		  <ModalBody>
		  </ModalBody>
		  <ModalFooter className="flex justify-center">
			<Button color="danger" variant="light" onClick={onClose}>
			  Close
			</Button>
			<Button color="primary" onClick={onClose}>
			  Action
			</Button>
		  </ModalFooter>
		</ModalContent>
	  </Modal>
	);
  };

export default EndModal;
