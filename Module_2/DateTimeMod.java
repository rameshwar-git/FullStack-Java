package Module_2;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Period;

public class DateTimeMod {
    public static void main(String[] args) {
        LocalDate today = LocalDate.now();
        LocalDate dob = LocalDate.of(2003,07,25);
        LocalTime now = LocalTime.now();
        LocalDateTime lts=LocalDateTime.now();
    
        System.out.println(today);
        System.out.println(dob);
        System.out.println(today.getYear());
        System.out.println(today.getMonth());
        System.out.println(today.getDayOfMonth());

        System.out.println("\n"+now);
        System.out.println(now.getHour());
        System.out.println(now.getMinute());

        System.out.println("\n"+lts);

        Period p= Period.between(today, dob);
        System.out.println(p);

        

    }    
}
