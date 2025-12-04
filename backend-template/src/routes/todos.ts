import express, { Request, Response } from 'express';
import { Todo, Priority, Status } from '../models/Todo';

const router = express.Router();

interface CreateTodoRequest {
  title: string;
  priority?: Priority;
  status?: Status;
}

interface ListTodosRequest {
  page?: number;
  limit?: number;
  status?: Status;
  priority?: Priority;
} 

router.post('/', async (req: Request<{}, {}, CreateTodoRequest>, res: Response) => {
  try {
    const { title, priority = Priority.MEDIUM, status = Status.PENDING } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const todo = new Todo({
      title: title.trim(),
      priority,
      status
    });

    const savedTodo = await todo.save();

    return res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: savedTodo
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating todo',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      });
    }

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: deletedTodo
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting todo',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/', async (req: Request<{}, {}, ListTodosRequest>, res: Response) => {
  try {
    const { page , limit = 10, status, priority } = req.query as unknown as ListTodosRequest;
    
    if(Number(page) < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page number must be greater than 0'
      });
    }
     
    const startIndex: number = (Number(page) - 1) * Number(limit);
    
    const endIndex = Number(page) * Number(limit);
    
    const todos = await Todo.find({status, priority}).skip(startIndex).limit(endIndex);

    
    
    return res.status(200).json({
      success: true,
      message: 'Todos listed successfully',
      data: todos
    });
  
} catch (error) {
  return res.status(500).json({
    success: false,
    message: 'Error listing todos',
    error: error instanceof Error ? error.message : 'Unknown error'
  });
}
});

export default router;