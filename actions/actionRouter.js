const express = require("express");
const actions = require("../data/helpers/actionModel.js");
const projects = require("../data/helpers/projectModel.js");

const router = express.Router();

//// GET REQUESTS ////

router.get("/", async (req, res) => {
  try {
    const allActions = await actions.get();
    res.status(200).json(allActions);
  } catch (error) {
    res.status(500).json({ error: "Server error :(" });
  }
});

router.get("/:id", validateProjectID, async (req, res) => {
  const { id } = req.params;
  try {
    const allActions = await actions.get();
    const projectActions = allActions.filter(
      (action) => action.project_id === Number(id)
    );
    res.status(200).json(projectActions);
  } catch (error) {
    res.status(500).json({ error: "Server error :(" });
  }
});

//// POST REQUESTS ////

router.post("/:id", validateProjectID, validateAction, async (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  try {
    const payload = { ...body, project_id: id };
    const newAction = await actions.insert(payload);
    res.status(201).json(newAction);
  } catch (error) {
    res.status(500).json({ error: "Server error :(" });
  }
});

//// PUT REQUESTS ////

router.put("/:id", validateActionID, validateAction, async (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  try {
    const action = await actions.get(id);
    const payload = { ...body, project_id: action.project_id };
    const updatedAction = await actions.update(id, payload);
    res.status(200).json(updatedAction);
  } catch (error) {
    res.status(500).json({ error: "Error with the server, please try again" });
  }
});

//// DELETE REQUESTS ////

router.delete("/:id", validateActionID, async (req, res) => {
  const { id } = req.params;
  try {
    await actions.remove(id);
    res.status(200).send(`deleted action with id ${id}`);
  } catch (error) {
    res.status(500).json({ error: "Error with the server, please try again" });
  }
});

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

function validateAction(req, res, next) {
  const { body } = req;
  if (!body.description || !body.notes) {
    res.status(400).json({
      message: "Please provide a description and notes for this action.",
    });
  } else {
    next();
  }
}

async function validateActionID(req, res, next) {
  const { id } = req.params;
  try {
    const action = await actions.get(id);
    if (!action) {
      res.status(404).json({ message: "Invalid action ID." });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({ error: "Error with the server, please try again" });
  }
}

module.exports = router;
