const router = require('express').Router();
let Task = require('../models/task.model');

// GET: Retrieve all tasks
router.route('/').get((req, res) => {
  Task.find()
    .sort({ date: -1, createdAt: -1 }) // Sort by date desc, then by creation time desc
    .then(tasks => res.json(tasks))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST: Add new tasks (supports adding one or multiple tasks)
router.route('/').post((req, res) => {
    const tasksData = Array.isArray(req.body) ? req.body : [req.body];
    
    if (tasksData.length === 0) {
        return res.status(400).json('Error: No tasks provided.');
    }

    Task.insertMany(tasksData)
        .then(docs => res.status(201).json(docs))
        .catch(err => res.status(400).json('Error: ' + err));
});

// DELETE: Delete a task by its ID
router.route('/:id').delete((req, res) => {
    Task.findByIdAndDelete(req.params.id)
        .then(task => {
            if (!task) {
                return res.status(404).json('Error: Task not found.');
            }
            res.json({ message: 'Task deleted.' });
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// PATCH: Update a task by its ID (status or text)
router.route('/:id').patch((req, res) => {
    Task.findById(req.params.id)
        .then(task => {
            if (!task) {
                return res.status(404).json('Error: Task not found.');
            }
            
            // Update fields if they exist in the request body
            if (req.body.status !== undefined) {
              task.status = req.body.status;
            }
            if (req.body.text !== undefined) {
              task.text = req.body.text;
            }

            task.save()
                .then((updatedTask) => res.json(updatedTask))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
