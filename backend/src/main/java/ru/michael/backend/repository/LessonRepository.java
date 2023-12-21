package ru.michael.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.michael.backend.entity.Lesson;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
}