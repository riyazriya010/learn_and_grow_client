import LoggedOutHome from "@/components/home";


export default async function Home() {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  return (
    <div>
      <LoggedOutHome />
    </div>
  );
}
