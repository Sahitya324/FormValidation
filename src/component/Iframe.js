import React, { useState } from "react";
import { createPortal } from "react-dom";
import "../App.css";

const CustomIframe = ({ children, ...props }) => {
  const [contentRef, setContentRef] = useState(null);

  const mountNode = contentRef?.contentWindow?.document?.body;

  return (
    <div className="Iframe">
      <iframe
        title="iFrame"
        {...props}
        ref={setContentRef}
        style={{ border: "1px solid red" }}
        height="570px"
      >
        {mountNode && createPortal(children, mountNode)}
      </iframe>
    </div>
  );
};

export default CustomIframe;
