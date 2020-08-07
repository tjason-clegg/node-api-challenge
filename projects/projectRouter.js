const express = require("express");
const projects = require("../data/helpers/projectModel.js");

const router = express.Router();

//// GET REQUESTS ////

router.get("/", async (req, res) => {
  try {
    const allProjects = await projects.get();
    res.status(200).json(allProjects);
  } catch (error) {
    res.status(500).json({ error: "Error with the server, please try again" });
  }
});

//// POST REQUESTS ////

router.post("/", validateProject, async (req, res) => {
  const { body } = req;
  try {
    const newProject = await projects.insert(body);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: "Error with the server, please try again" });
  }
});

//// PUT REQUESTS ////

router.put("/:id", validateProjectID, validateProject, async (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  try {
    const updatedPost = await projects.update(id, body);
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Error with the server, please try again" });
  }
});

//// DELETE REQUESTS ////

router.delete("/:id", validateProjectID, async (req, res) => {
  const { id } = req.params;
  try {
    await projects.remove(id);
    res.status(200).send(`successfully deleted item with id ${id}`);
  } catch (error) {
    res.status(500).json({ error: "Error with the server, please try again" });
  }
});

//// CUSTOM MIDDLEWARE ////

function validateProject(req, res, next) {
  const { body } = req;

  if (!body.name || !body.description) {
    res.status(400).json({
      message: "Please provide a name and description for the project",
    });
  } else {
    next();
  }
}

async function validateProjectID(req, res, next) {
  const { id } = req.params;
  try {
    const project = await projects.get(id);
    if (!project) {
      res.status(404).json({ message: "Invalid project ID." });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({ error: "Error with the server, please try again" });
  }
}

module.exports = router;
