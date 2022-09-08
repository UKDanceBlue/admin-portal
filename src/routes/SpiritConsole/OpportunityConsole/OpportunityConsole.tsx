import OpportunityDataGrid from "./OpportunityDataGrid";

const OpportunityConsole = () => {
  return (
    <div>
      <h1>Spirit Opportunities</h1>
      <div style={{ minHeight: "60vh", display: "flex" }}>
        <div style={{ flex: 1, padding: "1em" }}>
          <OpportunityDataGrid />
        </div>
      </div>
    </div>
  );
};

export default OpportunityConsole;
