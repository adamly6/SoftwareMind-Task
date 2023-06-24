package com.SoftwareMindTask.controller;

import com.SoftwareMindTask.entity.Task;
import com.SoftwareMindTask.entity.Type;
import com.SoftwareMindTask.repository.TaskRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tasks")
public class TaskController {

    private final TaskRepository taskRepository;

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable("id") Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
        return ResponseEntity.ok(task);
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        task.setDone(false);
        Task createdTask = taskRepository.save(task);

        return ResponseEntity.ok(createdTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable("id") Long id,@Valid @RequestBody Task taskData) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        task.setTitle(taskData.getTitle());
        task.setType(taskData.getType());
        task.setDescription(taskData.getDescription());
        task.setDone(taskData.isDone());

        Task updatedTask = taskRepository.save(task);
        return ResponseEntity.ok(updatedTask);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable("id") Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        taskRepository.delete(task);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/title")
    public ResponseEntity<List<Task>> getTasksByTitle(
            @RequestParam("title") String title,
            @RequestParam(value = "order", defaultValue = "asc") String order) {

        List<Task> tasks;

        if (order.equals("desc")) {
            tasks = taskRepository.findByTitleContainingOrderByTitleDesc(title);
        } else {
            tasks = taskRepository.findByTitleContainingOrderByTitleAsc(title);
        }

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/type")
    public ResponseEntity<List<Task>> getTasksByType(@RequestParam("type") Type type) {

        List<Task> tasks = taskRepository.findByType(type);
        return ResponseEntity.ok(tasks);
    }

}
