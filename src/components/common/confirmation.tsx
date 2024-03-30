"use client";
import React, { useState } from "react";
import { Button, Modal } from "react-daisyui";

interface Props {
  children: React.ReactNode;
  onConfirm: () => void;
  text: string;
  confirmText?: string;
  cancelText?: string;
}

export default function Confirmation({
  children,
  onConfirm,
  text,
  confirmText = "Ya",
  cancelText = "Tidak",
}: Props) {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);

  const confirm = () => {
    onConfirm();
    toggle();
  };

  return (
    <div>
      <div className="cursor-pointer" onClick={toggle}>
        {children}
      </div>
      <Modal.Legacy open={open} onClickBackdrop={toggle}>
        <div>{text}</div>

        <Modal.Actions>
          <Button className="flex-1" onClick={toggle} variant="outline">
            {cancelText}
          </Button>
          <Button className="flex-1" onClick={confirm} color="primary">
            {confirmText}
          </Button>
        </Modal.Actions>
      </Modal.Legacy>
    </div>
  );
}
