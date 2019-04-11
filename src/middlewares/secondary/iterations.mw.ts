import { IterationsModel } from '@modelsSQL/Iterations.model';
import { TasksModel } from '@modelsSQL/Tasks.model';

/**
 * @file
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

export const mwCreateProjectIterations = (req, res, next) => {
   // req.iterations.createProject.project

   req.iterations.createProject.iterations = [];
   req.iterations.createProject.tasks = [];

   // For all defined iterations
   for (let iterationPrototype of req.body.iterations) {
      let iteration: IterationsModel = new IterationsModel();
      iteration.title = iterationPrototype.title;
      iteration.deadline = new Date(iterationPrototype.deadline);
      iteration.project = req.iterations.createProject.project;
      req.iterations.createProject.iterations.push(iteration);

      // For all iteration tasks
      for (let taskPrototype of iterationPrototype.tasks) {
         let task: TasksModel = new TasksModel();
         task.title = taskPrototype.title;
         task.description = taskPrototype.description;
         task.pointsMin = taskPrototype.pointsMin;
         task.pointsMax = taskPrototype.pointsMax;
         task.iteration = iteration;
         req.iterations.createProject.tasks.push(task);
      }
   }

   return next();
};
