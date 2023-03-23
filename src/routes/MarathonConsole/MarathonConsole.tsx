import { Link } from "react-router-dom";

const MarathonConsole = () => {
  const hours: number[] = [];

  for (let i = 1; i <= 24; i++) {
    hours.push(i);
  }

  return (
    <div>
      <h1>MarathonConsole</h1>
      <p>Don&apos;t mind the lack of decor, just click a link to go to the editor</p>
      {
        hours.map((hour) => {
          return (
            <div key={hour}>
              <Link to={`/marathon/${hour}`}>Hour {hour}</Link>
            </div>
          );
        })
      }
    </div>
  );
};

export default MarathonConsole;
