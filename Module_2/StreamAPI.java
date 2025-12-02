package Module_2;
import java.util.*;
import java.util.Arrays;

public class StreamAPI {
    public static void main(String[] args) {
        List<Integer> l= Arrays.asList(1,2,3,4,5,6,7,8,9,0);
        l.stream().filter(n-> n%2==0).forEach(System.out::println);

        int sum= l.stream().reduce(0, (a,b)->a+b);
        System.out.println(sum);
    }
}
