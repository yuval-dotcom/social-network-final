export function ModelMap({ copy }) {
  return (
    <section className="model-map" aria-labelledby="model-map-title">
      <div className="model-map-heading">
        <p className="eyebrow">{copy.management.modelMapEyebrow}</p>
        <h3 id="model-map-title">{copy.management.modelMapTitle}</h3>
        <p>{copy.management.modelMapBody}</p>
      </div>
      <div className="model-card-grid">
        {copy.management.models.map((model) => (
          <article className="model-card" key={model.name}>
            <span>{model.name}</span>
            <h4>{model.title}</h4>
            <p>{model.body}</p>
            <strong>{model.fields}</strong>
          </article>
        ))}
      </div>
      <div className="model-flow">
        <strong>{copy.management.modelFlowTitle}</strong>
        <p>{copy.management.modelFlowBody}</p>
      </div>
    </section>
  );
}
