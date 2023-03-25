import { TextField } from "@mui/material";
import { doc, getDocFromServer, updateDoc } from "firebase/firestore";
import { ReactElement, useEffect, useState } from "react";
import { useFirestore } from "reactfire";

export interface MoraleTeamNames {
  [key: number]: string;
}

export interface MoraleTeamPoints {
  [key: number]: number;
}


const MoraleConsole = () => {
  const moraleTeamRows: ReactElement[] = [];

  const [ moraleTeamPoints, setMoraleTeamPoints ] = useState<{[key: string]: number}>({});
  const [ oldMoraleTeamPoints, setOldMoraleTeamPoints ] = useState<{[key: string]: number}>({});

  const firestore =useFirestore();

  useEffect(() => {
    const moralePointsDoc = doc(firestore, "marathon/2023/morale/points");
    getDocFromServer(moralePointsDoc).then((doc) => {
      if (doc.exists()) {
        setMoraleTeamPoints(doc.data());
        setOldMoraleTeamPoints(doc.data());
      }
    }).catch((error) => {
      if (error instanceof Error) {
        console.error(error);
        alert(error.message);
      } else {
        console.error(error);
        alert("An error occurred");
      }
    });
  }, [firestore]);

  for (let i = 1; i <= 24; i++) {
    moraleTeamRows.push(
      <div key={i}>
        <h2>Team {i}</h2 >
        <TextField onSubmit={(event) => {
          event.preventDefault();

          const moralePointsDoc = doc(firestore, "marathon/2023/morale/points");
          const points = moraleTeamPoints[i.toString()];
          if (isNaN(points)) {
            alert(`Invalid point value for ${ i}`);
            return;
          }
          updateDoc(moralePointsDoc, { [i.toString()]: points });
        }}
        onChange={(event) => {
          const text = (event.nativeEvent.target as HTMLInputElement).value;
          const integerPoints = parseInt(text, 10);
          if (isNaN(integerPoints)) {
            alert(`Invalid point value for ${ i}`);
            return;
          }
          setMoraleTeamPoints((prevMoraleTeamPoints) => {
            return {
              ...prevMoraleTeamPoints,
              [i.toString()]: integerPoints,
            };
          });
        }}
        value={moraleTeamPoints[i.toString()] ?? "Loading..."}
        helperText={oldMoraleTeamPoints[i.toString()] !== moraleTeamPoints[i.toString()] ? `Was: ${oldMoraleTeamPoints[i.toString()] ?? "Loading..."} points` : undefined}
        />
      </div>
    );
  }

  return (
    <div>
      <h1>Morale Console</h1>
      {moraleTeamRows}
    </div>
  );
};

export default MoraleConsole;
