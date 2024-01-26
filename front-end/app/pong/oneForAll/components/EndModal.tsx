"use client"

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

const EndModal = ({ isOpen, onClose, winner, setReset, disconnect }) => {

	return (
		<>
			<Modal
				backdrop="opaque"
				isOpen={isOpen}
				onClose={onClose}
				classNames={{
					backdrop: 'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20'
				}}
				style={{
					backgroundColor: 'rgba(25, 25, 25, 0.5)',
					position: 'relative',
					overflow: 'visible',
					backdropFilter: 'blur(5px)',
				}}
			>
				<ModalContent style={{ position: 'relative', overflow: 'visible' }}>
					<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<ModalHeader className="flex flex-col gap-1 items-center justify-center">
						{disconnect === true ? 'Forfeited' : winner === 'draw' ? 'Draw' : 'Wins' }
					</ModalHeader>
					</div>
					<ModalBody >
					</ModalBody>
					<ModalFooter className="flex justify-center">
					<Button color="danger" variant="ghost" onClick={onClose}>
						Close
					</Button>
					<Button color="primary" variant="ghost" onClick={() => setReset(true)}>
						Play Again
					</Button>
					<Button color="success" variant="ghost" onClick={onClose}>
						View
					</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

export default EndModal;