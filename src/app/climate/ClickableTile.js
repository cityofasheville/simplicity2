import { link } from "d3-shape";
import React from "react";

function ClickableTile({ image, url, text }) {
  const tileRef = React.useRef();
  const linkRef = React.useRef();

  function handleClick(e) {
    if (e.button === 0) {
      if (!e.target.matches(".card-link-action")) {
        linkRef.current.click();
      }
    }
  }

  return (
    <div
      className="clickable-tile"
      ref={tileRef}
      style={{ cursor: "pointer" }}
      onClick={handleClick}
    >
      <div
        style={{
          paddingBottom: "100%",
          width: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={image}
          width="auto"
          height="100%"
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            minHeight: "100%",
          }}
        />
        <a
          ref={linkRef}
          href={url}
          className="h4 tile-link-action"
          target="_blank"
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              margin: "0",
              position: "absolute",
              bottom: "0",
              width: "100%",
              height: "64px",
              padding: "8px",
              backgroundColor: "rgba(255,255,255,0.85)",
            }}
          >
            {text}
          </span>
        </a>
      </div>
    </div>
  );
}

export default ClickableTile;
