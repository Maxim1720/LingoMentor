package ru.michael.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.michael.backend.entity.Teacher;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
}