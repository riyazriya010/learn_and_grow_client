import { redirect } from "next/navigation";

export async function POST(req: any) {

  const formData = await req.formData();

  const data: { [key: string]: any } = {};
  formData.forEach((value: any, key: string) => {
    data[key] = value;
  });

  const { productinfo } = data;
console.log(productinfo);

  const redirectUrl = `https://learngrow.live/pages/student/payment-failure`;
  redirect(redirectUrl);
}