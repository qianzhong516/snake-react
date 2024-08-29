import { RATIO } from '../constants';

export const Food = ({ pos }) => (
  <div
    className="food"
    style={{
      left: `${pos[0] * RATIO}%`,
      top: `${pos[1] * RATIO}%`,
      width: `${RATIO}%`,
      height: `${RATIO}%`,
    }}
  ></div>
);
