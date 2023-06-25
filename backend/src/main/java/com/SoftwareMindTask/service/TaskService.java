package com.SoftwareMindTask.service;

import com.SoftwareMindTask.entity.Task;
import com.SoftwareMindTask.entity.Type;
import com.SoftwareMindTask.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public List<Task> searchTasks(Type type, Pageable sort, String title) {

        List<Task> tasks;

        if (type != null && title != null) {
            tasks = taskRepository.findByTypeAndTitleContainingIgnoreCase(type, title, sort);
        } else if (type != null) {
            tasks = taskRepository.findByType(type, sort);
        } else if (title != null) {
            tasks = taskRepository.findByTitleContainingIgnoreCase(title, sort);
        } else {
            tasks = taskRepository.findAll(sort).getContent();
        }

        return tasks;
    }

    public Task getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
        return task;
    }

    public Task createTask(Task task) {
        task.setDone(false);
        Task createdTask = taskRepository.save(task);

        return createdTask;
    }

    public Task updateTask(Long id, Task taskData) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        task.setTitle(taskData.getTitle());
        task.setType(taskData.getType());
        task.setDescription(taskData.getDescription());
        task.setDone(taskData.isDone());

        Task updatedTask = taskRepository.save(task);
        return updatedTask;
    }

    public Void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        taskRepository.delete(task);

        return null;
    }
}
