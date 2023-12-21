package ru.michael.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "lesson_type")
public class LessonType {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", length = 50)
    private String name;

    @OneToMany(mappedBy = "lessonType", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Lesson> lessons;

}