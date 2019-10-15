const express = require('express');

const server = express();
server.use(express.json());

/*
Objetivo: Criar uma aplicação que armazena projetos e suas tarefas
*/
let numbersRequets = 0
const projects = [];

//Middleware para checar se o projeto existe
function checkProject(req, res, next) {
	const { id } = req.params
	const project = projects.find(pjt => pjt.id == id);

	if (!project) {
		return res.status(400).json({
			error: 'Project not find or incorrect'
		})
	}
	return next()

}
//MIddlaware global
function requestsApi(req, res, next) {
	numbersRequets++

	console.log(`Numero de requisições no sistema: ${numbersRequets}`)

	return next()
}

//Chamando o middleware global
server.use(requestsApi)


//Listar projetos
server.get('/projects', (req, res) => {
	return res.json(projects);
});
//Adicionar um projeto
server.post('/projects', (req, res) => {
	const { id, title } = req.body;

	const project = {
		id,
		title,
		tasks: []
	};
	projects.push(project);

	return res.json(projects);
});
//Atualizar título do projeto
server.put('/projects/:id', checkProject, (req, res) => {
	const { id } = req.params;
	const { title } = req.body;

	const project = projects.find(pjt => pjt.id == id);

	project.title = title

	return res.json(project)
});
//Adicionar task ao projeto
server.post('/projects/:id/tasks', checkProject, (req, res) => {
	const { id } = req.params
	const { title } = req.body

	const project = projects.find(pjt => pjt.id == id)

	project.tasks.push(title)


	return res.json(project)

})
//Remover projeto
server.delete('/projects/:id', checkProject, (req, res) => {
	const { id } = req.params

	const projectPosition = projects.findIndex(pjt => pjt.id == id);

	projects.splice(projectPosition, 1)

	return res.send()

})

server.listen(4400);
