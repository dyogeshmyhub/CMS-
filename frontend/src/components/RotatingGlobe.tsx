export default function RotatingGlobe() {
  return (
    <div className="globe-shell" aria-label="Global marketplace connection map">
      <div className="globe-orbit globe-orbit-one" />
      <div className="globe-orbit globe-orbit-two" />
      <div className="globe-core">
        <div className="globe-grid" />
        <div className="globe-highlight" />
        <div className="globe-node globe-node-one" />
        <div className="globe-node globe-node-two" />
        <div className="globe-node globe-node-three" />
      </div>
    </div>
  )
}
