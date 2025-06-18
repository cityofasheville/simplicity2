import React, { useState, useEffect, useCallback } from "react";

const CIPTimeline = ({ currentStatusItem, phase }) => {
  const [dimensions, setDimensions] = useState(null);

  const updateDimensions = useCallback(() => {
    const container = document
      .getElementById("permit-timeline-container")
      ?.getBoundingClientRect();
    if (container) {
      setDimensions({
        width: container.width,
        height: container.height,
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [updateDimensions]);

  const renderContent = () => {
    const padding = 15;
    const pointRadius = 8;

    // let datesToUse = formattedPermit.orderedDates;
    // if (currentStatusItem !== undefined && !currentStatusItem.closed) {
    //   datesToUse = [
    //     ...datesToUse,
    //     {
    //       accelaLabel: "dummy",
    //       dateInput: null,
    //       displayLabel: "",
    //     },
    //   ];
    // }

    let datesToUse = [
      {
        accelaLabel: "Pre-App Date",
        displayLabel: "Proposed",
        dateInput: "3/13/2025",
      },
      {
        accelaLabel: "Neighborhood Meeting Date",
        displayLabel: "Planning",
        dateInput: "05/08/2025",
      },
      {
        accelaLabel: "applied_date",
        displayLabel: "Design",
        dateInput: "2025-05-08 00:00:00",
      },
      {
        accelaLabel: "Initial TRC Date 1",
        displayLabel: "Construction",
        dateInput: "05/08/2025",
      },
    ];

    if (phase == "Completed") {
      datesToUse.push({
        accelaLabel: "Initial TRC Date 1",
        displayLabel: "Completed",
        dateInput: "05/09/2025",
      });
    } else {
      datesToUse.push({
        accelaLabel: "dummy",
        dateInput: null,
        displayLabel: "",
      });
    }

    let color = "#2b753f;";

    const timelineWidth = Math.max(
      datesToUse.length * 125,
      dimensions.width - padding
    );
    const midpointX = timelineWidth / 2;
    const eachWidth =
      (timelineWidth - (padding + padding * datesToUse.length)) /
      datesToUse.length;
    const midRowIndex = (datesToUse.length - 1) / 2;

    const getX = (dateObj, i) =>
      midpointX +
      ((i % datesToUse.length) - midRowIndex) * (padding + eachWidth);

    let strokeColors = ["#ff0000", "#00ff00", "#0000ff", "#ffa500"]; // as many as needed

    if (phase == "Proposed") {
      strokeColors = ["#216923", "#5c5c5c", "#5c5c5c", "#5c5c5c"];
    }

    const labelOrder = [
      "Proposed",
      "Planning",
      "Design",
      "Construction",
      "Completed",
    ];
    const index = labelOrder.indexOf(phase);

    let strokeColor = "#4b9617";

    let circleColor = "#4b9617";
    let newStrokeColor = "";
    let newCircleColor = "";

    return (
      <svg height={dimensions.height} width={timelineWidth} aria-label={`A timeline showing that the project is in the ${phase} phase`}>
        {/* Render all lines first */}
        {datesToUse.map((d, i, datesArray) => {
          if (newStrokeColor ) {
            strokeColor = newStrokeColor;
          }
          if (phase == "Proposed") {
            strokeColor = "#a3a3a3";
          }
          
          if (i === 0) return null;
          const thisX = getX(d, i);
          const prevX = getX(datesArray[i - 1], i - 1);
          const circleY = padding + pointRadius;
          console.log(d.accelaLabel, phase);
          if (d.displayLabel == phase) {
            newStrokeColor = "#a3a3a3";
          }
          return (
            // line
            <path
              key={`line-${i}`}
              d={`M${prevX} ${circleY} L${thisX} ${circleY}`}
              stroke={strokeColor}
              strokeWidth="3px"
              fill="none"
            />
          );
        })}

        {datesToUse.map((d, i) => {
          if (newCircleColor) {
            circleColor = newCircleColor;
          }
          const thisX = getX(d, i);
          const circleY = padding + pointRadius;
          if (d.displayLabel == phase) {
            newCircleColor = "#a3a3a3";
          }

          return (
            <g key={d.accelaLabel}>
              {/* circle */}
              {d.accelaLabel !== "dummy" && (
                <>
                  {/* Outline circle when selected */}
                  {d.displayLabel === phase && (
                    <circle
                      cx={thisX}
                      cy={circleY}
                      r={pointRadius + 4}
                      fill="none"
                      stroke={circleColor}
                      strokeWidth={2}
                    />
                  )}
                  {/* Main circle */}
                  <circle
                    cx={thisX}
                    cy={circleY}
                    r={pointRadius}
                    fill={circleColor}
                  />
                </>
              )}
              {d.accelaLabel === "dummy" && (
                // arrow
                <path
                  d={`M${thisX},${circleY - pointRadius / 2} L${thisX},${
                    circleY + pointRadius / 2
                  } L${thisX + pointRadius},${circleY} z`}
                  fill={"#a3a3a3"}
                />
              )}

              {d.dateInput && (
                <foreignObject
                  x={thisX - eachWidth / 2}
                  y={padding * 2 + pointRadius}
                  width={eachWidth}
                  height={dimensions.height - (padding * 3 + pointRadius)}
                  style={{ overflow: "visible" }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      padding: "0.5rem",
                      fontSize: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        fontWeight:
                          d.displayLabel === phase ? "bold" : "normal",
                      }}
                    >

                        {d.displayLabel}
                    </div>
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div id="permit-timeline-container">
      <div style={{ padding: "0.25rem 0.25rem 0.5rem 0", fontWeight: "500", marginBottom: "15px" }}>
        Project Status:
      </div>
      {dimensions && renderContent()}
    </div>
  );
};

export default CIPTimeline;
