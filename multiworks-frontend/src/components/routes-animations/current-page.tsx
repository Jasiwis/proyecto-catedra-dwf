import { useState } from "react";
import { useOutlet } from "react-router-dom";

export const CurrentPage = () => {
  const o = useOutlet();
  const [outlet] = useState(o);

  return <>{outlet}</>;
};
