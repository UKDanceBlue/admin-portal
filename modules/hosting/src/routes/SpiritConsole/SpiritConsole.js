"use strict";
exports.__esModule = true;
var SpiritTeamDataGrid_1 = require("../../components/SpiritTeamDataGrid");
var SpiritConsole = function () {
    return (<div>
      <h1>SpiritConsole</h1>
      <div style={{ minHeight: "60vh", display: "flex" }}>
        <div style={{ flex: 1, padding: "1em" }}>
          <SpiritTeamDataGrid_1["default"] />
        </div>
      </div>
    </div>);
};
exports["default"] = SpiritConsole;
