import { redirect } from "next/navigation";

// POST function
export async function POST(req: Request) {
  
    const formData = await req.formData();
  
    const data: { [key: string]: any } = {};
    formData.forEach((value: any, key: string) => {
      data[key] = value;
    });

    const redirectUrl = `/pages/student/payment-success?courseName=${data.lastname}&courseId=${data.productinfo}&txnid=${data.txnid}&amountPaid=${data.amount}&bankRefNum=${data.bank_ref_num}`
  
    redirect(redirectUrl);

  }


  