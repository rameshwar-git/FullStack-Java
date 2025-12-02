package Module_1;
import java.util.Scanner;

class primenumber {
    primenumber(){}

    public static boolean isPrime(int num){
        if(num<=1) return false;
        else if(num==2) return true;
        else if(num%2==0) return false;

        for(int i=3;i*i<=num;i+=2){
            if(num%i==0)
                return false;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        while(true){
            int n=sc.nextInt();
            boolean res=isPrime(n);
            System.out.println(res);
        
        }
      
    }

}