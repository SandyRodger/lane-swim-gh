import LaneSwimGrid from "../../laneSwim/LaneSwimGrid";
import { laneSwimWeekly } from "../data/laneSwimSchedule";

export default function LaneSwimPage() {
  return (
    <div>
      <h1>Lane Swim</h1>
      <p>Prince Regent Swimming Complex — weekly lane swim timetable.</p>
      <p>Because the <a href="https://www.freedom-leisure.co.uk/centres/prince-regent-swimming-complex/timetables/">offical timetable</a> is very confusing</p>
      <p>
        <a
          href="https://github.com/SandyRodger/lane-swim-gh"
          target="_blank"
          rel="noopener noreferrer"
        >
          View source on GitHub
        </a>
      </p>


      <LaneSwimGrid
        schedule={laneSwimWeekly}
        start="06:00"
        end="22:00"
        stepMinutes={30}
      />
    </div>
  );
}