package com.SoftwareMindTask.repository;

import com.SoftwareMindTask.entity.Task;
import com.SoftwareMindTask.entity.Type;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByTitleContainingIgnoreCase(String value, Pageable sort);

    List<Task> findByType(Type valueOf, Pageable sort);

    List<Task> findByTypeAndTitleContainingIgnoreCase(Type type, String title, Pageable sort);
}
