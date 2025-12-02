package Module_1;
import java.util.ArrayList;
import java.util.HashMap;

public class ArrayListEx {
    public static void main(String[] args) {
        HashMap<Integer,String> arr=new HashMap<>(); 
        arr.put(1,"Lamboragni");
        arr.put(2,"BMW");
        arr.put(3,"Suziki");
        arr.put(4,"Kwa");
        arr.put(5,"Bugati");
        
        for(HashMap.Entry<Integer,String> e: arr.entrySet()){
            System.out.println(e.getKey()+":"+e.getValue());
        }
        System.out.println(arr);
        for(String val : arr.values()){
            System.out.println(val);
        }
    }
}
