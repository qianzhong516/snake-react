import { RATIO } from '../constants';

export const Snake = ({ body }) =>
  body.map(([left, top], i) => (
    <div
      key={i}
      style={{
        left: `${left * RATIO}%`,
        top: `${top * RATIO}%`,
        width: `${RATIO}%`,
        height: `${RATIO}%`,
      }}
      className="snake"
    ></div>
  ));
