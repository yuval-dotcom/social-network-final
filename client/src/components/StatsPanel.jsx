import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { api } from "../api/http.js";

function drawBarChart(svgElement, data, labelKey) {
  const width = 360;
  const height = 220;
  const margin = { top: 16, right: 16, bottom: 54, left: 38 };
  const svg = d3.select(svgElement);

  svg.selectAll("*").remove();
  svg.attr("viewBox", `0 0 ${width} ${height}`);

  const x = d3
    .scaleBand()
    .domain(data.map((item) => item[labelKey]))
    .range([margin.left, width - margin.right])
    .padding(0.18);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (item) => item.count) || 1])
    .nice()
    .range([height - margin.bottom, margin.top]);

  svg
    .append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (item) => x(item[labelKey]))
    .attr("y", (item) => y(item.count))
    .attr("width", x.bandwidth())
    .attr("height", (item) => y(0) - y(item.count))
    .attr("rx", 6)
    .attr("fill", "#176b87");

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-30)")
    .style("text-anchor", "end");

  svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y).ticks(4));
}

export function StatsPanel({ copy }) {
  const monthRef = useRef(null);
  const groupRef = useRef(null);
  const [message, setMessage] = useState("");

  async function loadCharts() {
    const [monthResult, groupResult] = await Promise.all([api.postsByMonth(), api.postsByGroup()]);
    drawBarChart(monthRef.current, monthResult.data || [], "month");
    drawBarChart(groupRef.current, groupResult.data || [], "groupName");
    setMessage(copy.stats.loaded);
  }

  useEffect(() => {
    drawBarChart(monthRef.current, [], "month");
    drawBarChart(groupRef.current, [], "groupName");
  }, []);

  return (
    <section className="panel" id="stats">
      <div className="panel-heading">
        <h2>{copy.stats.title}</h2>
        <button type="button" onClick={loadCharts}>{copy.stats.load}</button>
      </div>
      <div className="chart-grid">
        <figure>
          <figcaption>{copy.stats.byMonth}</figcaption>
          <svg ref={monthRef} role="img" aria-label={copy.stats.byMonth} />
        </figure>
        <figure>
          <figcaption>{copy.stats.byGroup}</figcaption>
          <svg ref={groupRef} role="img" aria-label={copy.stats.byGroup} />
        </figure>
      </div>
      {message && <p className="form-message">{message}</p>}
    </section>
  );
}

