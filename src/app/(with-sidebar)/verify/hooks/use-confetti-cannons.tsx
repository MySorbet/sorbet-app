import confetti from 'canvas-confetti';

/**
 * Confetti from bottom corners of the screen.
 * Modified from: https://magicui.design/docs/components/confetti
 */
export const useConfettiCannons = () => {
  const fire = () => {
    const end = Date.now() + 300; // 3 seconds
    const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1'];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 1 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 1 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  return { fire };
};
