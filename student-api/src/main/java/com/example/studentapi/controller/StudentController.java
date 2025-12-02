package com.example.studentapi.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;

import com.example.studentapi.model.Student;
import com.example.studentapi.service.StudentService;
import org.springframework.data.domain.Page;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents(){
        List<Student> all = studentService.getAll();
        return ResponseEntity.ok(all);
    }

    // GET by id -> return 200 or 404
    @GetMapping("/{rollNo}")
    public ResponseEntity<Student> getStudent(@PathVariable int rollNo) {
        Student s = studentService.getByRoll(rollNo);
        if (s == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(s);
    }

    // POST -> 201 Created
    @PostMapping
    public ResponseEntity<Student> addStudent(@Valid @RequestBody Student student) {
        Student saved = studentService.addStudent(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT -> 200 OK (updated) or 404 if not found
    @PutMapping("/{rollNo}")
    public ResponseEntity<String> updateStudent(@PathVariable int rollNo, @Valid @RequestBody Student updated) {
        boolean ok = studentService.updateStudent(rollNo, updated);
        if (ok) {
            return ResponseEntity.ok("Updated Successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student Not Found");
        }
    }

    // DELETE -> 204 No Content if deleted, 404 if not found
    @DeleteMapping("/{rollNo}")
    public ResponseEntity<Void> deleteStudent(@PathVariable int rollNo) {
        boolean ok = studentService.deleteStudent(rollNo);
        if (ok) {
            return ResponseEntity.noContent().build(); // 204
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Pagination endpoint unchanged
    @GetMapping("/page")
    public Page<Student> getStudentsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "rollNo") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        return studentService.getAllPaged(page, size, sortBy, direction);
    }
}
