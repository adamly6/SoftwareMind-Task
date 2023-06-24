package com.SoftwareMindTask.repository;

import com.SoftwareMindTask.entity.Task;
import com.SoftwareMindTask.entity.Type;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByTitleContainingOrderByTitleDesc(String title);

    List<Task> findByTitleContainingOrderByTitleAsc(String title);

    List<Task> findByType(Type type);
}
