package com.SoftwareMindTask.controller;

import com.SoftwareMindTask.entity.Task;
import com.SoftwareMindTask.entity.Type;
import com.SoftwareMindTask.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;





@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4173"})
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;
    @GetMapping
    public Page<Task> searchTasks(
            @RequestParam(value = "type", required = false) Type type,
            Pageable sort,
            @RequestParam(value = "title", required = false) String title) {
        return taskService.searchTasks(type, sort, title);
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable("id") Long id) {

        return taskService.getTaskById(id);
    }

    @PostMapping
    public Task createTask(@Valid @RequestBody Task task) {

        return taskService.createTask(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable("id") Long id,@Valid @RequestBody Task taskData) {

        return taskService.updateTask(id, taskData);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable("id") Long id) {

        taskService.deleteTask(id);
    }

}




