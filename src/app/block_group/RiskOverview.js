function RiskOverview({ title, icon, overview, actions, riskLevel }) {
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
        // padding: "12px 0",
        marginBottom: "24px",
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
            className="col-xs-4 col-sm-3 col-md-2 col-lg-2 "
            style={{ padding: "16px" }}
          >
            <div className="text-center">
              <img src={icon} width="100%" height="auto" aria-hidden="true" />
              <h3 className="h4">{title}</h3>
            </div>
          </div>
          <div
            className="col-xs-8 col-sm-9 col-md-10 col-lg-10"
            style={{ padding: "16px" }}
          >
            <div dangerouslySetInnerHTML={{ __html: overview }} />
            <a href={actions} className="" target="_blank">
              Actions you can take now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiskOverview;
