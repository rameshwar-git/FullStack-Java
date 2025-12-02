package Module_2;

import java.time.LocalDate;
import java.time.Period;

public class DateDemo {
    public static void main(String[] args) {
        LocalDate ld =LocalDate.now();

        System.out.println(ld.getDayOfMonth());
        System.out.println(ld.plusDays(7));
        System.out.println(ld.getMonthValue());
        System.out.println(ld.minusMonths(1));

        LocalDate courseStart =LocalDate.of(2025,1,2);
        LocalDate today= LocalDate.now();

        Period p= Period.between(courseStart, today);

        System.out.println(p.getMonths()+"-"+p.getDays());
    }
    
}
