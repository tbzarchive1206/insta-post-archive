import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import archiveData from "../app/data/archive.generated.json";
import { InstaArchive, type Archive } from "./InstaArchive";
import "./styles.css";
import "./audio.css";
import "./insta.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <InstaArchive data={archiveData as Archive} />
  </StrictMode>,
);
