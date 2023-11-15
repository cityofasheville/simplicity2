function RiskOverview({
  title,
  icon,
  overview,
  actions,
  riskLevel,
  externalLink,
}) {
  let indicatorColor;
  if (riskLevel === "high") {
    indicatorColor = "#bd2304";
  } else if (riskLevel === "medium") {
    indicatorColor = "orange";
  } else if (riskLevel === "low") {
    indicatorColor = "#4077a5";
  }
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        marginBottom: "32px",
      }}
    >
      <div
        className=""
        style={{
          border: "1px solid rgba(0,0,0,.15)",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            minHeight: "100%",
            paddingLeft: "4px",
            backgroundColor: indicatorColor,
            borderBottomLeftRadius: "4px",
            borderTopLeftRadius: "4px",
          }}
        ></div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            className="hidden-xs hidden-sm  col-md-2 col-lg-2 "
            style={{ padding: "16px" }}
          >
            <div className="text-center">
              <img src={icon} width="100%" height="auto" aria-hidden="true" />
            </div>
          </div>
          <div
            className="col-xs-12  col-md-10 col-lg-10"
            style={{ padding: "16px" }}
          >
            <div className="col-xs-12 col-md-6">
              <h3 className="h4">{title} Risk</h3>
              <div dangerouslySetInnerHTML={{ __html: overview }} />
            </div>
            <div className="col-xs-12 col-md-6">
              <h4 className="h4">Action Strategies</h4>
              <ul className="list-unstyled">
                {actions.map((action, index) => {
                  return (
                    <li
                      key={index}
                      style={{
                        padding: "0",
                        marginBottom: "16px",
                      }}
                    >
                      <span
                        style={{
                          borderLeft: "1px solid rgba(64, 119, 165, 0.5)",
                          padding: "0 8px",
                          display: "block",
                        }}
                      >
                        {action}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiskOverview;
