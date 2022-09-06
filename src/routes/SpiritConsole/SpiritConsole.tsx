import OpportunityDataGrid from "./OpportunityConsole/OpportunityDataGrid";
import SpiritTeamDataGrid from "./SpiritTeamDataGrid";

const SpiritConsole = () => {
  return (
    <div>
      <h1>SpiritConsole</h1>
      <div style={{ minHeight: "60vh", display: "flex" }}>
        <div style={{ flex: 1, padding: "1em" }}>
          <SpiritTeamDataGrid />
        </div>
      </div>
      <div style={{ minHeight: "60vh", display: "flex" }}>
        <div style={{ flex: 1, padding: "1em" }}>
          <OpportunityDataGrid />
        </div>
      </div>
    </div>
  );
};

export default SpiritConsole;
