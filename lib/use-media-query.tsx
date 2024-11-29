import { useState, useEffect } from "react";

export function useMediaQuery(query: string) {
  const [isMatch, setMatch] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);

    const handleChange = ({ matches }: MediaQueryListEvent): void => {
      setMatch(matches);
    };

    mql.addEventListener("change", handleChange);

    return () => {
      mql.removeEventListener("change", handleChange);
    };
  }, [query]);

  return isMatch;
}
