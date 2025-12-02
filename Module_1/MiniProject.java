package Module_1;
import java.io.FileWriter;
import java.util.ArrayList;
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

    void newStudents(ArrayList<Students> list, int rollNo,String name, double marks){
        
    }

    Students searchStudent(ArrayList<Students> list, int rollNo) {
        for (Students s : list) {
            if (s.rollNo == rollNo)
                return s;
        }
        return null;
    }

    boolean deleteStudent(ArrayList<Students> list, int rollNo) {
        for (Students s : list) {
            if (s.rollNo == rollNo) {
                list.remove(s);
                return true;
            }
        }
        return false;
    }

    boolean updateStudents(ArrayList<Students> list, int rollNo, String newname, double newmarks) {
        for (Students s : list) {
            if (s.rollNo == rollNo) {
                s.name = newname;
                s.marks = newmarks;
                return true;
            }
        }

        return false;
    }

    void saveToFile(ArrayList<Students> list) {
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

    ArrayList<Students> LoadFile(){
        ArrayList<Students> list =new ArrayList<>();
        try{
            File file=new File("Students.txt");
            Scanner scanner= new Scanner(file);
            while(scanner.hasNextLine()){
                String data= scanner.nextLine();
                String [] arr=data.split(":");
                list.add(new Students(Integer.valueOf(arr[0]),arr[1],Double.valueOf(arr[2])));
            }
            scanner.close();
        }
        catch(Exception e){
            System.out.println(e.getMessage());
        }
        return list;
    }
}

public class MiniProject {
    public static void main(String[] args) {
        ArrayList<Students> stu = new ArrayList<>();
        
        stu.add(new Students(2, "Shyam", 90.5));
        stu.add(new Students(3, "Ramu", 87.5));

        System.out.println("\nStudent List:");
        for (Students s : stu) {
            System.out.println(s);
        }

        Students sObj = new Students();
        Students result = sObj.searchStudent(stu, 6);
        System.out.println("\nSearch Result:");

        if (result != null)
            System.out.println(result);
        else
            System.out.println("Student Not Found");
        // System.out.println(sObj.updateStudents(stu, 1, "Rameshwar", 100));
        // sObj.saveToFile(stu);
        
        ArrayList<Students> st =sObj.LoadFile();
        st.stream()
            .sorted((a,b)-> Double.compare(a.marks,b.marks))
            .forEach(System.out::println);

    }
}