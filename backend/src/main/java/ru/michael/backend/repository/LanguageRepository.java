package ru.michael.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.michael.backend.entity.Language;

public interface LanguageRepository extends JpaRepository<Language, Long> {
}