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
	  >
		<ModalContent>
		  <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
		  <ModalBody>
		  		<p> 
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
                  dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. 
                  Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. 
                  Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur 
                  proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
		  </ModalBody>
		  <ModalFooter>
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
