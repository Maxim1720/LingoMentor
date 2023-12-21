package ru.michael.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.michael.backend.entity.LessonType;

public interface LessonTypeRepository extends JpaRepository<LessonType, Long> {
}