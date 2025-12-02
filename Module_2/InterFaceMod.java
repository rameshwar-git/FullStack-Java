package Module_2;

interface MathOp{
    int Op(int a,int b);
}

public class InterFaceMod {
    public static void main(String[] args) {
        MathOp sum = (a, b)-> a+b;
        MathOp sub = (a, b)-> a-b;
        MathOp div = (a, b)-> a/b;
        MathOp mul = (a, b)-> a*b;
        
        System.out.println(sum.Op(5,6));
        System.out.println(sub.Op(5,6));
        System.out.println(div.Op(5,6));
        System.out.println(mul.Op(5,6));
    }
}
