const express = require('express');
const checklistDependentRoute = express.Router();
const Checklist = require('../models/checklist');
const task = require('../models/task');
const Task = require('../models/task');
const simpleRoute = express.Router()

checklistDependentRoute.get('/:id/tasks/new', async (req, res)=>{
    try {
        let task = Task()
        res.status(200).render('tasks/new', {checklistId: req.params.id, task: task})
    } catch (error) {
        res.status(422).render('pages/error',{errors: 'erro ao carregar o formulario'})
    }
})

checklistDependentRoute.post('/:id/tasks', async (req, res) => {
    let  { name } = req.body.task
    let task = new Task({name, checklist: req.params.id})

    try {
        await task.save()
        let checklist = await Checklist.findById(req.params.id)
        checklist.tasks.push(task)
        await checklist.save()
        res.redirect(`/checklists/${req.params.id}`)
        
    } catch (error) {
        let errors = error.errors
        res.status(422).render('task/new', {task: { ...task. errors}, checklistId: req.params.id})
    }
})


simpleRoute.delete('/:id', async(req, res) => {
    try {
      let task = await Task.findByIdAndDelete(req.params.id)
      let checklist = await Checklist.findById(task.checklist)
      let taskToRemove = checklist.tasks.indexOf(task._id)
      let {tasks} = checklist // extrai as task para um array
      tasks.splice(taskToRemove,1) // exclui a task selecionada
      checklist.tasks = tasks // atualiza as tasks no checklist
      checklist.save() 
      res.redirect(`/checklists/${checklist._id}`)
    } catch (error) {
      res.status(200).render('pages/error', {error})
    }
  })

simpleRoute.put('/:id', async(req,res)=>{
    let task = await    Task.findById(req.params.id)
    try {
        task.set(req.body.task)
        await task.save()
        res.status(200).json({ task })
        
    } catch (error) {
        let errors = error.errors
        res.status(422).json({task: {...errors}})

    }
})


module.exports = {
    checklistDependent: checklistDependentRoute,
    simple: simpleRoute
}