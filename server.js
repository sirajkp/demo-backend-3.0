import express from "express";
import cors from "cors";

import userRoutes from "./Routes/userRoutes.js";
import leadsRoutes from "./Routes/leadsRoutes.js";
import orgRoutes from "./Routes/orgRoutes.js";
import contactsRoutes from "./Routes/contactsRoutes.js";
import inboxRoutes from "./Routes/inboxRoutes.js";
import assignmentRulesRoutes from "./Routes/assignmentRulesRoutes.js";
import notificationCentreRoutes from "./Routes/notificationCentreRoutes.js";
import userPreferencesRoutes from "./Routes/userPreferencesRoutes.js";
import objectManagerRoutes from "./Routes/objectManagerRoutes.js";
import formsRoutes from "./Routes/formsRoutes.js";
import emailTemplatesRoutes from "./Routes/emailTemplatesRoutes.js";
import projectPipelineRoutes from "./Routes/projectPipelineRoutes.js";
import pipelinesRoutes from "./Routes/pipelinesRoutes.js";

const app = express();
app.use(
  cors({
    origin: "*",
    // No cookie-based auth here (Cognito bearer tokens), and "credentials: true"
    // is invalid alongside a wildcard origin - browsers reject the pair.
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    // ngrok-skip-browser-warning is a custom header, so it has to be allowed
    // explicitly or the preflight fails.
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
    ],
  }),
);

app.use(express.json());

// Register the routes
app.use("/api/users", userRoutes);

app.use("/leads", leadsRoutes);

app.use("/organisations", orgRoutes);

app.use("/contacts", contactsRoutes);

app.use("/inbox", inboxRoutes);

app.use("/assignment-rules", assignmentRulesRoutes);

app.use("/notification-center", notificationCentreRoutes);

app.use("/user-preferences", userPreferencesRoutes);
app.use("/object-manager", objectManagerRoutes);
app.use("/project-pipeline", projectPipelineRoutes);
app.use("/pipelines", pipelinesRoutes);

app.use("/forms", formsRoutes);

app.use("/email-templates", emailTemplatesRoutes);

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
