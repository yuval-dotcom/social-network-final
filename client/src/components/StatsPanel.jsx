import { useAppContext } from "../contexts/AppContext.jsx";
import { useState } from "react";
import { getApiErrorMessage } from "../api/apiError.js";
import { api } from "../api/http.js";
import { LoadingSkeleton } from "./shared";
import { D3BarChart } from "./stats";

export function StatsPanel() {
  const { copy } = useAppContext();

  const [monthData, setMonthData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function loadCharts() {
    setIsLoading(true);
    setMessage("");
    try {
      const [monthResult, groupResult] = await Promise.all([
        api.postsByMonth(),
        api.postsByGroup()
      ]);
      setMonthData(monthResult.data || []);
      setGroupData(groupResult.data || []);
      setMessage(copy.stats.loaded);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="panel" id="stats">
      <div className="panel-heading">
        <h2>{copy.stats.title}</h2>
        <button type="button" onClick={loadCharts} disabled={isLoading}>
          {copy.stats.load}
        </button>
      </div>
      {isLoading && <LoadingSkeleton lines={4} />}
      <div className="chart-grid">
        <D3BarChart data={monthData} labelKey="month" title={copy.stats.byMonth} />
        <D3BarChart data={groupData} labelKey="groupName" title={copy.stats.byGroup} />
      </div>
      {message && <p className="form-message">{message}</p>}
    </section>
  );
}
