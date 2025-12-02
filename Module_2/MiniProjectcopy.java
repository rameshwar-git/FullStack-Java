package Module_2;

import java.io.FileWriter;
import java.util.*;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;
import java.io.File;

class Students {
    int rollNo;
    String name;
    double marks;

    Students() {
    }

    Students(int rollNo, String name, double marks) {
        this.rollNo = rollNo;
        this.name = name;
        this.marks = marks;
    }

    @Override
    public String toString() {
        return "Roll No : " + rollNo + " | Name : " + name + " | Marks : " + marks;
    }

    void newStudents(List<Students> list, int rollNo, String name, double marks) {

    }

    Students searchStudent(List<Students> list, int rollNo) {
        for (Students s : list) {
            if (s.rollNo == rollNo)
                return s;
        }
        return null;
    }

    boolean deleteStudent(List<Students> list, int rollNo) {
        for (Students s : list) {
            if (s.rollNo == rollNo) {
                list.remove(s);
                return true;
            }
        }
        return false;
    }

    boolean updateStudents(List<Students> list, int rollNo, String newname, double newmarks) {
        for (Students s : list) {
            if (s.rollNo == rollNo) {
                s.name = newname;
                s.marks = newmarks;
                return true;
            }
        }

        return false;
    }

    void saveToFile(List<Students> list) {
        try {
            FileWriter fw = new FileWriter("Students.txt");
            for (Students s : list) {
                fw.write(s.rollNo + ":" + s.name + ":" + s.marks + "\n");
            }
            fw.close();

        } catch (Exception e) {
            System.out.println(e.getStackTrace());
        }
    }

    List<Students> LoadFile() {
        List<Students> list = new ArrayList<>();
        try {
            File file = new File("Students.txt");
            Scanner scanner = new Scanner(file);
            while (scanner.hasNextLine()) {
                String data = scanner.nextLine();
                String[] arr = data.split(":");
                list.add(new Students(Integer.valueOf(arr[0]), arr[1], Double.valueOf(arr[2])));
            }
            scanner.close();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return list;
    }
}

public class MiniProjectcopy {
    public static void main(String[] args) {
        List<Students> stu = Arrays.asList(
                new Students(1, "Aryan", 85),
                new Students(2, "Ramu", 72),
                new Students(3, "Mohan", 91),
                new Students(4, "Neha", 66),
                new Students(5, "Kiran", 95));
        System.out.println("\nStudent List:");
        for (Students s : stu) {
            System.out.println(s);
        }
        System.out.println();

        // Students sObj = new Students();
        // Students result = sObj.searchStudent(stu, 6);
        // System.out.println("\nSearch Result:");

        // if (result != null)
        // System.out.println(result);
        // else
        // System.out.println("Student Not Found");
        // System.out.println(sObj.updateStudents(stu, 1, "Rameshwar", 100));
        // sObj.saveToFile(stu);

        // List<Students> st = sObj.LoadFile();
        stu.stream().filter(n -> (n.marks > 80))
                .forEach(System.out::println);

        System.out.println();

        stu.stream().map(n -> n.name).forEach(System.out::println);
        stu.stream().sorted((a,b) -> Double.compare(b.marks, a.marks )).forEach(System.out::println);

        List<Double> li= stu.stream().map(n->n.marks).toList();

        double max=li.stream().max(Double::compare).get();
        double avg= li.stream().mapToDouble(n->n).average().getAsDouble();

        System.out.println(max);
        System.out.println(avg);


        Optional<Students> top = Optional.ofNullable(stu.stream().max((a,b)->Double.compare(a.marks,b.marks)).orElse(null));

        top.ifPresent(s->System.out.println(s.name+":"+s.marks));
        Students fallback =top.orElse(new Students(0,"---",0));
        System.out.println("Fallback:"+fallback.name);

        stu.forEach(System.out::println);

    }
}