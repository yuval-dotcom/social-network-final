import { GroupsPanel } from "../GroupsPanel.jsx";
import { PostsPanel } from "../PostsPanel.jsx";
import { UsersPanel } from "../UsersPanel.jsx";
import { ModelMap } from "./ModelMap.jsx";

export function ManagementView({ copy }) {
  return (
    <section className="management-view" id="manage">
      <div className="management-intro">
        <div>
          <p className="eyebrow">{copy.management.eyebrow}</p>
          <h2>{copy.management.title}</h2>
          <p>{copy.management.body}</p>
        </div>
        <div className="status-panel" aria-label="Project status">
          <span>API</span>
          <strong>Node + Express</strong>
          <span>DB</span>
          <strong>MongoDB Atlas</strong>
          <span>Client</span>
          <strong>React + jQuery Ajax</strong>
        </div>
      </div>
      <ModelMap copy={copy} />
      <UsersPanel copy={copy} />
      <GroupsPanel copy={copy} />
      <PostsPanel copy={copy} />
    </section>
  );
}
