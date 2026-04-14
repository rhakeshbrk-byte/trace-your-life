import { ReactNode, useEffect, useState, useRef } from "react";

interface PageTransitionProps {
  children: ReactNode;
  locationKey: string;
}

const PageTransition = ({ children, locationKey }: PageTransitionProps) => {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitioning, setTransitioning] = useState(false);
  const prevKey = useRef(locationKey);

  useEffect(() => {
    if (prevKey.current !== locationKey) {
      setTransitioning(true);
      const timeout = setTimeout(() => {
        setDisplayChildren(children);
        setTransitioning(false);
        prevKey.current = locationKey;
      }, 150);
      return () => clearTimeout(timeout);
    } else {
      setDisplayChildren(children);
    }
  }, [locationKey, children]);

  return (
    <div
      className={`transition-all duration-200 ease-out ${
        transitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
      }`}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
