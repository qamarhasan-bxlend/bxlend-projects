import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div<{ $isVisible: boolean; $$offsetY: number; $transitionTime: number }>`
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transform: ${(props) =>
    props.$isVisible ? 'translateY(0)' : `translateY(${props.$$offsetY}px)`};
  transition: ${(props) =>
    `opacity ${props.$transitionTime}s ease-out, transform ${props.$transitionTime}s ease-out`};
`;

interface FadeInSectionProps {
  children: React.ReactNode;
  threshold?: number;
  $offsetY?: number;
  $transitionTime?: number;
  $className?: string;
}

export const FadeInSection: React.FC<FadeInSectionProps> = ({
  children,
  threshold = 0.3,
  $offsetY = 40,
  $transitionTime = 0.6,
  $className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Wrapper
      ref={sectionRef}
      $isVisible={isVisible}
      $$offsetY={$offsetY}
      $transitionTime={$transitionTime}
      className={$className}
    >
      {children}
    </Wrapper>
  );
};
