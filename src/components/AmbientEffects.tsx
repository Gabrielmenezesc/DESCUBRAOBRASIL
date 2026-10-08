type AmbientEffectsProps = {
  /** Decorative content only; it never receives pointer events. */
  videoSrc?: string;
};

/** A GPU-light 3D atmospheric layer used without changing page layout. */
export default function AmbientEffects({ videoSrc }: AmbientEffectsProps) {
  return (
    <div className="ambient-effects" aria-hidden="true">
      {videoSrc ? <video className="ambient-effects-video" autoPlay muted loop playsInline preload="metadata"><source src={videoSrc} type="video/mp4" /></video> : null}
      <span className="ambient-effects-grid" />
      <span className="ambient-effects-ring ambient-effects-ring-one" />
      <span className="ambient-effects-ring ambient-effects-ring-two" />
      <span className="ambient-effects-light" />
    </div>
  );
}
