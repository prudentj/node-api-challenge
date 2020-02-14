const express = require('express');
const projectDB = require('./data/helpers/projectModel');
const router = express.Router();

router.post('/', validateProject, (req, res) => {
	res.status(201).json(req.project);
});

router.get('/', (req, res) => {
	projectDB
		.get()
		.then(projects => {
			res.status(200).json(projects);
		})
		.catch(error => {
			res.status(500).json({message: 'Error retrieving users'});
		});
});
router.get('/:id/actions', validateProjectID, (req, res) => {
	res.status(200).json(req.project.actions);
});
router.get('/:id', validateProjectID, (req, res) => {
	res.status(200).json(req.project);
});
router.put('/:id', validateProjectID, (req, res) => {
	!req.body
		? res.status(400).json({message: 'missing project data'})
		: !req.body.name
		? res.status(400).json({message: 'missing required name field'})
		: !req.body.description
		? res.status(400).json({message: 'missing project description field'})
		: projectDB
				.update(req.params.id, req.body)
				.then(project => {
					res.status(200).json({project});
				})
				.catch(error => {
					res.status(500).json({error: 'Failed to update project'});
				});
});

router.delete('/:id', validateProjectID, (req, res) => {
	projectDB
		.remove(req.project.id)
		.then(res.status(200).json({message: 'Project Deleted'}))
		.catch(res.status(500).json({error: 'Failed to remove Project'}));
});

//middleware
function validateProjectID(req, res, next) {
	projectDB
		.get(req.params.id)
		.then(project => {
			req.project = project;
			project.id
				? next()
				: res.status(400).json({error: 'User id not formated correctly'});
		})
		.catch(error => res.status(404).json({error: 'Project does not exist!'}));
}
function validateProject(req, res, next) {
	!req.body
		? res.status(400).json({message: 'missing project data'})
		: !req.body.name
		? res.status(400).json({message: 'missing required name field'})
		: !req.body.description
		? res.status(400).json({message: 'missing project description field'})
		: // : req.body.completed
		  // ? (req.body.completed = true)
		  // : (req.body.completed = false);
		  projectDB
				.insert(req.body)
				.then(project => {
					req.project = project;
					next();
				})
				.catch(error => {
					res.status(500).json({message: 'Error retrieving user project info'});
				});
}
module.exports = router;

// | Field       | Data Type | Metadata
// | ----------- | --------- | --------------------------------------------------------------------------- |
// | id          | number    | no need to provide it when creating projects, the database will generate it |
// | name        | string    | required.                                                                   |
// | description | string    | required.                                                                   |
// | completed   | boolean   | used to indicate if the project has been completed, not required
