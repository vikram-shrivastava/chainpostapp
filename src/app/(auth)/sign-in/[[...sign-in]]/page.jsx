import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
export default function Page() {
  const isdark=true;
  return (
  <div className="flex justify-center items-center min-h-screen bg-base-200 dark:bg-base-900">
    <SignIn appearance={{ theme: dark }}/>
  </div>
  );
}