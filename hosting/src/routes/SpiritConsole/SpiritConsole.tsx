import SpiritTeamDataGrid from "../../components/SpiritTeamDataGrid";

const SpiritConsole = () => {
  return (
    <div>
      <h1>SpiritConsole</h1>
      <div style={{ minHeight: "60vh", display: "flex" }}>
        <div style={{ flex: 1, padding: "1em" }}>
          <SpiritTeamDataGrid />
        </div>
      </div>
    </div>
  );
};

export default SpiritConsole;
