package Module_1;
import java.io.File;

public class FileExample {

    public static void main(String[] args) {
        
        File file= new File("myfile.txt");

        try{
            if(file.createNewFile())
                System.out.println("File Created");
            else   
                System.out.println("Already Exists");

        }
        catch(Exception e){
            System.out.println(e.getStackTrace());
        }


    }
    
}
