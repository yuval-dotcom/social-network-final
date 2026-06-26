import * as d3 from "d3";
import { useEffect, useRef } from "react";

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

export function D3BarChart({ data, labelKey, title }) {
  const svgRef = useRef(null);

  useEffect(() => {
    drawBarChart(svgRef.current, data, labelKey);
  }, [data, labelKey]);

  return (
    <figure>
      <figcaption>{title}</figcaption>
      <svg ref={svgRef} role="img" aria-label={title} />
    </figure>
  );
}
