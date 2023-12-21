package ru.michael.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "teacher")
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "firstname", length = 50)
    private String firstname;

    @Column(name = "lastname", length = 50)
    private String lastname;

    @Column(name = "expirience")
    private Integer experience;

    @Column(name = "contacts", length = 250)
    private String contacts;

    @OneToMany(targetEntity = Lesson.class, mappedBy = "teacher",
            cascade = CascadeType.ALL)
    private Set<Lesson> lessons;


}