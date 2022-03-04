import java.util.Arrays;

public class fill 
{
	int[] arr = new int[18];
	int j = 0;

	//A for loop that alternates between 0,1,2 and repeat in that order
	for(i=0; i < arr.length; i++){
		arr[i] = j;
		j++;
		if (j==3) {j = 0;} //Use a one liner to make it simpler and 

	}
	System.out.println(Arrays.toString(arr));
}